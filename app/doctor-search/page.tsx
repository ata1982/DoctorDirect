'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type SearchType = 'doctors' | 'hospitals'

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
  bio: string
  education: string[]
  certifications: string[]
  consultationType: ('in-person' | 'video' | 'phone')[]
  nextAvailable: string
  location: string
  distance: number
}

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

export default function SearchPage() {
  const [searchType, setSearchType] = useState<SearchType>('doctors')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [consultationType, setConsultationType] = useState<'all' | 'in-person' | 'video' | 'phone'>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance' | 'availability'>('rating')
  const [showDetails, setShowDetails] = useState<number | null>(null)
  const [maxDistance, setMaxDistance] = useState(10)
  const [emergencyOnly, setEmergencyOnly] = useState(false)

  const specialties = [
    { value: 'all', label: '全ての科', icon: '🏥' },
    { value: 'internal', label: '内科', icon: '🫀' },
    { value: 'pediatrics', label: '小児科', icon: '👶' },
    { value: 'cardiology', label: '循環器科', icon: '💓' },
    { value: 'dermatology', label: '皮膚科', icon: '🧴' },
    { value: 'orthopedics', label: '整形外科', icon: '🦴' },
    { value: 'psychiatry', label: '精神科', icon: '🧠' },
    { value: 'gynecology', label: '産婦人科', icon: '👩' },
    { value: 'ophthalmology', label: '眼科', icon: '👁️' },
    { value: 'emergency', label: '救急科', icon: '🚨' }
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
      bio: "内科専門医として15年の経験を持ち、特に生活習慣病の治療に専門性を発揮しています。",
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
      bio: "小児科専門医として、新生児から思春期まで幅広い年齢の子どもたちの健康をサポートしています。",
      education: ["慶應義塾大学医学部卒業", "国立成育医療研究センター研修修了"],
      certifications: ["小児科専門医", "小児神経専門医"],
      consultationType: ['in-person', 'video', 'phone'],
      nextAvailable: "2024-05-28 13:30",
      location: "世田谷区",
      distance: 3.8
    }
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
    }
  ]

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

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedSpecialty('all')
    setConsultationType('all')
    setSelectedDate('')
    setPriceRange([0, 10000])
    setMaxDistance(10)
    setEmergencyOnly(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              医療機関・医師検索
            </h1>
            <p className="text-lg text-gray-600">
              最適な医師や病院を見つけて、安心の医療サービスを受けましょう
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg">
              <button
                onClick={() => setSearchType('doctors')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  searchType === 'doctors'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                👨‍⚕️ 医師検索
              </button>
              <button
                onClick={() => setSearchType('hospitals')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  searchType === 'hospitals'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                🏥 病院検索
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
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
                      placeholder={searchType === 'doctors' ? '医師名、病院名、専門分野' : '病院名、地域'}
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

                  {searchType === 'doctors' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">診療方法</label>
                        <select
                          value={consultationType}
                          onChange={(e) => setConsultationType(e.target.value as 'all' | 'in-person' | 'video' | 'phone')}
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
                    </>
                  )}

                  {searchType === 'hospitals' && (
                    <>
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
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">並び替え</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'distance' | 'availability')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="rating">⭐ 評価順</option>
                      <option value="price">💰 料金順</option>
                      <option value="distance">📍 距離順</option>
                      {searchType === 'doctors' && <option value="availability">⏰ 空き状況順</option>}
                    </select>
                  </div>

                  <button 
                    onClick={resetFilters}
                    className="w-full text-blue-600 text-sm hover:text-blue-800"
                  >
                    🔄 検索条件をリセット
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-600">
                    {searchType === 'doctors' ? filteredDoctors.length : filteredHospitals.length}
                  </span>
                  {searchType === 'doctors' ? '名の医師' : '件の病院'}が見つかりました
                </p>
              </div>

              <div className="space-y-6">
                {searchType === 'doctors' ? (
                  filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                      <div className="flex flex-col lg:flex-row gap-6">
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

                          <div className="flex flex-wrap gap-2 mb-4">
                            {doctor.consultationType.map((type) => (
                              <span key={type} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                {getConsultationTypeIcon(type)} {getConsultationTypeLabel(type)}
                              </span>
                            ))}
                          </div>

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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredHospitals.map((hospital) => (
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
                  ))
                )}
              </div>

              {((searchType === 'doctors' && filteredDoctors.length === 0) || 
               (searchType === 'hospitals' && filteredHospitals.length === 0)) && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.668-6.29 1.82M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    該当する{searchType === 'doctors' ? '医師' : '病院'}が見つかりませんでした
                  </h3>
                  <p className="text-gray-600 mb-4">検索条件を変更して再度お試しください</p>
                  <button 
                    onClick={resetFilters}
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

            <div className="mb-6">
              <h4 className="font-semibold mb-3">診療方法を選択</h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedDoctor.consultationType.map((type) => (
                  <button
                    key={type}
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

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button 
                className="flex-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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