import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getEnvVar, log, LogLevel, AppError, ApiResponse, withTimeout, retryAsync, checkRateLimit } from '@/lib/utils';

// 環境変数の安全な取得
const XAI_API_KEY = getEnvVar('XAI_GROK_API_KEY');
const XAI_MODEL = getEnvVar('XAI_MODEL', 'grok-3');

// xAI Grokクライアントの初期化
const xaiClient = new OpenAI({
  apiKey: XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

// レビュー生成機能
async function generateReviews(hospitalName: string, reviewType: string): Promise<string> {
  return await retryAsync(async () => {
    const prompts = {
      positive: `${hospitalName}について、ポジティブで建設的な医療機関レビューを3つ生成してください。実際の患者体験に基づいた内容で、以下を含んでください：
      - 医療サービスの質
      - スタッフの対応
      - 施設の清潔さ
      - 待ち時間や予約システム
      - 具体的な改善点や良かった点`,

      balanced: `${hospitalName}について、バランスの取れた客観的な医療機関レビューを3つ生成してください。良い点と改善点の両方を含む、建設的な内容で：
      - 医療サービスの評価
      - スタッフや医師の対応
      - 施設環境
      - アクセスや利便性
      - 総合的な満足度`,

      detailed: `${hospitalName}について、詳細で包括的な医療機関レビューを2つ生成してください。以下の観点から詳しく評価してください：
      - 診療科目と専門性
      - 医師の技術力と説明力
      - 看護師や受付スタッフの対応
      - 施設の設備と清潔さ
      - 予約システムと待ち時間
      - アクセス方法と駐車場
      - 費用と保険対応
      - 総合的な推奨度`
    };

    const prompt = prompts[reviewType as keyof typeof prompts] || prompts.balanced;

    const completion = await withTimeout(
      xaiClient.chat.completions.create({
        model: XAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'あなたは日本の医療機関に関する客観的で建設的なレビューを作成する専門家です。実際の患者体験に基づいた、有用で信頼性の高いレビューを生成してください。日本語で回答してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
      15000 // 15秒タイムアウト
    );

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new AppError('No content received from xAI Grok', 500);
    }
    
    return result;
  }, 3, 1000);
}

async function handleReviewGeneration(hospitalName: string, reviewType: string, clientIP: string): Promise<ApiResponse> {
  try {
    // レート制限チェック
    if (!checkRateLimit(`reviews:${clientIP}`, 15, 300000)) { // 5分間に15回まで
      throw new AppError('Rate limit exceeded. Please try again later.', 429);
    }

    // 入力値検証
    const validatedHospitalName = hospitalName.trim();
    if (!validatedHospitalName || validatedHospitalName.length < 2) {
      throw new AppError('Hospital name must be at least 2 characters long', 400);
    }

    if (validatedHospitalName.length > 100) {
      throw new AppError('Hospital name is too long', 400);
    }

    const validReviewTypes = ['positive', 'balanced', 'detailed'];
    if (!validReviewTypes.includes(reviewType)) {
      throw new AppError('Invalid review type. Must be "positive", "balanced", or "detailed"', 400);
    }

    log(LogLevel.INFO, 'Starting review generation', { 
      hospitalName: validatedHospitalName, 
      reviewType,
      clientIP 
    });

    const reviews = await generateReviews(validatedHospitalName, reviewType);

    log(LogLevel.INFO, 'Review generation completed successfully', { 
      hospitalName: validatedHospitalName, 
      reviewType,
      resultLength: reviews.length 
    });

    return {
      success: true,
      data: {
        hospitalName: validatedHospitalName,
        reviewType,
        reviews,
        timestamp: new Date().toISOString(),
        model: XAI_MODEL
      }
    };

  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );

    log(LogLevel.ERROR, 'Review generation failed', {
      hospitalName,
      reviewType,
      error: appError.message,
      statusCode: appError.statusCode,
      clientIP
    });

    return {
      success: false,
      error: appError.message,
      data: {
        hospitalName,
        reviewType,
        timestamp: new Date().toISOString()
      }
    };
  }
}

export async function GET(request: NextRequest) {
  // NextRequestからIPアドレスを安全に取得
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  try {
    const { searchParams } = new URL(request.url);
    const hospitalName = searchParams.get('hospital') || '';
    const reviewType = searchParams.get('type') || 'balanced';

    if (!hospitalName) {
      return NextResponse.json({
        success: false,
        error: 'Hospital name is required'
      }, { status: 400 });
    }

    const result = await handleReviewGeneration(hospitalName, reviewType, clientIP);

    return NextResponse.json(result, { 
      status: result.success ? 200 : (result.error?.includes('Rate limit') ? 429 : 
              result.error?.includes('Invalid') || result.error?.includes('required') ? 400 : 500)
    });

  } catch (error) {
    log(LogLevel.ERROR, 'Unexpected error in GET /api/reviews', {
      error: error instanceof Error ? error.message : String(error),
      clientIP
    });

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // NextRequestからIPアドレスを安全に取得
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      // JSON解析エラーを処理
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }

    const { hospitalName, reviewType = 'balanced' } = body;

    if (!hospitalName) {
      return NextResponse.json({
        success: false,
        error: 'Hospital name is required'
      }, { status: 400 });
    }

    const result = await handleReviewGeneration(hospitalName, reviewType, clientIP);

    return NextResponse.json(result, { 
      status: result.success ? 200 : (result.error?.includes('Rate limit') ? 429 : 
              result.error?.includes('Invalid') || result.error?.includes('required') ? 400 : 500)
    });

  } catch (error) {
    log(LogLevel.ERROR, 'Unexpected error in POST /api/reviews', {
      error: error instanceof Error ? error.message : String(error),
      clientIP
    });

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}