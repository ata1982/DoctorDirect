'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface EmergencyContact {
  id: number
  name: string
  relationship: string
  phone: string
  priority: number
}

interface NearbyHospital {
  id: number
  name: string
  address: string
  phone: string
  distance: string
  emergencyServices: string[]
  waitTime: string
  availability: 'available' | 'busy' | 'full'
}

export default function EmergencyPage() {
  const [activeTab, setActiveTab] = useState<'emergency' | 'contacts' | 'hospitals' | 'guidance'>('emergency')
  const [emergencyStep, setEmergencyStep] = useState(0)
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)

  const emergencyContacts: EmergencyContact[] = [
    {
      id: 1,
      name: "田中 花子",
      relationship: "配偶者",
      phone: "090-1234-5678",
      priority: 1
    },
    {
      id: 2,
      name: "田中 太郎",
      relationship: "息子",
      phone: "080-2345-6789",
      priority: 2
    },
    {
      id: 3,
      name: "佐藤 美子",
      relationship: "友人",
      phone: "070-3456-7890",
      priority: 3
    }
  ]

  const nearbyHospitals: NearbyHospital[] = [
    {
      id: 1,
      name: "東京総合病院",
      address: "東京都渋谷区渋谷1-1-1",
      phone: "03-1234-5678",
      distance: "0.8km",
      emergencyServices: ["救急外来", "手術室", "ICU", "心臓血管外科"],
      waitTime: "15分",
      availability: "available"
    },
    {
      id: 2,
      name: "聖マリア医療センター",
      address: "東京都新宿区新宿2-2-2",
      phone: "03-2345-6789",
      distance: "1.5km",
      emergencyServices: ["救急外来", "小児科", "産婦人科"],
      waitTime: "30分",
      availability: "busy"
    },
    {
      id: 3,
      name: "都立中央病院",
      address: "東京都港区港南3-3-3",
      phone: "03-3456-7890",
      distance: "2.1km",
      emergencyServices: ["救急外来", "外科", "内科"],
      waitTime: "45分",
      availability: "full"
    }
  ]

  const emergencySteps = [
    {
      title: "緊急度の確認",
      description: "まず、あなたの状況を確認します",
      questions: [
        "意識はありますか？",
        "呼吸に問題はありますか？",
        "激しい痛みはありますか？",
        "出血はありますか？"
      ]
    },
    {
      title: "基本情報の入力",
      description: "緊急時の対応に必要な情報を入力してください",
      fields: ["症状の詳細", "現在の場所", "年齢", "持病・アレルギー"]
    },
    {
      title: "救急サービスの選択",
      description: "最適な対応方法を選択してください",
      options: ["救急車を呼ぶ", "最寄りの病院に向かう", "緊急連絡先に連絡", "医師とのビデオ通話"]
    }
  ]

  useEffect(() => {
    // 位置情報の取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
        }
      )
    }
  }, [])

  const callAmbulance = () => {
    setIsEmergencyActive(true)
    // 実際の実装では119番通報のAPIを呼び出す
    alert('救急車を要請しました。現在地を確認中です...')
  }

  const contactEmergencyContact = (contact: EmergencyContact) => {
    // 実際の実装では通話アプリまたはSMSアプリを起動
    alert(`${contact.name}に緊急連絡中: ${contact.phone}`)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'full': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return '受入可能'
      case 'busy': return '混雑中'
      case 'full': return '受入困難'
      default: return '不明'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
              🚨 緊急サポート
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              24時間365日、緊急時のサポートを提供します
            </p>
          </div>

          {/* 緊急ボタン */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                緊急事態の場合
              </h2>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={callAmbulance}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🚑 救急車を呼ぶ (119)
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                  👨‍⚕️ 緊急医師相談
                </button>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-4">
                生命に関わる緊急事態の場合は、迷わず119番に電話してください
              </p>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('emergency')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'emergency'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                🚨 緊急対応
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'contacts'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                📞 緊急連絡先
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'hospitals'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                🏥 救急病院
              </button>
              <button
                onClick={() => setActiveTab('guidance')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'guidance'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                📖 応急処置
              </button>
            </div>
          </div>

          {/* 緊急対応タブ */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">緊急時対応フロー</h2>
                
                <div className="space-y-6">
                  {emergencySteps.map((step, index) => (
                    <div key={index} className={`border rounded-lg p-6 ${
                      emergencyStep === index 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          emergencyStep > index ? 'bg-green-500' : 
                          emergencyStep === index ? 'bg-red-500' : 'bg-gray-400'
                        }`}>
                          {emergencyStep > index ? '✓' : index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                      
                      {emergencyStep === index && (
                        <div className="space-y-4">
                          {step.questions && (
                            <div className="space-y-2">
                              {step.questions.map((question, qIndex) => (
                                <div key={qIndex} className="flex items-center gap-3">
                                  <input type="checkbox" className="w-4 h-4 text-red-600" />
                                  <span className="text-gray-700 dark:text-gray-300">{question}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {step.fields && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {step.fields.map((field, fIndex) => (
                                <div key={fIndex}>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {field}
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {step.options && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {step.options.map((option, oIndex) => (
                                <button
                                  key={oIndex}
                                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex gap-3 mt-6">
                            {emergencyStep > 0 && (
                              <button
                                onClick={() => setEmergencyStep(emergencyStep - 1)}
                                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                戻る
                              </button>
                            )}
                            {emergencyStep < emergencySteps.length - 1 && (
                              <button
                                onClick={() => setEmergencyStep(emergencyStep + 1)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                次へ
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 緊急連絡先タブ */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">緊急連絡先</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    ➕ 連絡先追加
                  </button>
                </div>

                <div className="space-y-4">
                  {emergencyContacts.map(contact => (
                    <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                              {contact.priority}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{contact.relationship}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => contactEmergencyContact(contact)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            📞 緊急連絡
                          </button>
                          <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            編集
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 救急病院タブ */}
          {activeTab === 'hospitals' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">最寄りの救急病院</h2>
                
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 dark:text-blue-400">📍</span>
                    <span className="font-medium text-blue-900 dark:text-blue-300">現在地</span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {userLocation ? 
                      `緯度: ${userLocation.latitude.toFixed(4)}, 経度: ${userLocation.longitude.toFixed(4)}` :
                      '位置情報を取得中...'
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  {nearbyHospitals.map(hospital => (
                    <div key={hospital.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{hospital.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(hospital.availability)}`}>
                              {getAvailabilityText(hospital.availability)}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">{hospital.address}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>📞 {hospital.phone}</span>
                            <span>📍 {hospital.distance}</span>
                            <span>⏱️ 待ち時間: {hospital.waitTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hospital.emergencyServices.map((service, index) => (
                          <span key={index} className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm">
                            {service}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                          🚗 経路案内
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          📞 病院に連絡
                        </button>
                        <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          詳細情報
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 応急処置タブ */}
          {activeTab === 'guidance' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">応急処置ガイド</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "心肺蘇生法 (CPR)",
                      icon: "💗",
                      steps: [
                        "意識と呼吸を確認する",
                        "胸骨圧迫を30回行う",
                        "人工呼吸を2回行う",
                        "救急車が来るまで繰り返す"
                      ]
                    },
                    {
                      title: "出血時の処置",
                      icon: "🩸",
                      steps: [
                        "清潔な布で患部を押さえる",
                        "患部を心臓より高く上げる",
                        "圧迫を続ける",
                        "ショック症状に注意する"
                      ]
                    },
                    {
                      title: "熱中症の対処",
                      icon: "🌡️",
                      steps: [
                        "涼しい場所に移動する",
                        "衣服をゆるめる",
                        "水分補給を行う",
                        "体を冷やす"
                      ]
                    },
                    {
                      title: "誤飲・誤嚥時の対処",
                      icon: "🤢",
                      steps: [
                        "まず何を飲んだか確認",
                        "意識があれば水を飲ませる",
                        "吐かせてはいけない場合もある",
                        "すぐに医療機関へ"
                      ]
                    }
                  ].map((guide, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{guide.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{guide.title}</h3>
                      </div>
                      <ol className="space-y-2">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-sm flex items-center justify-center font-bold">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ 重要な注意事項</h3>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                    <li>• 応急処置は一時的な措置です。必ず医療機関を受診してください</li>
                    <li>• 分からない場合は無理をせず、すぐに救急車を呼んでください</li>
                    <li>• 定期的に応急処置の講習を受けることをお勧めします</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}