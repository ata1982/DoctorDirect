import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { doctorSchema } from '@/lib/validations'

interface Params {
  params: { id: string }
}

// 特定の医師情報取得（動的SSR）
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params
    
    // リアルタイムで最新の医師情報を取得
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isActive: true,
            createdAt: true
          }
        },
        hospital: {
          include: {
            departments: true
          }
        },
        appointments: {
          where: {
            appointmentDate: {
              gte: new Date()
            }
          },
          include: {
            patient: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            appointmentDate: 'asc'
          }
        },
        consultations: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            patient: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        reviews: {
          include: {
            patient: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!doctor) {
      return NextResponse.json({
        success: false,
        error: '医師が見つかりません'
      }, { status: 404 })
    }

    // 動的統計情報の計算
    const stats = {
      averageRating: doctor.reviews.length > 0 
        ? doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length
        : 0,
      totalReviews: doctor.reviews.length,
      upcomingAppointments: doctor.appointments.length,
      activeConsultations: doctor.consultations.length,
      experienceYears: doctor.experience || 0
    }

    return NextResponse.json({
      success: true,
      data: {
        ...doctor,
        stats,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('医師情報取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: '医師情報の取得に失敗しました'
    }, { status: 500 })
  }
}

// 医師情報更新
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    const { id } = params
    
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: '認証が必要です'
      }, { status: 401 })
    }

    // 権限チェック（医師本人または管理者）
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!doctor) {
      return NextResponse.json({
        success: false,
        error: '医師が見つかりません'
      }, { status: 404 })
    }

    if (session.user.role !== 'ADMIN' && session.user.id !== doctor.userId) {
      return NextResponse.json({
        success: false,
        error: '更新権限がありません'
      }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = doctorSchema.partial().parse(body)

    // トランザクションで更新
    const updatedDoctor = await prisma.$transaction(async (tx) => {
      // ユーザー情報の更新
      if (validatedData.name || validatedData.email) {
        await tx.user.update({
          where: { id: doctor.userId },
          data: {
            name: validatedData.name,
            email: validatedData.email
          }
        })
      }

      // 医師情報の更新
      const { name, email, ...doctorData } = validatedData
      const updated = await tx.doctor.update({
        where: { id },
        data: {
          ...doctorData,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          hospital: true
        }
      })

      // 更新ログの作成
      await tx.activityLog.create({
        data: {
          userId: session.user.id!,
          action: 'UPDATE_DOCTOR_PROFILE',
          entityType: 'DOCTOR',
          entityId: id,
          description: `医師プロフィールが更新されました: ${updated.user?.name}`
        }
      })

      return updated
    })

    return NextResponse.json({
      success: true,
      data: updatedDoctor,
      message: '医師情報が正常に更新されました'
    })

  } catch (error) {
    console.error('医師情報更新エラー:', error)
    return NextResponse.json({
      success: false,
      error: '医師情報の更新に失敗しました'
    }, { status: 500 })
  }
}

// 医師アカウント削除（論理削除）
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    const { id } = params
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: '管理者権限が必要です'
      }, { status: 403 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        appointments: {
          where: {
            status: 'CONFIRMED',
            appointmentDate: {
              gte: new Date()
            }
          }
        }
      }
    })

    if (!doctor) {
      return NextResponse.json({
        success: false,
        error: '医師が見つかりません'
      }, { status: 404 })
    }

    // 予約がある場合は削除を拒否
    if (doctor.appointments.length > 0) {
      return NextResponse.json({
        success: false,
        error: '予約済みの診察があるため削除できません'
      }, { status: 400 })
    }

    // 論理削除の実行
    await prisma.$transaction(async (tx) => {
      await tx.doctor.update({
        where: { id },
        data: {
          isActive: false,
          isAvailable: false
        }
      })

      await tx.user.update({
        where: { id: doctor.userId },
        data: {
          isActive: false
        }
      })

      // 削除ログの作成
      await tx.activityLog.create({
        data: {
          userId: session.user.id!,
          action: 'DELETE_DOCTOR',
          entityType: 'DOCTOR',
          entityId: id,
          description: `医師アカウントが削除されました: ${doctor.user?.name}`
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: '医師アカウントが正常に削除されました'
    })

  } catch (error) {
    console.error('医師削除エラー:', error)
    return NextResponse.json({
      success: false,
      error: '医師の削除に失敗しました'
    }, { status: 500 })
  }
}