import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai-client';
import { log, LogLevel, AppError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    let result;

    switch (action) {
      case 'generate_profile':
        const profilePrompt = `
医師の登録情報を基に、魅力的で信頼性のあるプロフィールを生成してください。

登録情報:
- 名前: ${data.name || '未入力'}
- 専門分野: ${data.specialty || '未入力'}
- 経験年数: ${data.experience || '未入力'}
- 所属病院: ${data.hospital || '未入力'}
- 学歴: ${data.education || '未入力'}
- 資格: ${data.certifications || '未入力'}

以下の形式で回答してください:
1. プロフィール概要（200文字程度）
2. 専門分野の詳細説明
3. 患者へのメッセージ
4. 診療方針
        `;
        
        result = await generateText(profilePrompt);
        break;

      case 'optimize_data':
        const optimizationPrompt = `
医師の登録データを分析し、改善提案を行ってください。

現在のデータ:
${JSON.stringify(data, null, 2)}

以下の観点から改善提案をしてください:
1. 不足している情報
2. より魅力的な表現への変更案
3. 患者に安心感を与える要素の追加
4. プロフィールの完成度向上のための提案
        `;

        result = await generateText(optimizationPrompt);
        break;

      case 'complete_registration':
        // プロフィール生成
        const completeProfilePrompt = `
医師の登録情報を基に完全なプロフィールを生成してください。

登録情報:
${JSON.stringify(data, null, 2)}

包括的なプロフィールを作成し、以下を含めてください:
1. 医師紹介文
2. 専門分野の説明
3. 診療スタイル
4. 患者へのメッセージ
5. 経歴ハイライト
        `;

        const profileResult = await generateText(completeProfilePrompt);

        // データ最適化
        const completeOptimizationPrompt = `
医師登録データの最終チェックと最適化を行ってください。

データ:
${JSON.stringify(data, null, 2)}

以下を提供してください:
1. データの完成度評価（％）
2. 改善が必要な項目
3. 追加推奨項目
4. 最終的な改善提案
        `;

        const optimizationResult = await generateText(completeOptimizationPrompt);

        result = {
          success: true,
          data: {
            profile: profileResult.success ? profileResult.content : null,
            optimization: optimizationResult.success ? optimizationResult.content : null,
            timestamp: new Date().toISOString(),
            provider: profileResult.provider
          }
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    // 単一のアクション結果の場合
    if (action !== 'complete_registration') {
      if (!result.success) {
        throw new AppError(result.error || 'AI処理に失敗しました', 500);
      }

      const response = {
        success: true,
        data: {
          content: result.content,
          timestamp: new Date().toISOString(),
          provider: result.provider
        }
      };
      
      log(LogLevel.INFO, 'AI登録支援が完了しました', { action });
      return NextResponse.json(response);
    }

    // complete_registrationの場合はすでに整形済み
    log(LogLevel.INFO, 'AI登録支援が完了しました', { action });
    return NextResponse.json(result);

  } catch (error) {
    log(LogLevel.ERROR, 'AI登録支援エラー:', { 
      error: error instanceof Error ? error.message : String(error) 
    });

    const appError = error instanceof AppError ? error : new AppError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );

    return NextResponse.json({
      success: false,
      error: 'AI登録支援の処理中にエラーが発生しました',
      data: {
        timestamp: new Date().toISOString()
      }
    }, { status: appError.statusCode });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: 'AI医師登録システム',
      endpoints: {
        POST: {
          generateProfile: '医師プロフィールを生成',
          optimizeData: '登録データを最適化',
          complete: '完全な登録支援を実行'
        }
      },
      timestamp: new Date().toISOString()
    }
  });
}