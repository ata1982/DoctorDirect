'use client'

import { useState } from 'react'

interface Hospital {
  id: number
  name: string
  address: string
  phone: string
  specialties: string[]
  rating: number
  distance: number
  waitTime: number
  hasEmergency: boolean
  acceptsInsurance: boolean
  matchScore: number
  reasons: string[]
}

interface HospitalRecommendationProps {
  diagnosis: string
  symptoms: string[]
  urgency: 'low' | 'medium' | 'high'
  location?: string
}

export default function HospitalRecommendation({ 
  diagnosis, 
  symptoms, 
  urgency, 
  location = "新宿区" 
}: HospitalRecommendationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // AIによる病院推薦ロジック（実際のAIでは外部APIを使用）
  const getRecommendedHospitals = (): Hospital[] => {
    const allHospitals: Hospital[] = [
      {
        id: 1,
        name: "東京総合病院",
        address: "東京都新宿区西新宿1-1-1",
        phone: "03-1234-5678",
        specialties: ["内科", "外科", "救急科", "循環器科"],
        rating: 4.8,
        distance: 0.8,
        waitTime: 45,
        hasEmergency: true,
        acceptsInsurance: true,
        matchScore: 95,
        reasons: ["24時間救急対応", "専門医在籍", "最新設備完備"]
      },
      {
        id: 2,
        name: "新宿メディカルセンター",
        address: "東京都新宿区新宿3-2-1",
        phone: "03-2345-6789",
        specialties: ["内科", "呼吸器科", "消化器科"],
        rating: 4.5,
        distance: 1.2,
        waitTime: 30,
        hasEmergency: false,
        acceptsInsurance: true,
        matchScore: 88,
        reasons: ["待ち時間が短い", "症状に特化した専門科", "評価が高い"]
      },
      {
        id: 3,
        name: "渋谷クリニック",
        address: "東京都渋谷区渋谷2-3-4",
        phone: "03-3456-7890",
        specialties: ["内科", "皮膚科", "小児科"],
        rating: 4.2,
        distance: 2.1,
        waitTime: 20,
        hasEmergency: false,
        acceptsInsurance: true,
        matchScore: 75,
        reasons: ["アクセス良好", "予約が取りやすい", "丁寧な診療"]
      }
    ]

    // 症状と緊急度に基づいてフィルタリング・ソート
    return allHospitals
      .filter(hospital => {
        if (urgency === 'high') return hospital.hasEmergency
        return true
      })
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  const recommendedHospitals = getRecommendedHospitals()

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🚨 緊急度: 高'
      case 'medium': return '⚠️ 緊急度: 中'
      case 'low': return '💡 緊急度: 低'
      default: return '緊急度: 不明'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          🏥 おすすめ医療機関
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(urgency)}`}>
          {getUrgencyText(urgency)}
        </span>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>診断結果:</strong> {diagnosis}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          <strong>症状:</strong> {symptoms.join(', ')}
        </p>
      </div>

      <div className="space-y-4">
        {recommendedHospitals.slice(0, isExpanded ? recommendedHospitals.length : 2).map((hospital, index) => (
          <div key={hospital.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{hospital.name}</h4>
                  {index === 0 && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                      最適
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    適合率 {hospital.matchScore}%
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">📍 {hospital.address}</p>
                <p className="text-gray-600 text-sm mb-2">📞 {hospital.phone}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>⭐ {hospital.rating}</span>
                  <span>🚶 {hospital.distance}km</span>
                  <span>⏱️ 待ち時間約{hospital.waitTime}分</span>
                  {hospital.hasEmergency && <span className="text-red-600">🚨 救急対応</span>}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-900 mb-2">専門科</h5>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((specialty, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">推薦理由</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {hospital.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                📞 今すぐ電話
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                📅 予約する
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                🗺️ 地図を見る
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendedHospitals.length > 2 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isExpanded ? '▲ 折りたたむ' : `▼ さらに${recommendedHospitals.length - 2}件の病院を表示`}
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">重要な注意事項</p>
            <p>この推薦は参考情報です。緊急時は迷わず119番通報を行ってください。症状が重篤な場合は、最寄りの救急病院を受診してください。</p>
          </div>
        </div>
      </div>
    </div>
  )
}