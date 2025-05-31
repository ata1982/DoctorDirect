import { log, LogLevel } from './utils';

export interface AIProviderConfig {
  name: string;
  endpoint?: string;
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  retryCount?: number;
}

export interface AISystemConfig {
  defaultProvider: string;
  fallbackProvider: string;
  providers: {
    [key: string]: AIProviderConfig;
  };
}

export const aiConfig: AISystemConfig = {
  defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'gemini',
  fallbackProvider: process.env.FALLBACK_AI_PROVIDER || 'grok',
  providers: {
    gemini: {
      name: 'Google Gemini',
      apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-05-20',
      maxTokens: 4096,
      temperature: 0.7,
      timeout: 30000,
      retryCount: 3
    },
    grok: {
      name: 'xAI Grok',
      endpoint: process.env.XAI_API_URL || 'https://api.x.ai/v1',
      apiKey: process.env.XAI_GROK_API_KEY || '',
      model: process.env.XAI_MODEL || 'grok-3',
      maxTokens: 4096,
      temperature: 0.7,
      timeout: 30000,
      retryCount: 3
    }
  }
};

export const getProviderConfig = (providerName: string): AIProviderConfig | null => {
  const config = aiConfig.providers[providerName];
  if (!config) {
    log(LogLevel.WARN, 'AI provider not found', { providerName });
    return null;
  }
  
  if (!config.apiKey) {
    log(LogLevel.WARN, 'API key not configured for AI provider', { providerName });
    return null;
  }
  
  return config;
};

export const getDefaultProvider = (): AIProviderConfig | null => {
  const config = getProviderConfig(aiConfig.defaultProvider);
  if (!config) {
    log(LogLevel.WARN, 'Default AI provider is not available', { defaultProvider: aiConfig.defaultProvider });
    return getFallbackProvider();
  }
  return config;
};

export const getFallbackProvider = (): AIProviderConfig | null => {
  const config = getProviderConfig(aiConfig.fallbackProvider);
  if (!config) {
    log(LogLevel.ERROR, 'Both default and fallback AI providers are unavailable', {});
    return null;
  }
  return config;
};

export const validateProviderConfig = (config: AIProviderConfig): boolean => {
  if (!config.apiKey) {
    log(LogLevel.ERROR, 'Missing API key for AI provider', { providerName: config.name });
    return false;
  }
  
  if (!config.model) {
    log(LogLevel.ERROR, 'Missing model for AI provider', { providerName: config.name });
    return false;
  }
  
  return true;
};