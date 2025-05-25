import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { appointmentSchema } from '@/lib/validations'
import { AppointmentStatus, PaymentStatus, NotificationType, RewardType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = appointmentSchema.parse(body)
    const { doctorId, scheduledAt, type, symptoms, notes } = validatedData

    // 医師の存在確認
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: true }
    })

    if (!doctor || !doctor.isVerified) {
      return NextResponse.json(
        { error: '指定された医師が見つからないか、認証されていません' },
        { status: 404 }
      )
    }

    // 予約時間の重複チェック
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        scheduledAt: new Date(scheduledAt),
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS]
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'この時間は既に予約されています' },
        { status: 400 }
      )
    }

    // 予約作成
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId,
        hospitalId: doctor.hospitalId,
        scheduledAt: new Date(scheduledAt),
        type,
        symptoms,
        notes,
        fee: doctor.consultationFee,
        status: AppointmentStatus.SCHEDULED,
        paymentStatus: PaymentStatus.PENDING
      },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        },
        doctor: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            hospital: { select: { id: true, name: true, address: true } }
          }
        }
      }
    })

    // 医師への通知作成
    await prisma.notification.create({
      data: {
        userId: doctor.userId,
        type: NotificationType.APPOINTMENT_CONFIRMED,
        title: '新しい予約',
        message: `${session.user.name}さんから新しい予約が入りました`,
        data: { appointmentId: appointment.id }
      }
    })

    // 初回予約の場合は報酬付与
    const isFirstAppointment = await prisma.appointment.count({
      where: { patientId: session.user.id }
    }) === 1

    if (isFirstAppointment) {
      await prisma.userReward.create({
        data: {
          userId: session.user.id,
          type: RewardType.FIRST_APPOINTMENT,
          points: 50,
          description: '初回予約ボーナス'
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: '予約が完了しました',
      data: appointment
    }, { status: 201 })

  } catch (error) {
    console.error('Appointment creation error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '入力データが無効です', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '予約の作成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // 検索条件の構築
    const whereConditions: any = {}

    // ユーザーロールに応じた条件設定
    if (session.user.role === 'PATIENT') {
      whereConditions.patientId = session.user.id
    } else if (session.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: session.user.id }
      })
      if (doctor) {
        whereConditions.doctorId = doctor.id
      }
    }

    // ステータスフィルター
    if (status) {
      whereConditions.status = status
    }

    const [appointments, totalCount] = await Promise.all([
      prisma.appointment.findMany({
        where: whereConditions,
        include: {
          patient: {
            select: { id: true, name: true, email: true, image: true }
          },
          doctor: {
            include: {
              user: { select: { id: true, name: true, email: true, image: true } },
              hospital: { select: { id: true, name: true, address: true, phone: true } }
            }
          },
          consultation: {
            select: { id: true, status: true, startedAt: true, endedAt: true }
          }
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.appointment.count({ where: whereConditions })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      }
    })

  } catch (error) {
    console.error('Appointments fetch error:', error)
    return NextResponse.json(
      { error: '予約データの取得中にエラーが発生しました' },
      { status: 500 }
    )
  }
}