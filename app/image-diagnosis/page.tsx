'use client'

import { useState, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface DiagnosisResult {
  condition: string
  confidence: number
  description: string
  recommendations: string[]
  urgency: 'low' | 'medium' | 'high'
}

export default function ImageDiagnosisPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [bodyPart, setBodyPart] = useState<string>('')
  const [symptoms, setSymptoms] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)
    
    // AIによる画像診断のシミュレーション
    setTimeout(() => {
      const mockResults: DiagnosisResult[] = [
        {
          condition: "接触性皮膚炎の可能性",
          confidence: 75,
          description: "画像から、皮膚の赤みと軽度の腫れが確認できます。アレルギー性または刺激性の接触皮膚炎の可能性があります。",
          recommendations: [
            "患部を清潔に保つ",
            "刺激物との接触を避ける",
            "症状が悪化する場合は皮膚科を受診",
            "市販の抗炎症薬の使用を検討"
          ],
          urgency: 'low'
        },
        {
          condition: "軽度の外傷・擦り傷",
          confidence: 85,
          description: "表面的な皮膚の損傷が見られます。適切な処置により自然治癒が期待できます。",
          recommendations: [
            "傷口を清潔な水で洗浄",
            "消毒薬で消毒",
            "絆創膏で保護",
            "感染の兆候があれば医療機関へ"
          ],
          urgency: 'low'
        }
      ]

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResult(randomResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">📸 AI画像診断</h1>
            <p className="text-lg text-gray-600">
              皮膚症状や外傷の写真をAIが分析し、初期判断をサポートします
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 画像アップロード部分 */}
              <div>
                <h2 className="text-xl font-semibold mb-4">📷 画像をアップロード</h2>
                
                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-gray-600 mb-2">クリックして画像をアップロード</p>
                    <p className="text-sm text-gray-400">JPEG, PNG, GIF (最大10MB)</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="アップロード画像"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null)
                        setResult(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {uploadedImage && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        症状のある部位
                      </label>
                      <select
                        value={bodyPart}
                        onChange={(e) => setBodyPart(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">部位を選択してください</option>
                        <option value="face">顔</option>
                        <option value="neck">首</option>
                        <option value="arms">腕</option>
                        <option value="hands">手</option>
                        <option value="chest">胸</option>
                        <option value="back">背中</option>
                        <option value="legs">脚</option>
                        <option value="feet">足</option>
                        <option value="other">その他</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        症状の詳細
                      </label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="痛み、かゆみ、いつから始まったかなど..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing || !bodyPart}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          AI分析中...
                        </span>
                      ) : (
                        '🔍 AI画像診断を開始'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* 診断結果部分 */}
              <div>
                <h2 className="text-xl font-semibold mb-4">🎯 診断結果</h2>
                
                {!result && !isAnalyzing && (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="mx-auto h-16 w-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>画像をアップロードして診断を開始してください</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-12">
                    <div className="animate-spin h-16 w-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="text-gray-600">AI分析中...</p>
                    <p className="text-sm text-gray-500 mt-2">数秒お待ちください</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${getUrgencyColor(result.urgency)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{result.condition}</h3>
                        <span className="text-sm font-medium">
                          信頼度: {result.confidence}%
                        </span>
                      </div>
                      <p className="text-sm">{result.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">💡 推奨事項</h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-1">✓</span>
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        医師に相談
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                        病院を検索
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 重要な注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">重要な注意事項</h3>
                <div className="text-yellow-700 space-y-2">
                  <p>• このAI画像診断は参考情報であり、医師による診断の代替ではありません</p>
                  <p>• 症状が悪化する場合や心配な場合は、必ず医療機関を受診してください</p>
                  <p>• 緊急を要する外傷や症状の場合は、迷わず救急医療機関を受診してください</p>
                  <p>• 個人情報保護のため、アップロードされた画像は分析後に自動削除されます</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}