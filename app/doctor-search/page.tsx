'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Doctor {
  id: number
  name: string
  specialty: string
  hospital: string
  rating: number
  reviews: number
  experience: number
  languages: string[]
  availability: string[]
  price: number
  image: string
  bio: string
  education: string[]
  certifications: string[]
  consultationType: ('in-person' | 'video' | 'phone')[]
  nextAvailable: string
  location: string
  distance: number
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
  type: 'in-person' | 'video' | 'phone'
}

export default function DoctorSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [consultationType, setConsultationType] = useState<'all' | 'in-person' | 'video' | 'phone'>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance' | 'availability'>('rating')
  const [showDetails, setShowDetails] = useState<number | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)

  const specialties = [
    { value: 'all', label: '全ての科', icon: '🏥' },
    { value: 'internal', label: '内科', icon: '🫀' },
    { value: 'pediatrics', label: '小児科', icon: '👶' },
    { value: 'cardiology', label: '循環器科', icon: '💓' },
    { value: 'dermatology', label: '皮膚科', icon: '🧴' },
    { value: 'orthopedics', label: '整形外科', icon: '🦴' },
    { value: 'psychiatry', label: '精神科', icon: '🧠' },
    { value: 'gynecology', label: '産婦人科', icon: '👩' },
    { value: 'ophthalmology', label: '眼科', icon: '👁️' }
  ]

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "田中 健一",
      specialty: "内科",
      hospital: "東京総合病院",
      rating: 4.8,
      reviews: 124,
      experience: 15,
      languages: ["日本語", "英語"],
      availability: ["9:00", "10:00", "14:00", "15:00"],
      price: 3000,
      image: "/api/placeholder/150/150",
      bio: "内科専門医として15年の経験を持ち、特に生活習慣病の治療に専門性を発揮しています。患者様一人ひとりに寄り添った医療を心がけています。",
      education: ["東京大学医学部卒業", "同大学院医学系研究科修了"],
      certifications: ["内科専門医", "総合内科専門医", "糖尿病専門医"],
      consultationType: ['in-person', 'video'],
      nextAvailable: "2024-05-29 9:00",
      location: "新宿区",
      distance: 2.5
    },
    {
      id: 2,
      name: "佐藤 美咲",
      specialty: "小児科",
      hospital: "こども医療センター",
      rating: 4.9,
      reviews: 98,
      experience: 12,
      languages: ["日本語"],
      availability: ["9:30", "11:00", "13:30", "16:00"],
      price: 2500,
      image: "/api/placeholder/150/150",
      bio: "小児科専門医として、新生児から思春期まで幅広い年齢の子どもたちの健康をサポートしています。子どもとご家族が安心できる医療を提供いたします。",
      education: ["慶應義塾大学医学部卒業", "国立成育医療研究センター研修修了"],
      certifications: ["小児科専門医", "小児神経専門医"],
      consultationType: ['in-person', 'video', 'phone'],
      nextAvailable: "2024-05-28 13:30",
      location: "世田谷区",
      distance: 3.8
    },
    {
      id: 3,
      name: "山田 修",
      specialty: "循環器科",
      hospital: "心臓血管クリニック",
      rating: 4.7,
      reviews: 76,
      experience: 20,
      languages: ["日本語", "英語", "中国語"],
      availability: ["10:00", "11:30", "14:30", "17:00"],
      price: 4000,
      image: "/api/placeholder/150/150",
      bio: "循環器専門医として20年の経験を持ち、心疾患の予防と治療に力を入れています。最新の医療技術を駆使した丁寧な診療を行います。",
      education: ["順天堂大学医学部卒業", "ハーバード大学公衆衛生大学院修了"],
      certifications: ["循環器専門医", "心血管インターベンション専門医", "日本医師会認定産業医"],
      consultationType: ['in-person', 'video'],
      nextAvailable: "2024-05-29 14:30",
      location: "港区",
      distance: 4.2
    },
    {
      id: 4,
      name: "鈴木 直美",
      specialty: "皮膚科",
      hospital: "スキンケアクリニック",
      rating: 4.6,
      reviews: 189,
      experience: 8,
      languages: ["日本語", "英語"],
      availability: ["9:00", "10:30", "15:00", "16:30"],
      price: 2800,
      image: "/api/placeholder/150/150",
      bio: "皮膚科専門医として、アトピー性皮膚炎から美容皮膚科まで幅広く対応しています。患者様の肌の悩みに寄り添います。",
      education: ["日本医科大学卒業", "東京女子医科大学皮膚科学教室"],
      certifications: ["皮膚科専門医", "美容皮膚科学会認定医"],
      consultationType: ['in-person', 'video'],
      nextAvailable: "2024-05-28 15:00",
      location: "渋谷区",
      distance: 1.9
    }
  ]

  const generateTimeSlots = (doctor: Doctor): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      doctor.availability.forEach(time => {
        doctor.consultationType.forEach(type => {
          slots.push({
            date: dateString,
            time,
            available: Math.random() > 0.3, // ランダムに空き状況を設定
            type
          })
        })
      })
    }
    return slots
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.includes(searchQuery) || 
                         doctor.specialty.includes(searchQuery) || 
                         doctor.hospital.includes(searchQuery)
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            doctor.specialty === specialties.find(s => s.value === selectedSpecialty)?.label
    const matchesPrice = doctor.price >= priceRange[0] && doctor.price <= priceRange[1]
    const matchesConsultationType = consultationType === 'all' || 
                                   doctor.consultationType.includes(consultationType)
    return matchesSearch && matchesSpecialty && matchesPrice && matchesConsultationType
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating
      case 'price': return a.price - b.price
      case 'distance': return a.distance - b.distance
      case 'availability': return new Date(a.nextAvailable).getTime() - new Date(b.nextAvailable).getTime()
      default: return 0
    }
  })

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return '🏥'
      case 'video': return '📹'
      case 'phone': return '📞'
      default: return '💬'
    }
  }

  const getConsultationTypeLabel = (type: string) => {
    switch (type) {
      case 'in-person': return '対面診療'
      case 'video': return 'ビデオ通話'
      case 'phone': return '電話相談'
      default: return '相談'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">医師検索・予約</h1>
            <p className="text-lg text-gray-600">
              専門医を検索して、対面・オンライン診療の予約ができます
            </p>
            <div className="flex justify-center mt-6 space-x-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                即日予約可能
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                オンライン対応
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                専門医認定
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 高度な検索フィルター */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">🔍 検索条件</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">キーワード</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="医師名、病院名、専門分野"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">専門科</label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {specialties.map(specialty => (
                        <option key={specialty.value} value={specialty.value}>
                          {specialty.icon} {specialty.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">診療方法</label>
                    <select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">全ての診療方法</option>
                      <option value="in-person">🏥 対面診療</option>
                      <option value="video">📹 ビデオ通話</option>
                      <option value="phone">📞 電話相談</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">希望日</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      料金範囲: ¥{priceRange[0].toLocaleString()} - ¥{priceRange[1].toLocaleString()}
                    </label>
                    <div className="px-3">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">並び替え</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="rating">⭐ 評価順</option>
                      <option value="price">💰 料金順</option>
                      <option value="distance">📍 距離順</option>
                      <option value="availability">⏰ 空き状況順</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedSpecialty('all')
                      setConsultationType('all')
                      setSelectedDate('')
                      setPriceRange([0, 10000])
                    }}
                    className="w-full text-blue-600 text-sm hover:text-blue-800"
                  >
                    🔄 検索条件をリセット
                  </button>
                </div>
              </div>
            </div>

            {/* 医師リスト */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-600">{filteredDoctors.length}名</span>の医師が見つかりました
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">表示:</span>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded">カード</button>
                  <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">リスト</button>
                </div>
              </div>

              <div className="space-y-6">
                {filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* 医師画像・基本情報 */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center relative">
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                専門医
                              </span>
                            </div>
                            <p className="text-blue-600 font-medium text-lg mb-1">{doctor.specialty}</p>
                            <p className="text-gray-600 mb-1">🏥 {doctor.hospital}</p>
                            <p className="text-gray-600 mb-1">📍 {doctor.location} ({doctor.distance}km)</p>
                            <p className="text-gray-600">⏰ 最短予約: {doctor.nextAvailable}</p>
                          </div>
                          <div className="text-right mt-4 lg:mt-0">
                            <div className="text-2xl font-bold text-gray-900">¥{doctor.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">初診料から</div>
                          </div>
                        </div>

                        {/* 評価・経験年数 */}
                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">{doctor.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({doctor.reviews}件)</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            👨‍⚕️ 経験{doctor.experience}年
                          </div>
                        </div>

                        {/* 診療方法 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {doctor.consultationType.map(type => (
                            <span key={type} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              {getConsultationTypeIcon(type)} {getConsultationTypeLabel(type)}
                            </span>
                          ))}
                        </div>

                        {/* 対応言語 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {doctor.languages.map(lang => (
                            <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              🗣️ {lang}
                            </span>
                          ))}
                        </div>

                        {/* 詳細表示トグル */}
                        {showDetails === doctor.id && (
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">プロフィール詳細</h4>
                            <p className="text-gray-600 text-sm mb-3">{doctor.bio}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">🎓 学歴</h5>
                                <ul className="text-gray-600 space-y-1">
                                  {doctor.education.map((edu, idx) => (
                                    <li key={idx}>• {edu}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">📋 資格・専門医</h5>
                                <ul className="text-gray-600 space-y-1">
                                  {doctor.certifications.map((cert, idx) => (
                                    <li key={idx}>• {cert}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* アクションボタン */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={() => setSelectedDoctor(doctor)}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            📅 予約する
                          </button>
                          <button 
                            onClick={() => setShowDetails(showDetails === doctor.id ? null : doctor.id)}
                            className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            {showDetails === doctor.id ? '📄 詳細を閉じる' : 'ℹ️ 詳細を見る'}
                          </button>
                          <button className="sm:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                            💬 メッセージ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.668-6.29 1.82M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">該当する医師が見つかりませんでした</h3>
                  <p className="text-gray-600 mb-4">検索条件を変更して再度お試しください</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedSpecialty('all')
                      setConsultationType('all')
                      setPriceRange([0, 10000])
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    🔄 検索条件をリセット
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 高度な予約モーダル */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">📅 予約確認</h3>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* 医師情報サマリー */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{selectedDoctor.name}</h4>
                  <p className="text-blue-600">{selectedDoctor.specialty}</p>
                  <p className="text-gray-600 text-sm">{selectedDoctor.hospital}</p>
                </div>
              </div>
            </div>

            {/* 診療方法選択 */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">診療方法を選択</h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedDoctor.consultationType.map(type => (
                  <button
                    key={type}
                    onClick={() => {/* 診療方法選択ロジック */}}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">{getConsultationTypeIcon(type)}</div>
                    <div className="font-medium text-sm">{getConsultationTypeLabel(type)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {type === 'in-person' ? selectedDoctor.hospital : 'オンライン'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 日時選択 */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">日時を選択</h4>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {generateTimeSlots(selectedDoctor).slice(0, 21).map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => slot.available && setSelectedTimeSlot(slot)}
                    disabled={!slot.available}
                    className={`p-2 text-xs rounded-lg border ${
                      slot.available 
                        ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50' 
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    } ${selectedTimeSlot?.date === slot.date && selectedTimeSlot?.time === slot.time 
                        ? 'border-blue-500 bg-blue-100' : ''}`}
                  >
                    <div className="font-medium">{new Date(slot.date).getDate()}日</div>
                    <div>{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 症状・相談内容 */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">相談内容（任意）</h4>
              <textarea
                placeholder="症状や相談したい内容を簡潔にご記入ください..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            {/* 料金情報 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">料金詳細</h4>
              <div className="flex justify-between items-center">
                <span>初診料</span>
                <span className="font-bold">¥{selectedDoctor.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>システム利用料</span>
                <span>¥300</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center font-bold">
                <span>合計</span>
                <span>¥{(selectedDoctor.price + 300).toLocaleString()}</span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button 
                disabled={!selectedTimeSlot}
                className="flex-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ¥{(selectedDoctor.price + 300).toLocaleString()} で予約確定
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}