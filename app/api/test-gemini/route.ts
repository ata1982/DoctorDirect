import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';
import { log, LogLevel, AppError } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const debugInfo: {
    timestamp: string;
    url: string;
    availableProviders: string[];
    prompt?: string;
    requestedProvider?: string;
  } = {
    timestamp: new Date().toISOString(),
    url: request.url,
    availableProviders: ['gemini', 'openai', 'claude'] // 利用可能なプロバイダーを直接指定
  };

  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt') || 'こんにちは、簡単な挨拶をしてください';
    const provider = searchParams.get('provider') || undefined;

    debugInfo.prompt = prompt;
    debugInfo.requestedProvider = provider;

    log(LogLevel.INFO, 'AI test request received', { prompt, provider });

    // 統合AIクライアントを使用してレスポンスを生成
    const response = await aiClient.generateText(
      prompt,
      'あなたは親切で専門的な医療AIアシスタントです。簡潔で分かりやすい回答を提供してください。'
    );

    if (!response.success) {
      throw new AppError(response.error || 'AI response generation failed', 500);
    }

    log(LogLevel.INFO, 'AI response generated successfully', {
      provider: response.provider,
      tokensUsed: response.tokensUsed
    });

    return NextResponse.json({
      success: true,
      prompt,
      response: response.content,
      provider: response.provider,
      tokensUsed: response.tokensUsed,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    log(LogLevel.ERROR, 'AI test request failed', { error: errorMessage, debugInfo });
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, systemPrompt } = body;

    if (!prompt) {
      throw new AppError('Prompt is required', 400);
    }

    log(LogLevel.INFO, 'AI test POST request received');

    const response = await aiClient.generateText(prompt, systemPrompt);

    if (!response.success) {
      throw new AppError(response.error || 'AI response generation failed', 500);
    }

    return NextResponse.json({
      success: true,
      response: response.content,
      provider: response.provider,
      tokensUsed: response.tokensUsed,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    
    log(LogLevel.ERROR, 'AI test POST request failed', { error: errorMessage });
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: statusCode });
  }
}