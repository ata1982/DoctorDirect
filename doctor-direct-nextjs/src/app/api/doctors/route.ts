import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { doctorSchema } from '@/lib/validations'

// 医師一覧取得（動的データフェッチ）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const specialization = searchParams.get('specialization')
    const location = searchParams.get('location')
    const available = searchParams.get('available') === 'true'

    // 動的クエリビルド
    const where: any = {
      isActive: true
    }

    if (specialization) {
      where.specializations = {
        hasSome: [specialization]
      }
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    if (available) {
      where.isAvailable = true
    }

    // ページネーション付きでデータ取得
    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              isActive: true
            }
          },
          hospital: {
            select: {
              id: true,
              name: true,
              address: true
            }
          },
          appointments: {
            where: {
              status: 'CONFIRMED',
              appointmentDate: {
                gte: new Date()
              }
            },
            select: {
              id: true,
              appointmentDate: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.doctor.count({ where })
    ])

    // 動的データ処理（評価平均計算）
    const doctorsWithRating = doctors.map(doctor => ({
      ...doctor,
      averageRating: doctor.reviews.length > 0 
        ? doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length
        : 0,
      upcomingAppointmentsCount: doctor.appointments.length,
      reviews: undefined // レスポンスから除外
    }))

    return NextResponse.json({
      success: true,
      data: {
        doctors: doctorsWithRating,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total,
          limit
        },
        filters: {
          specialization,
          location,
          available
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('医師一覧取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: '医師情報の取得に失敗しました'
    }, { status: 500 })
  }
}

// 医師新規登録
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: '管理者権限が必要です'
      }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = doctorSchema.parse(body)

    // トランザクション処理でユーザーと医師を作成
    const result = await prisma.$transaction(async (tx) => {
      // ユーザーアカウント作成
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          role: 'DOCTOR',
          isActive: true
        }
      })

      // 医師プロフィール作成
      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          licenseNumber: validatedData.licenseNumber,
          specializations: validatedData.specializations,
          experience: validatedData.experience,
          education: validatedData.education,
          bio: validatedData.bio,
          consultationFee: validatedData.consultationFee,
          availableHours: validatedData.availableHours,
          location: validatedData.location,
          languages: validatedData.languages,
          hospitalId: validatedData.hospitalId,
          isAvailable: true,
          isVerified: false
        },
        include: {
          user: true,
          hospital: true
        }
      })

      // 通知作成
      await tx.notification.create({
        data: {
          userId: user.id,
          title: '医師アカウント作成完了',
          content: 'ドクターダイレクトにご登録いただき、ありがとうございます。アカウントの認証をお待ちください。',
          type: 'ACCOUNT_CREATED',
          isRead: false
        }
      })

      return doctor
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: '医師アカウントが正常に作成されました'
    }, { status: 201 })

  } catch (error) {
    console.error('医師登録エラー:', error)
    return NextResponse.json({
      success: false,
      error: '医師の登録に失敗しました'
    }, { status: 500 })
  }
}