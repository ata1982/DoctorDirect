import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'
import { AIResponse } from '@/types'

// Google Gemini AI Service
class GeminiService {
  private genAI: GoogleGenerativeAI

  constructor() {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured')
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  }

  async generateMedicalAdvice(symptoms: string, context?: string): Promise<AIResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" })
      
      const prompt = `
        医療アドバイザーとして、以下の症状について安全で一般的な情報を提供してください。
        重要: これは医師の診断や治療の代替ではないことを明記してください。

        症状: ${symptoms}
        ${context ? `追加情報: ${context}` : ''}

        以下の形式で回答してください:
        1. 症状の一般的な説明
        2. 考えられる原因（一般的なもの）
        3. 自宅でできる対処法
        4. 医師に相談すべき症状
        5. 緊急性の判断基準

        免責事項を必ず含めてください。
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: {
          advice: text,
          timestamp: new Date().toISOString(),
          source: 'Gemini AI'
        }
      }
    } catch (error) {
      console.error('Gemini API Error:', error)
      return {
        success: false,
        error: 'AI分析中にエラーが発生しました。しばらく後に再度お試しください。'
      }
    }
  }

  async summarizeConsultation(messages: string[], patientSymptoms: string): Promise<AIResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" })
      
      const prompt = `
        以下の医師と患者の相談内容を要約してください:

        患者の症状: ${patientSymptoms}
        
        相談内容:
        ${messages.join('\n')}

        以下の形式で要約してください:
        1. 主な症状と訴え
        2. 医師の診断・見解
        3. 推奨される治療法・対処法
        4. フォローアップの必要性
        5. 処方薬（ある場合）
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        data: {
          summary: text,
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Gemini API Error:', error)
      return {
        success: false,
        error: '相談内容の要約中にエラーが発生しました。'
      }
    }
  }
}

// xAI (Grok) Service
class GrokService {
  private apiKey: string
  private baseURL = 'https://api.x.ai/v1'

  constructor() {
    if (!process.env.XAI_API_KEY) {
      throw new Error('XAI_API_KEY is not configured')
    }
    this.apiKey = process.env.XAI_API_KEY
  }

  async analyzeSymptoms(symptoms: string, medicalHistory?: string): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: `あなたは医療情報分析のアシスタントです。症状を分析し、一般的な情報を提供しますが、
                       これは医師の診断の代替ではないことを必ず明記してください。`
            },
            {
              role: 'user',
              content: `
                症状: ${symptoms}
                ${medicalHistory ? `既往歴: ${medicalHistory}` : ''}
                
                これらの症状について分析し、以下の情報を提供してください:
                1. 症状の特徴分析
                2. 注意すべきポイント
                3. 生活上のアドバイス
                4. 医療機関受診の目安
                
                医学的免責事項を含めてください。
              `
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: {
          analysis: response.data.choices[0].message.content,
          timestamp: new Date().toISOString(),
          source: 'Grok AI'
        }
      }
    } catch (error) {
      console.error('Grok API Error:', error)
      return {
        success: false,
        error: 'AI分析中にエラーが発生しました。しばらく後に再度お試しください。'
      }
    }
  }

  async generateHealthInsights(userProfile: any, recentAppointments: any[]): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: 'あなたは健康管理アドバイザーです。ユーザーの健康状態に基づいて個人化されたアドバイスを提供します。'
            },
            {
              role: 'user',
              content: `
                ユーザープロフィール: ${JSON.stringify(userProfile)}
                最近の診察履歴: ${JSON.stringify(recentAppointments)}
                
                このユーザーに対する健康管理のアドバイスを生成してください:
                1. 個人化された健康アドバイス
                2. 予防策の提案
                3. ライフスタイルの改善点
                4. 定期検診の推奨スケジュール
              `
            }
          ],
          temperature: 0.8,
          max_tokens: 1200
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: {
          insights: response.data.choices[0].message.content,
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Grok API Error:', error)
      return {
        success: false,
        error: '健康インサイトの生成中にエラーが発生しました。'
      }
    }
  }
}

// Unified AI Service
export class AIService {
  private gemini: GeminiService
  private grok: GrokService

  constructor() {
    this.gemini = new GeminiService()
    this.grok = new GrokService()
  }

  // 症状分析（両方のAIを使用してより包括的な分析）
  async analyzeSymptoms(symptoms: string, context?: string): Promise<AIResponse> {
    try {
      const [geminiResult, grokResult] = await Promise.allSettled([
        this.gemini.generateMedicalAdvice(symptoms, context),
        this.grok.analyzeSymptoms(symptoms, context)
      ])

      const responses: any[] = []
      
      if (geminiResult.status === 'fulfilled' && geminiResult.value.success) {
        responses.push({
          source: 'Gemini',
          content: geminiResult.value.data
        })
      }

      if (grokResult.status === 'fulfilled' && grokResult.value.success) {
        responses.push({
          source: 'Grok',
          content: grokResult.value.data
        })
      }

      if (responses.length === 0) {
        return {
          success: false,
          error: 'AI分析サービスが利用できません。しばらく後に再度お試しください。'
        }
      }

      return {
        success: true,
        data: {
          analyses: responses,
          timestamp: new Date().toISOString(),
          disclaimer: 'この情報は一般的な参考情報です。医師の診断や治療の代替ではありません。'
        }
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      return {
        success: false,
        error: 'AI分析中にエラーが発生しました。'
      }
    }
  }

  // 相談要約（Geminiを使用）
  async summarizeConsultation(messages: string[], symptoms: string): Promise<AIResponse> {
    return this.gemini.summarizeConsultation(messages, symptoms)
  }

  // 健康インサイト（Grokを使用）
  async generateHealthInsights(userProfile: any, appointments: any[]): Promise<AIResponse> {
    return this.grok.generateHealthInsights(userProfile, appointments)
  }
}

export const aiService = new AIService()