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

// Grok3でTwitter検索スタイルのレビューを生成
async function generateTwitterSearchReviews(hospitalName: string): Promise<string> {
  return await retryAsync(async () => {
    const completion = await withTimeout(
      xaiClient.chat.completions.create({
        model: XAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'あなたは日本のTwitter/X上の医療機関に関する口コミや評判を分析する専門家です。リアルなTwitter投稿風の内容を生成してください。日本語で回答してください。'
          },
          {
            role: 'user',
            content: `${hospitalName}について、Twitter/X上で見つかりそうな口コミや評判を5つ生成してください。以下の形式で返してください：

Twitter投稿1:
@ユーザー名: [Twitter風の投稿内容、140文字程度、ハッシュタグ含む]
いいね: [数字] RT: [数字] 投稿日: [日付]

Twitter投稿2:
@ユーザー名: [Twitter風の投稿内容、140文字程度、ハッシュタグ含む]
いいね: [数字] RT: [数字] 投稿日: [日付]

以下同様に5つまで...

各投稿は以下の特徴を持ってください：
- 実際のTwitter投稿のような自然な文体
- 医療体験に関する具体的な内容
- 適切なハッシュタグ（#病院 #医療 #口コミ など）
- 様々な視点（患者、家族、医療従事者など）
- ポジティブ・ネガティブ・中立のバランス`
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
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

// Grok3でウェブ検索スタイルのレビューを生成
async function generateWebSearchReviews(hospitalName: string): Promise<string> {
  return await retryAsync(async () => {
    const completion = await withTimeout(
      xaiClient.chat.completions.create({
        model: XAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'あなたは日本の医療機関に関するウェブ上の口コミサイトや評価サイトの情報を分析する専門家です。様々なウェブサイトからの評価情報を総合的に生成してください。日本語で回答してください。'
          },
          {
            role: 'user',
            content: `${hospitalName}について、以下のようなウェブサイトで見つかりそうな評価情報を5つ生成してください：

ウェブ評価1:
サイト名: [口コミサイト名（例：○○クリニック口コミサイト、医療ナビなど）]
評価: ★★★★☆ (4.2/5.0)
レビュアー: [ユーザー名]
投稿日: [日付]
詳細レビュー: [200文字程度の詳細な医療体験レビュー]

ウェブ評価2:
[同様の形式で...]

以下同様に5つまで...

各評価は以下を含んでください：
- 医療サービスの具体的な評価
- 施設の清潔さや設備について
- スタッフの対応や医師の技術
- 待ち時間や予約の取りやすさ
- アクセスや駐車場の情報
- 実際の患者体験に基づいた内容`
          }
        ],
        max_tokens: 2500,
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

async function handleHospitalSearch(hospitalName: string, searchType: string, clientIP: string): Promise<ApiResponse> {
  try {
    // レート制限チェック
    if (!checkRateLimit(`hospital-search:${clientIP}`, 20, 300000)) { // 5分間に20回まで
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

    const validSearchTypes = ['twitter', 'web'];
    if (!validSearchTypes.includes(searchType)) {
      throw new AppError('Invalid search type. Must be "twitter" or "web"', 400);
    }

    log(LogLevel.INFO, 'Starting hospital search', { 
      hospitalName: validatedHospitalName, 
      searchType,
      clientIP 
    });

    let searchResults: string;

    if (searchType === 'web') {
      searchResults = await generateWebSearchReviews(validatedHospitalName);
    } else {
      searchResults = await generateTwitterSearchReviews(validatedHospitalName);
    }

    log(LogLevel.INFO, 'Hospital search completed successfully', { 
      hospitalName: validatedHospitalName, 
      searchType,
      resultLength: searchResults.length 
    });

    return {
      success: true,
      data: {
        hospitalName: validatedHospitalName,
        searchType,
        results: searchResults,
        timestamp: new Date().toISOString(),
        model: XAI_MODEL
      }
    };

  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );

    log(LogLevel.ERROR, 'Hospital search failed', {
      hospitalName,
      searchType,
      error: appError.message,
      statusCode: appError.statusCode,
      clientIP
    });

    return {
      success: false,
      error: appError.message,
      data: {
        hospitalName,
        searchType,
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
    const searchType = searchParams.get('type') || 'twitter';

    if (!hospitalName) {
      return NextResponse.json({
        success: false,
        error: 'Hospital name is required'
      }, { status: 400 });
    }

    const result = await handleHospitalSearch(hospitalName, searchType, clientIP);

    return NextResponse.json(result, { 
      status: result.success ? 200 : (result.error?.includes('Rate limit') ? 429 : 
              result.error?.includes('Invalid') || result.error?.includes('required') ? 400 : 500)
    });

  } catch (error) {
    log(LogLevel.ERROR, 'Unexpected error in GET /api/hospital-search', {
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

    const { hospitalName, searchType = 'twitter' } = body;

    if (!hospitalName) {
      return NextResponse.json({
        success: false,
        error: 'Hospital name is required'
      }, { status: 400 });
    }

    const result = await handleHospitalSearch(hospitalName, searchType, clientIP);

    return NextResponse.json(result, { 
      status: result.success ? 200 : (result.error?.includes('Rate limit') ? 429 : 
              result.error?.includes('Invalid') || result.error?.includes('required') ? 400 : 500)
    });

  } catch (error) {
    log(LogLevel.ERROR, 'Unexpected error in POST /api/hospital-search', {
      error: error instanceof Error ? error.message : String(error),
      clientIP
    });

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}