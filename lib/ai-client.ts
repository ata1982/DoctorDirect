import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { aiConfig, getDefaultProvider, getFallbackProvider, validateProviderConfig, AIProviderConfig } from './ai-config';
import { AppError, log, LogLevel, withTimeout, retryAsync } from './utils';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  provider?: string;
  tokensUsed?: number;
}

// AI Clients
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Types
export interface SymptomAnalysis {
  primaryDiagnosis: string;
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  recommendations: string[];
  suggestedSpecialists: string[];
  riskFactors: string[];
  followUpRequired: boolean;
}

export interface ImageAnalysis {
  condition: string;
  confidence: number;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  recommendations: string[];
  shouldSeeDoctor: boolean;
}

export interface HealthCoachAdvice {
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'medication';
  advice: string;
  actionItems: string[];
  goals: string[];
  timeline: string;
}

// Symptom Analysis with AI
export async function analyzeSymptoms(symptoms: {
  primarySymptom: string;
  duration: string;
  severity: number;
  additionalSymptoms: string[];
  patientInfo: {
    age: number;
    gender: string;
    medicalHistory: string[];
    medications: string[];
    allergies: string[];
  };
}): Promise<SymptomAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    あなたは経験豊富な医師のAIアシスタントです。以下の症状情報を分析して、医学的な見解を提供してください。

    患者情報:
    - 年齢: ${symptoms.patientInfo.age}歳
    - 性別: ${symptoms.patientInfo.gender}
    - 既往歴: ${symptoms.patientInfo.medicalHistory.join(', ') || 'なし'}
    - 服用薬: ${symptoms.patientInfo.medications.join(', ') || 'なし'}
    - アレルギー: ${symptoms.patientInfo.allergies.join(', ') || 'なし'}

    症状:
    - 主症状: ${symptoms.primarySymptom}
    - 持続期間: ${symptoms.duration}
    - 重症度 (1-10): ${symptoms.severity}
    - 追加症状: ${symptoms.additionalSymptoms.join(', ') || 'なし'}

    以下のJSON形式で回答してください:
    {
      "primaryDiagnosis": "最も可能性の高い診断",
      "confidence": 85,
      "urgency": "low|medium|high",
      "recommendations": ["推奨事項1", "推奨事項2"],
      "suggestedSpecialists": ["内科", "皮膚科"],
      "riskFactors": ["注意すべき要因"],
      "followUpRequired": true
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    log(LogLevel.ERROR, 'Symptom analysis failed', { error: error instanceof Error ? error.message : String(error) });
    return {
      primaryDiagnosis: '分析に失敗しました',
      confidence: 0,
      urgency: 'medium',
      recommendations: ['医師にご相談ください'],
      suggestedSpecialists: ['内科'],
      riskFactors: [],
      followUpRequired: true
    };
  }
}

// Image Analysis with AI
export async function analyzeImage(
  imageBase64: string,
  bodyPart: string,
  symptoms: string
): Promise<ImageAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const prompt = `
    あなたは皮膚科専門医のAIアシスタントです。提供された画像を分析して医学的見解を提供してください。

    部位: ${bodyPart}
    症状: ${symptoms}

    以下のJSON形式で回答してください:
    {
      "condition": "推定される状態",
      "confidence": 75,
      "description": "詳細な説明",
      "urgency": "low|medium|high",
      "recommendations": ["対処法1", "対処法2"],
      "shouldSeeDoctor": true
    }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: 'image/jpeg'
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    log(LogLevel.ERROR, 'Image analysis failed', { error: error instanceof Error ? error.message : String(error) });
    return {
      condition: '画像分析に失敗しました',
      confidence: 0,
      description: '画像の解析ができませんでした',
      urgency: 'medium',
      recommendations: ['医師にご相談ください'],
      shouldSeeDoctor: true
    };
  }
}

// Health Coach AI
export async function getHealthCoachAdvice(
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'medication',
  userProfile: {
    age: number;
    goals: string[];
    currentHealth: string;
    preferences: string[];
  }
): Promise<HealthCoachAdvice> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `あなたは認定された健康コーチです。${category}に関する個人化されたアドバイスを提供してください。`
        },
        {
          role: 'user',
          content: `
          年齢: ${userProfile.age}歳
          目標: ${userProfile.goals.join(', ')}
          現在の健康状態: ${userProfile.currentHealth}
          好み/制約: ${userProfile.preferences.join(', ')}
          
          ${category}について具体的でアクションプランを含むアドバイスをJSON形式で提供してください:
          {
            "category": "${category}",
            "advice": "詳細なアドバイス",
            "actionItems": ["行動項目1", "行動項目2"],
            "goals": ["目標1", "目標2"],
            "timeline": "推奨期間"
          }
          `
        }
      ]
    });

    const response = completion.choices[0].message.content;
    if (response) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    log(LogLevel.ERROR, 'Health coach advice generation failed', { error: error instanceof Error ? error.message : String(error) });
    return {
      category,
      advice: 'アドバイスの生成に失敗しました',
      actionItems: ['専門家にご相談ください'],
      goals: ['健康改善'],
      timeline: '1週間'
    };
  }
}

// Drug Interaction Checker
export async function checkDrugInteractions(medications: string[]): Promise<{
  hasInteractions: boolean;
  interactions: Array<{
    drugs: string[];
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    recommendation: string;
  }>;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    薬剤師として、以下の薬物の相互作用をチェックしてください:
    ${medications.join(', ')}

    JSON形式で回答:
    {
      "hasInteractions": true,
      "interactions": [
        {
          "drugs": ["薬A", "薬B"],
          "severity": "moderate",
          "description": "相互作用の説明",
          "recommendation": "推奨事項"
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { hasInteractions: false, interactions: [] };
  } catch (error) {
    log(LogLevel.ERROR, 'Drug interaction check failed', { error: error instanceof Error ? error.message : String(error) });
    return { hasInteractions: false, interactions: [] };
  }
}

// Emergency Assessment
export async function assessEmergency(symptoms: string[]): Promise<{
  isEmergency: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  nextSteps: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    救急医として、以下の症状の緊急度を評価してください:
    ${symptoms.join(', ')}

    JSON形式で回答:
    {
      "isEmergency": true,
      "urgencyLevel": "high",
      "recommendation": "すぐに救急外来を受診してください",
      "nextSteps": ["119番通報", "最寄りの救急病院へ"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response');
  } catch (error) {
    log(LogLevel.ERROR, 'Emergency assessment failed', { error: error instanceof Error ? error.message : String(error) });
    return {
      isEmergency: true,
      urgencyLevel: 'high',
      recommendation: '症状が心配な場合は医師にご相談ください',
      nextSteps: ['医療機関に連絡', '症状を観察']
    };
  }
}

// Generic Text Generation
export async function generateText(prompt: string, systemMessage?: string): Promise<AIResponse> {
  try {
    // Try Google Gemini first
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fullPrompt = systemMessage ? `${systemMessage}\n\n${prompt}` : prompt;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    log(LogLevel.DEBUG, 'AI text generation successful', { provider: 'gemini' });
    
    return {
      success: true,
      content: text,
      provider: 'gemini'
    };
  } catch (geminiError) {
    log(LogLevel.WARN, 'Gemini text generation failed, falling back to OpenAI', { error: geminiError instanceof Error ? geminiError.message : String(geminiError) });
    
    // Fallback to OpenAI
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          ...(systemMessage ? [{ role: 'system' as const, content: systemMessage }] : []),
          { role: 'user' as const, content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated');
      }

      log(LogLevel.DEBUG, 'AI text generation successful', { provider: 'openai' });
      
      return {
        success: true,
        content,
        provider: 'openai',
        tokensUsed: completion.usage?.total_tokens
      };
    } catch (openaiError) {
      log(LogLevel.ERROR, 'OpenAI text generation failed', { error: openaiError instanceof Error ? openaiError.message : String(openaiError) });
      
      return {
        success: false,
        error: 'テキスト生成に失敗しました。後でもう一度お試しください。',
        provider: 'none'
      };
    }
  }
}

// Default AI client export
export const aiClient = {
  analyzeSymptoms,
  analyzeImage,
  getHealthCoachAdvice,
  checkDrugInteractions,
  assessEmergency,
  generateText
};