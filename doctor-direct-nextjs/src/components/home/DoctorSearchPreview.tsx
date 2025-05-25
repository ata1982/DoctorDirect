import React, { useState } from 'react'
import { Search, MapPin, Star, Clock } from 'lucide-react'

interface Doctor {
  id: number
  name: string
  specialty: string
  hospital: string
  location: string
  rating: number
  availability: string
  image?: string
}

export default function DoctorSearchPreview() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')

  // サンプルの医師データ
  const sampleDoctors: Doctor[] = [
    {
      id: 1,
      name: '田中 太郎',
      specialty: '内科',
      hospital: '東京総合病院',
      location: '東京都渋谷区',
      rating: 4.8,
      availability: '本日予約可能'
    },
    {
      id: 2,
      name: '佐藤 花子',
      specialty: '皮膚科',
      hospital: '渋谷クリニック',
      location: '東京都渋谷区',
      rating: 4.6,
      availability: '明日予約可能'
    },
    {
      id: 3,
      name: '山田 次郎',
      specialty: '整形外科',
      hospital: '新宿医療センター',
      location: '東京都新宿区',
      rating: 4.9,
      availability: '本日予約可能'
    }
  ]

  const specialties = ['内科', '外科', '皮膚科', '眼科', '耳鼻咽喉科', '整形外科', '小児科', '産婦人科']

  const filteredDoctors = sampleDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          信頼できる医師を見つけよう
        </h2>
        <p className="text-gray-600 text-lg">
          あなたの症状に最適な専門医を簡単に検索・予約できます
        </p>
      </div>

      {/* 検索フォーム */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="医師名、専門科、病院名で検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべての専門科</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            検索
          </button>
        </div>
      </div>

      {/* 医師リスト */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {doctor.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{doctor.hospital}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{doctor.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">(124件のレビュー)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{doctor.availability}</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  予約する
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">検索条件に一致する医師が見つかりませんでした。</p>
          <p className="text-gray-400">検索条件を変更してお試しください。</p>
        </div>
      )}
    </div>
  )
}