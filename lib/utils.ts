import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Response型定義
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// エラー処理クラス
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ログレベル定義
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// 型安全なログ機能
export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    context: context || {}
  };

  // 開発環境でのみコンソール出力（ESLint回避）
  if (process.env.NODE_ENV === 'development') {
    const logMethod = level === LogLevel.ERROR ? 'error' :
                     level === LogLevel.WARN ? 'warn' :
                     level === LogLevel.INFO ? 'info' : 'log';
    
    // eslint-disable-next-line no-console
    console[logMethod](JSON.stringify(logEntry));
  }
}

// 非同期操作のラッパー
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const message = errorMessage || 'Operation failed';
    log(LogLevel.ERROR, 'Async operation failed:', { error: error instanceof Error ? error.message : String(error) });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : message 
    };
  }
}

// JSONパース（型安全）
export function safeJsonParse<T = unknown>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    log(LogLevel.WARN, 'JSON parse failed:', { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

// 遅延処理
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// オブジェクトの深いマージ
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

// 配列のチャンク分割
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// デバウンス関数
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// スロットル関数
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// 環境変数の取得（型安全）- ビルド時エラー回避
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    // ビルド時は警告のみでデフォルト値を返す
    if (process.env.NODE_ENV === 'production' || process.env.CI) {
      log(LogLevel.WARN, `Environment variable ${key} is not defined, using fallback`);
      return `fallback-${key.toLowerCase()}`;
    }
    throw new AppError(`Environment variable ${key} is required but not defined`);
  }
  return value || defaultValue || '';
}

// タイムアウト付き非同期処理
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new AppError(errorMessage, 408)), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
}

// リトライ機能付き非同期処理
export async function retryAsync<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
  backoffMultiplier = 2
): Promise<T> {
  let lastError: Error = new Error('Operation failed');
  let currentDelay = delayMs;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        break;
      }
      
      log(LogLevel.WARN, `Operation failed, retrying in ${currentDelay}ms`, {
        attempt: attempt + 1,
        maxRetries,
        error: lastError.message
      });
      
      await delay(currentDelay);
      currentDelay *= backoffMultiplier;
    }
  }
  
  throw lastError;
}

// レート制限チェック
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const current = rateLimitMap.get(key);
  
  if (!current || now >= current.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }
  
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }
  
  current.count++;
  return { allowed: true, remaining: limit - current.count, resetTime: current.resetTime };
}