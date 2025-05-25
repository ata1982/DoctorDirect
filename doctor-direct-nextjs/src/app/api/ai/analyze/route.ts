import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { aiService } from '@/lib/ai-service'
import { prisma } from '@/lib/prisma'

// 症状分析API（xAI Grok + Google Gemini統合）
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: '認証が必要です'
      }, { status: 401 })
    }

    const { symptoms, medicalHistory, context } = await request.json()

    if (!symptoms) {
      return NextResponse.json({
        success: false,
        error: '症状の入力が必要です'
      }, { status: 400 })
    }

    // AI分析の実行（複数のAIサービスを並行実行）
    const analysisResult = await aiService.analyzeSymptoms(symptoms, context || medicalHistory)

    // 分析履歴をデータベースに保存
    const analysisRecord = await prisma.aiAnalysis.create({
      data: {
        userId: session.user.id!,
        type: 'SYMPTOM_ANALYSIS',
        input: JSON.stringify({ symptoms, medicalHistory, context }),
        output: JSON.stringify(analysisResult),
        aiProviders: ['xai_grok', 'google_gemini'],
        success: analysisResult.success,
        timestamp: new Date()
      }
    })

    // ユーザーアクティビティログ
    await prisma.activityLog.create({
      data: {
        userId: session.user.id!,
        action: 'AI_SYMPTOM_ANALYSIS',
        entityType: 'AI_ANALYSIS',
        entityId: analysisRecord.id,
        description: `症状分析を実行: ${symptoms.substring(0, 50)}...`
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        analysis: analysisResult,
        analysisId: analysisRecord.id,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI症状分析エラー:', error)
    return NextResponse.json({
      success: false,
      error: 'AI分析の実行中にエラーが発生しました'
    }, { status: 500 })
  }
}

// AI分析履歴取得
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')

    const where: any = {
      userId: session.user.id
    }

    if (type) {
      where.type = type
    }

    const [analyses, total] = await Promise.all([
      prisma.aiAnalysis.findMany({
        where,
        orderBy: {
          timestamp: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.aiAnalysis.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        analyses,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total,
          limit
        }
      }
    })

  } catch (error) {
    console.error('AI分析履歴取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: 'AI分析履歴の取得に失敗しました'
    }, { status: 500 })
  }
}