import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { aiService } from '@/lib/ai-service'

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
    const { symptoms, context } = body

    if (!symptoms || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: '症状を入力してください' },
        { status: 400 }
      )
    }

    // AIサービスを使用して症状分析
    const analysisResult = await aiService.analyzeSymptoms(symptoms, context)

    if (!analysisResult.success) {
      return NextResponse.json(
        { error: analysisResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: analysisResult.data,
      message: 'AI分析が完了しました'
    })

  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { error: 'AI分析中にエラーが発生しました' },
      { status: 500 }
    )
  }
}