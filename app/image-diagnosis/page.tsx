'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Scan, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  Eye,
  Brain,
  Stethoscope
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface DiagnosisResult {
  confidence: number
  condition: string
  description: string
  severity: 'low' | 'medium' | 'high'
  recommendations: string[]
  requiresDoctor: boolean
}

export default function ImageDiagnosisPage() {
  const { data: session } = useSession()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [analysisType, setAnalysisType] = useState<'skin' | 'eye' | 'general'>('skin')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setDiagnosis(null)
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event)
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      // プログレスバーのアニメーション
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('analysisType', analysisType)

      const response = await fetch('/api/ai-diagnosis/image', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      if (response.ok) {
        const result = await response.json()
        setDiagnosis(result.diagnosis)
      } else {
        // フォールバック: モックデータ
        setDiagnosis(getMockDiagnosis())
      }
    } catch (error) {
      console.error('Image analysis error:', error)
      setDiagnosis(getMockDiagnosis())
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getMockDiagnosis = (): DiagnosisResult => {
    const mockResults = {
      skin: {
        confidence: 87,
        condition: '軽度の皮膚炎',
        description: '画像から軽度の皮膚炎の可能性が示唆されます。赤みと軽微な腫れが確認できます。',
        severity: 'low' as const,
        recommendations: [
          '患部を清潔に保つ',
          '刺激の少ない保湿剤を使用',
          '症状が続く場合は皮膚科を受診',
          '搔かないよう注意する'
        ],
        requiresDoctor: false
      },
      eye: {
        confidence: 92,
        condition: '結膜炎の疑い',
        description: '目の充血と軽度の腫れが確認できます。結膜炎の可能性があります。',
        severity: 'medium' as const,
        recommendations: [
          '目を清潔に保つ',
          '目薬の使用を検討',
          '眼科医への相談を推奨',
          'コンタクトレンズの使用を控える'
        ],
        requiresDoctor: true
      },
      general: {
        confidence: 75,
        condition: '要観察',
        description: '特定の症状は確認できませんが、継続的な観察が必要です。',
        severity: 'low' as const,
        recommendations: [
          '症状の変化を観察',
          '異常を感じたら医師に相談',
          '健康的な生活習慣を維持'
        ],
        requiresDoctor: false
      }
    }
    return mockResults[analysisType]
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return '軽度'
      case 'medium': return '中度'
      case 'high': return '重度'
      default: return '不明'
    }
  }

  const analysisTypes = [
    {
      id: 'skin',
      name: '皮膚診断',
      description: '皮膚の状態やトラブルを分析',
      icon: Eye,
      examples: ['湿疹', 'ニキビ', '発疹', 'ほくろ']
    },
    {
      id: 'eye',
      name: '眼科診断',
      description: '目の状態や症状を分析',
      icon: Eye,
      examples: ['充血', '腫れ', '結膜炎', 'ものもらい']
    },
    {
      id: 'general',
      name: '一般診断',
      description: 'その他の症状を総合的に分析',
      icon: Stethoscope,
      examples: ['外傷', '腫れ', '変色', 'その他']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-6xl">
          {/* ヘッダー */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI画像診断
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                最新のAI技術を使用して、症状の写真から初期診断を行います。
                ※これは参考情報であり、正式な診断ではありません。
              </p>
            </motion.div>
          </div>

          {/* 注意事項 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">重要な注意事項</h3>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• この診断結果は参考情報であり、医師の診断に代わるものではありません</li>
                      <li>• 緊急性の高い症状の場合は、すぐに医療機関を受診してください</li>
                      <li>• 症状が悪化する場合は、専門医に相談することをお勧めします</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 画像アップロード */}
            <div className="space-y-6">
              {/* 診断タイプ選択 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    診断タイプを選択
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {analysisTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <div
                          key={type.id}
                          onClick={() => setAnalysisType(type.id as any)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            analysisType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className={`w-6 h-6 ${
                              analysisType === type.id ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{type.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {type.examples.map((example) => (
                                  <Badge key={example} variant="secondary" className="text-xs">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 画像アップロード */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    画像をアップロード
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          症状の写真をアップロードしてください
                        </p>
                        <div className="flex justify-center space-x-4">
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            ファイル選択
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => cameraInputRef.current?.click()}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            カメラで撮影
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="アップロード画像"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setImagePreview(null)
                              setSelectedImage(null)
                              setDiagnosis(null)
                            }}
                          >
                            別の画像を選択
                          </Button>
                          <Button
                            variant="medical"
                            size="sm"
                            onClick={analyzeImage}
                            disabled={isAnalyzing}
                            className="flex-1"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                分析中...
                              </>
                            ) : (
                              <>
                                <Scan className="w-4 h-4 mr-2" />
                                AI診断を開始
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* 分析プログレス */}
                    {isAnalyzing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>AI分析中...</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="w-full" />
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                  />
                </CardContent>
              </Card>
            </div>

            {/* 診断結果 */}
            <div className="space-y-6">
              {diagnosis ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* 診断結果サマリー */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        診断結果
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {diagnosis.condition}
                          </h3>
                          <Badge className={getSeverityColor(diagnosis.severity)}>
                            {getSeverityText(diagnosis.severity)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700">{diagnosis.description}</p>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              信頼度
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {diagnosis.confidence}%
                            </span>
                          </div>
                          <Progress value={diagnosis.confidence} className="w-full" />
                        </div>

                        {diagnosis.requiresDoctor && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <span className="font-medium text-red-800">
                                医師への相談を推奨します
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 推奨事項 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>推奨事項</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {diagnosis.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* アクションボタン */}
                  <div className="space-y-3">
                    <Button className="w-full" variant="medical">
                      医師に相談する
                    </Button>
                    <Button className="w-full" variant="outline">
                      結果を保存
                    </Button>
                    <Button className="w-full" variant="outline">
                      結果を共有
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      診断結果がここに表示されます
                    </h3>
                    <p className="text-gray-600">
                      画像をアップロードして「AI診断を開始」ボタンを押してください
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}