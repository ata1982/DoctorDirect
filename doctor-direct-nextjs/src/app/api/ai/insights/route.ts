import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { aiService } from '@/lib/ai-service'
import { prisma } from '@/lib/prisma'

// 健康インサイト生成API（Grok AI活用）
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: '認証が必要です'
      }, { status: 401 })
    }

    // ユーザーの健康プロフィールと診察履歴を取得
    const [userProfile, recentAppointments, recentAnalyses] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          userRewards: true
        }
      }),
      prisma.appointment.findMany({
        where: {
          patientId: session.user.id,
          status: 'COMPLETED',
          appointmentDate: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 過去90日
          }
        },
        include: {
          doctor: {
            include: {
              user: true
            }
          },
          diagnosis: true
        },
        orderBy: {
          appointmentDate: 'desc'
        }
      }),
      prisma.aiAnalysis.findMany({
        where: {
          userId: session.user.id,
          type: 'SYMPTOM_ANALYSIS',
          success: true,
          timestamp: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 過去30日
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 5
      })
    ])

    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'ユーザープロフィールが見つかりません'
      }, { status: 404 })
    }

    // AIによる健康インサイト生成
    const insightsResult = await aiService.generateHealthInsights(
      {
        age: userProfile.age,
        gender: userProfile.gender,
        medicalHistory: userProfile.medicalHistory,
        allergies: userProfile.allergies,
        currentMedications: userProfile.currentMedications,
        lifestyle: userProfile.lifestyle
      },
      recentAppointments.map(apt => ({
        date: apt.appointmentDate,
        doctor: apt.doctor.user?.name,
        specialization: apt.doctor.specializations,
        diagnosis: apt.diagnosis,
        notes: apt.notes
      }))
    )

    // インサイト結果をデータベースに保存
    const insightRecord = await prisma.healthInsight.create({
      data: {
        userId: session.user.id!,
        type: 'COMPREHENSIVE_ANALYSIS',
        insights: insightsResult.success ? insightsResult.data?.insights : null,
        recommendations: insightsResult.success ? insightsResult.data?.recommendations : null,
        riskFactors: insightsResult.success ? insightsResult.data?.riskFactors : null,
        nextSteps: insightsResult.success ? insightsResult.data?.nextSteps : null,
        aiProvider: 'xai_grok',
        confidence: insightsResult.success ? 0.85 : 0.0,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日間有効
        success: insightsResult.success
      }
    })

    // ユーザーアクティビティログ
    await prisma.activityLog.create({
      data: {
        userId: session.user.id!,
        action: 'AI_HEALTH_INSIGHTS',
        entityType: 'HEALTH_INSIGHT',
        entityId: insightRecord.id,
        description: 'AI健康インサイトを生成しました'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        insights: insightsResult,
        insightId: insightRecord.id,
        dataPoints: {
          recentAppointments: recentAppointments.length,
          recentAnalyses: recentAnalyses.length,
          profileCompleteness: calculateProfileCompleteness(userProfile)
        },
        validUntil: insightRecord.validUntil,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('健康インサイト生成エラー:', error)
    return NextResponse.json({
      success: false,
      error: '健康インサイトの生成中にエラーが発生しました'
    }, { status: 500 })
  }
}

// 過去の健康インサイト取得
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const onlyValid = searchParams.get('valid') === 'true'

    const where: any = {
      userId: session.user.id
    }

    if (onlyValid) {
      where.validUntil = {
        gte: new Date()
      }
      where.success = true
    }

    const [insights, total] = await Promise.all([
      prisma.healthInsight.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.healthInsight.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        insights,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total,
          limit
        }
      }
    })

  } catch (error) {
    console.error('健康インサイト取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: '健康インサイトの取得に失敗しました'
    }, { status: 500 })
  }
}

// プロフィール完成度計算ヘルパー関数
function calculateProfileCompleteness(user: any): number {
  const fields = ['age', 'gender', 'medicalHistory', 'allergies', 'currentMedications', 'lifestyle']
  const completedFields = fields.filter(field => user[field] && user[field] !== '').length
  return Math.round((completedFields / fields.length) * 100)
}