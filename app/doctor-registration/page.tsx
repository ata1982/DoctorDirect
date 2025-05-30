'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'

interface DoctorRegistrationData {
  fullName: string
  email: string
  specialization: string
  experience: string
  education: string
  certifications: string
  languages: string
  description: string
}

interface AIResults {
  generatedProfile?: string
  suggestions?: string[]
  optimizations?: string[]
  isLoading?: boolean
}

export default function DoctorRegistrationPage() {
  const [formData, setFormData] = useState<DoctorRegistrationData>({
    fullName: '',
    email: '',
    specialization: '',
    experience: '',
    education: '',
    certifications: '',
    languages: '',
    description: ''
  })

  const [aiResults, setAiResults] = useState<AIResults>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const callAI = async (action: string, data: DoctorRegistrationData) => {
    try {
      const response = await fetch('/api/ai-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
      })

      if (!response.ok) {
        throw new Error('AI API request failed')
      }

      return await response.json()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI処理中にエラーが発生しました'
      return { success: false, error: errorMessage }
    }
  }

  const generateProfile = async () => {
    const result = await callAI('generate_profile', formData)
    
    if (result.success && result.profile) {
      setAiResults(prev => ({ ...prev, generatedProfile: result.profile }))
      setFormData(prev => ({ ...prev, description: result.profile || '' }))
    }
    return result
  }

  const optimizeData = async () => {
    const result = await callAI('optimize_data', formData)
    
    if (result.success) {
      setAiResults(prev => ({ 
        ...prev, 
        suggestions: result.suggestions || [],
        optimizations: result.optimizations || []
      }))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await callAI('complete_registration', formData)
      
      if (result.success) {
        // 登録成功の処理
        alert('医師登録が完了しました！')
      } else {
        alert('登録に失敗しました: ' + result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登録処理中にエラーが発生しました'
      alert('エラー: ' + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof DoctorRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Brain className="inline-block mr-3 h-10 w-10 text-blue-600" />
            AI支援医師登録システム
          </h1>
          <p className="text-xl text-gray-600">
            AIが医師登録プロセスをサポートし、最適なプロフィール作成をお手伝いします
          </p>
        </div>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">基本情報入力</TabsTrigger>
            <TabsTrigger value="ai-assist">AI支援</TabsTrigger>
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>医師基本情報</CardTitle>
                <CardDescription>
                  あなたの医師としての基本情報を入力してください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">氏名 *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="山田 太郎"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">メールアドレス *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="doctor@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="specialization">専門分野 *</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="内科、外科、小児科など"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">経験年数 *</Label>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="10年"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education">学歴・資格 *</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      placeholder="東京大学医学部卒業、医学博士号取得など"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="certifications">専門医資格・認定</Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange('certifications', e.target.value)}
                      placeholder="日本内科学会認定内科医、循環器専門医など"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="languages">対応言語</Label>
                    <Input
                      id="languages"
                      value={formData.languages}
                      onChange={(e) => handleInputChange('languages', e.target.value)}
                      placeholder="日本語、英語、中国語など"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">自己紹介・プロフィール</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="患者様への自己紹介や医師としての想いなど"
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-assist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                  AI支援ツール
                </CardTitle>
                <CardDescription>
                  AIがあなたのプロフィール作成と最適化をサポートします
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={generateProfile}
                    disabled={!formData.fullName || !formData.specialization}
                    className="w-full"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    AIプロフィール生成
                  </Button>
                  <Button
                    onClick={optimizeData}
                    disabled={!formData.fullName || !formData.specialization}
                    variant="outline"
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    データ最適化提案
                  </Button>
                </div>

                {aiResults.generatedProfile && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-green-700">
                      ✨ AI生成プロフィール
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-green-800">{aiResults.generatedProfile}</p>
                    </div>
                    <Button
                      onClick={() => handleInputChange('description', aiResults.generatedProfile || '')}
                      size="sm"
                      variant="outline"
                    >
                      このプロフィールを採用
                    </Button>
                  </div>
                )}

                {aiResults.suggestions && aiResults.suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-700">
                      💡 改善提案
                    </h3>
                    <div className="space-y-2">
                      {aiResults.suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded border border-blue-200">
                          <p className="text-blue-800">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aiResults.optimizations && aiResults.optimizations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-purple-700">
                      🚀 最適化案
                    </h3>
                    <div className="space-y-2">
                      {aiResults.optimizations.map((optimization, index) => (
                        <div key={index} className="bg-purple-50 p-3 rounded border border-purple-200">
                          <p className="text-purple-800">{optimization}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>登録内容プレビュー</CardTitle>
                <CardDescription>
                  患者様に表示される医師プロフィールのプレビューです
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {formData.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{formData.fullName}</h2>
                        <p className="text-lg text-blue-600 font-medium">{formData.specialization}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary">経験 {formData.experience}</Badge>
                          {formData.languages && (
                            <Badge variant="outline">{formData.languages}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {formData.description && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">プロフィール</h3>
                        <p className="text-gray-700 leading-relaxed">{formData.description}</p>
                      </div>
                    )}
                    
                    {formData.education && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">学歴・経歴</h3>
                        <p className="text-gray-700">{formData.education}</p>
                      </div>
                    )}
                    
                    {formData.certifications && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">専門医資格</h3>
                        <p className="text-gray-700">{formData.certifications}</p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.fullName || !formData.email || !formData.specialization}
                      className="w-full py-3 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <AlertCircle className="mr-2 h-5 w-5 animate-spin" />
                          登録処理中...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          医師登録を完了
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}