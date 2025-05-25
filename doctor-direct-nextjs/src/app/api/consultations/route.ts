import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { aiService } from '@/lib/ai-service'

// 相談開始API
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: '認証が必要です'
      }, { status: 401 })
    }

    const { doctorId, symptoms, urgency, preferredTime } = await request.json()

    if (!doctorId || !symptoms) {
      return NextResponse.json({
        success: false,
        error: '医師IDと症状の入力が必要です'
      }, { status: 400 })
    }

    // 医師の可用性チェック
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: true,
        consultations: {
          where: {
            status: 'ACTIVE'
          }
        }
      }
    })

    if (!doctor || !doctor.isAvailable) {
      return NextResponse.json({
        success: false,
        error: '選択された医師は現在利用できません'
      }, { status: 400 })
    }

    // 同時相談数の制限チェック
    if (doctor.consultations.length >= 3) {
      return NextResponse.json({
        success: false,
        error: '医師が多忙です。しばらく後に再試行してください'
      }, { status: 429 })
    }

    // 事前AI分析
    const preAnalysis = await aiService.analyzeSymptoms(symptoms)

    // 相談セッション作成
    const consultation = await prisma.$transaction(async (tx) => {
      const newConsultation = await tx.consultation.create({
        data: {
          patientId: session.user.id!,
          doctorId,
          symptoms,
          urgency: urgency || 'MEDIUM',
          status: 'WAITING_FOR_DOCTOR',
          preferredTime: preferredTime ? new Date(preferredTime) : null,
          preAnalysis: preAnalysis.success ? JSON.stringify(preAnalysis.data) : null,
          estimatedDuration: urgency === 'HIGH' ? 30 : 20
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })

      // 医師への通知作成
      await tx.notification.create({
        data: {
          userId: doctor.userId,
          title: '新しい相談リクエスト',
          content: `${session.user.name}さんから相談リクエストが届きました。症状: ${symptoms.substring(0, 50)}...`,
          type: 'CONSULTATION_REQUEST',
          entityType: 'CONSULTATION',
          entityId: newConsultation.id,
          isRead: false
        }
      })

      // 患者への確認通知
      await tx.notification.create({
        data: {
          userId: session.user.id!,
          title: '相談リクエスト送信完了',
          content: `${doctor.user?.name}医師への相談リクエストを送信しました。`,
          type: 'CONSULTATION_CREATED',
          entityType: 'CONSULTATION',
          entityId: newConsultation.id,
          isRead: false
        }
      })

      return newConsultation
    })

    // リアルタイム通知（Socket.io経由）
    const io = global.io
    if (io) {
      io.to(`user-${doctor.userId}`).emit('new-consultation-request', {
        consultation,
        priority: urgency === 'HIGH'
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        consultation,
        preAnalysis: preAnalysis.success ? preAnalysis.data : null,
        estimatedWaitTime: calculateEstimatedWaitTime(doctor.consultations.length),
        message: '相談リクエストが正常に送信されました'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('相談開始エラー:', error)
    return NextResponse.json({
      success: false,
      error: '相談の開始に失敗しました'
    }, { status: 500 })
  }
}

// 相談一覧取得（ユーザー別）
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: '認証が必要です'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    // ユーザーの役割に応じて条件を設定
    if (session.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findFirst({
        where: { userId: session.user.id }
      })
      if (doctor) {
        where.doctorId = doctor.id
      }
    } else {
      where.patientId = session.user.id
    }

    if (status) {
      where.status = status
    }

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          },
          chatMessages: {
            orderBy: {
              timestamp: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.consultation.count({ where })
    ])

    // 相談データの拡張（最新メッセージ情報を含む）
    const enhancedConsultations = consultations.map(consultation => ({
      ...consultation,
      lastMessage: consultation.chatMessages[0] || null,
      unreadCount: calculateUnreadMessages(consultation.id, session.user.id!),
      duration: consultation.endedAt 
        ? Math.round((consultation.endedAt.getTime() - consultation.startedAt.getTime()) / 60000)
        : null
    }))

    return NextResponse.json({
      success: true,
      data: {
        consultations: enhancedConsultations,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total,
          limit
        },
        summary: {
          active: consultations.filter(c => c.status === 'ACTIVE').length,
          waiting: consultations.filter(c => c.status === 'WAITING_FOR_DOCTOR').length,
          completed: consultations.filter(c => c.status === 'COMPLETED').length
        }
      }
    })

  } catch (error) {
    console.error('相談一覧取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: '相談一覧の取得に失敗しました'
    }, { status: 500 })
  }
}

// 待機時間計算ヘルパー関数
function calculateEstimatedWaitTime(activeConsultations: number): number {
  const baseTime = 5 // 基本待機時間（分）
  const additionalTime = activeConsultations * 15 // 追加待機時間
  return baseTime + additionalTime
}

// 未読メッセージ数計算ヘルパー関数
function calculateUnreadMessages(consultationId: string, userId: string): number {
  // 実装は簡略化 - 実際にはデータベースクエリが必要
  return 0
}