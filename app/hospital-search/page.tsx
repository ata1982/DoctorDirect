'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Hospital {
  id: number
  name: string
  address: string
  phone: string
  rating: number
  reviews: number
  specialties: string[]
  distance: number
  openHours: string
  emergencyService: boolean
  hasParking: boolean
  acceptsInsurance: boolean
  image: string
}

export default function HospitalSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [location, setLocation] = useState('')
  const [maxDistance, setMaxDistance] = useState(10)
  const [emergencyOnly, setEmergencyOnly] = useState(false)

  const specialties = [
    { value: 'all', label: '全ての科' },
    { value: 'internal', label: '内科' },
    { value: 'surgery', label: '外科' },
    { value: 'pediatrics', label: '小児科' },
    { value: 'gynecology', label: '産婦人科' },
    { value: 'orthopedics', label: '整形外科' },
    { value: 'dermatology', label: '皮膚科' },
    { value: 'ophthalmology', label: '眼科' },
    { value: 'emergency', label: '救急科' }
  ]

  const hospitals: Hospital[] = [
    {
      id: 1,
      name: "東京総合病院",
      address: "東京都新宿区西新宿1-1-1",
      phone: "03-1234-5678",
      rating: 4.5,
      reviews: 342,
      specialties: ["内科", "外科", "救急科", "循環器科"],
      distance: 2.5,
      openHours: "24時間",
      emergencyService: true,
      hasParking: true,
      acceptsInsurance: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "渋谷クリニック",
      address: "東京都渋谷区渋谷1-2-3",
      phone: "03-2345-6789",
      rating: 4.2,
      reviews: 156,
      specialties: ["内科", "皮膚科", "小児科"],
      distance: 1.8,
      openHours: "9:00-18:00",
      emergencyService: false,
      hasParking: false,
      acceptsInsurance: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "青山医療センター",
      address: "東京都港区青山2-3-4",
      phone: "03-3456-7890",
      rating: 4.7,
      reviews: 289,
      specialties: ["産婦人科", "小児科", "整形外科"],
      distance: 3.2,
      openHours: "8:00-20:00",
      emergencyService: true,
      hasParking: true,
      acceptsInsurance: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      name: "品川眼科クリニック",
      address: "東京都品川区品川3-4-5",
      phone: "03-4567-8901",
      rating: 4.3,
      reviews: 98,
      specialties: ["眼科"],
      distance: 4.1,
      openHours: "9:00-17:00",
      emergencyService: false,
      hasParking: true,
      acceptsInsurance: true,
      image: "/api/placeholder/300/200"
    }
  ]

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            hospital.specialties.some(spec => 
                              specialties.find(s => s.value === selectedSpecialty)?.label === spec
                            )
    const matchesDistance = hospital.distance <= maxDistance
    const matchesEmergency = !emergencyOnly || hospital.emergencyService

    return matchesSearch && matchesSpecialty && matchesDistance && matchesEmergency
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            病院検索
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            お近くの病院やクリニックを検索して、最適な医療機関を見つけましょう
          </p>
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                病院名・地域で検索
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="病院名や地域を入力"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                診療科
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specialties.map(specialty => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大距離: {maxDistance}km
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emergency"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="emergency" className="text-sm font-medium text-gray-700">
                救急対応のみ
              </label>
            </div>
          </div>
        </div>

        {/* 検索結果 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHospitals.map(hospital => (
            <div key={hospital.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={hospital.image}
                alt={hospital.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{hospital.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm font-medium">{hospital.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({hospital.reviews})</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{hospital.address}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 002-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">{hospital.phone}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{hospital.openHours}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">約{hospital.distance}km</span>
                  </div>
                </div>

                {/* 診療科タグ */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hospital.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* アイコン情報 */}
                <div className="flex space-x-4 mb-4">
                  {hospital.emergencyService && (
                    <div className="flex items-center text-red-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">救急対応</span>
                    </div>
                  )}
                  {hospital.hasParking && (
                    <div className="flex items-center text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                      <span className="text-xs">駐車場あり</span>
                    </div>
                  )}
                  {hospital.acceptsInsurance && (
                    <div className="flex items-center text-blue-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">保険適用</span>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    詳細を見る
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors">
                    予約する
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 検索結果が0件の場合 */}
        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">検索結果が見つかりませんでした</h3>
            <p className="text-gray-600">検索条件を変更してもう一度お試しください。</p>
          </div>
        )}

        {/* 地図表示エリア */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">マップで確認</h2>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg">マップを読み込み中...</p>
              <p className="text-sm">実際の実装では、Google Maps APIなどを使用してマップを表示します</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}