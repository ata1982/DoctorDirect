'use client'

import { useState } from 'react'
import ModernHeader from '@/components/ModernHeader'
import ModernFooter from '@/components/ModernFooter'

interface SymptomStep {
  id: number
  question: string
  options: string[]
  type: 'single' | 'multiple'
}

interface DiagnosisResult {
  primaryDiagnosis: string
  confidence: number
  recommendations: string[]
  urgency: string
  suggestedSpecialists: string[]
}

export default function AIDiagnosisPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: string[]}>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<DiagnosisResult | null>(null)

  const steps: SymptomStep[] = [
    {
      id: 1,
      question: "現在最も気になる症状は何ですか？",
      options: ["頭痛", "発熱", "咳", "腹痛", "めまい", "息切れ", "胸の痛み", "その他"],
      type: 'single'
    },
    {
      id: 2,
      question: "症状はいつから始まりましたか？",
      options: ["今日", "昨日", "2-3日前", "1週間前", "1ヶ月以上前"],
      type: 'single'
    },
    {
      id: 3,
      question: "症状の程度はどのくらいですか？",
      options: ["軽度（日常生活に支障なし）", "中度（少し辛い）", "重度（日常生活に支障あり）", "激痛（耐えられない）"],
      type: 'single'
    },
    {
      id: 4,
      question: "併発している症状はありますか？（複数選択可）",
      options: ["吐き気", "下痢", "便秘", "食欲不振", "倦怠感", "不眠", "特になし"],
      type: 'multiple'
    }
  ]

  const handleAnswer = (stepId: number, answer: string) => {
    const currentAnswers = answers[stepId] || []
    const step = steps.find(s => s.id === stepId)
    
    if (step?.type === 'single') {
      setAnswers({...answers, [stepId]: [answer]})
    } else {
      if (currentAnswers.includes(answer)) {
        setAnswers({...answers, [stepId]: currentAnswers.filter(a => a !== answer)})
      } else {
        setAnswers({...answers, [stepId]: [...currentAnswers, answer]})
      }
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      analyzeSymptoms()
    }
  }

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true)
    // ダミーAI分析（実際にはAPIを呼び出す）
    setTimeout(() => {
      setResults({
        primaryDiagnosis: "軽度の感冒症候群",
        confidence: 85,
        recommendations: [
          "十分な休息を取ってください",
          "水分を多く摂取してください",
          "症状が3日以上続く場合は医師にご相談ください"
        ],
        urgency: "低",
        suggestedSpecialists: ["内科", "家庭医学科"]
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const resetDiagnosis = () => {
    setCurrentStep(0)
    setAnswers({})
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI症状診断</h1>
            <p className="text-lg text-gray-600">
              いくつかの質問にお答えいただくと、AIが症状を分析して可能性のある病気をお教えします
            </p>
          </div>

          {!results ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* プログレスバー */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">質問 {currentStep + 1} / {steps.length}</span>
                  <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {!isAnalyzing ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {steps[currentStep].question}
                  </h2>
                  
                  <div className="grid gap-3 mb-8">
                    {steps[currentStep].options.map((option, index) => {
                      const isSelected = answers[steps[currentStep].id]?.includes(option)
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(steps[currentStep].id, option)}
                          className={`p-4 text-left rounded-lg border-2 transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                      戻る
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!answers[steps[currentStep].id]?.length}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
                    >
                      {currentStep === steps.length - 1 ? '分析開始' : '次へ'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold mb-2">AI分析中...</h3>
                  <p className="text-gray-600">症状を詳しく分析しています。しばらくお待ちください。</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 分析結果 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">分析完了</h2>
                    <p className="text-gray-600">信頼度: {results.confidence}%</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">推定診断</h3>
                    <p className="text-xl text-blue-600 font-semibold">{results.primaryDiagnosis}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">緊急度</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      results.urgency === '高' ? 'bg-red-100 text-red-800' :
                      results.urgency === '中' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {results.urgency}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">推奨事項</h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">推奨専門科</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.suggestedSpecialists.map((specialist: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {specialist}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 注意事項 */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">重要なお知らせ</h3>
                    <p className="text-amber-700">
                      この診断結果は参考情報であり、医師による正式な診断ではありません。
                      症状が続く場合や悪化する場合は、必ず医療機関を受診してください。
                    </p>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetDiagnosis}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  再診断する
                </button>
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  医師を検索する
                </button>
                <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  相談予約する
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ModernFooter />
    </div>
  )
}