import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai-service'

// AI会話分析エンドポイント
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // 医師のみがAI分析を実行可能
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.role !== 'DOCTOR') {
      return NextResponse.json({ error: '医師のみがAI分析を実行できます' }, { status: 403 })
    }

    const { consultationId, messages } = await request.json()

    if (!consultationId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: '相談IDとメッセージが必要です' }, { status: 400 })
    }

    // 相談の権限チェック
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        doctor: {
          userId: session.user.id
        }
      },
      include: {
        patient: {
          select: {
            name: true,
            age: true,
            gender: true,
            medicalHistory: true
          }
        }
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: '相談が見つかりません' }, { status: 404 })
    }

    // AI分析を実行
    const conversationText = messages
      .map(msg => `${msg.role === 'doctor' ? '医師' : '患者'}: ${msg.content}`)
      .join('\n')

    const analysisPrompt = `
以下の医師と患者の会話を分析し、医学的見地から要約と推奨事項を提供してください。

患者情報:
- 名前: ${consultation.patient.name}
- 年齢: ${consultation.patient.age || '不明'}
- 性別: ${consultation.patient.gender || '不明'}
- 既往歴: ${consultation.patient.medicalHistory || 'なし'}

症状: ${consultation.symptoms}

会話内容:
${conversationText}

以下の形式で分析してください:
1. 症状の要約
2. 考えられる診断
3. 緊急度評価（低/中/高）
4. 推奨される次のステップ
5. 注意事項

必ず医学的根拠に基づいて回答し、診断の確定は避けて可能性として示してください。
`

    const analysis = await aiService.analyzeSymptoms(analysisPrompt)

    // 分析結果をデータベースに保存
    const aiAnalysis = await prisma.aIAnalysis.create({
      data: {
        consultationId,
        analysisType: 'CONVERSATION',
        input: JSON.stringify({ messages, patientInfo: consultation.patient }),
        result: JSON.stringify(analysis),
        summary: analysis.summary || '会話の分析が完了しました',
        confidence: analysis.confidence || 0.8,
        createdAt: new Date()
      }
    })

    // 相談にAI分析結果を関連付け
    await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        aiAnalysisResult: JSON.stringify(analysis),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: aiAnalysis.id,
        summary: analysis.summary,
        recommendations: analysis.recommendations,
        urgencyLevel: analysis.urgencyLevel,
        possibleDiagnoses: analysis.possibleDiagnoses,
        nextSteps: analysis.nextSteps,
        warnings: analysis.warnings,
        confidence: analysis.confidence,
        createdAt: aiAnalysis.createdAt
      }
    })

  } catch (error) {
    console.error('AI分析エラー:', error)
    return NextResponse.json(
      { error: 'AI分析の実行に失敗しました' },
      { status: 500 }
    )
  }
}