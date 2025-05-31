'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Calendar,
  Video,
  Phone,
  MessageCircle,
  Filter,
  Heart,
  Award,
  Users
} from 'lucide-react'
import ModernHeader from '@/components/ModernHeader'
import ModernFooter from '@/components/ModernFooter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface Doctor {
  id: string
  name: string
  specialty: string[]
  rating: number
  reviewCount: number
  experience: number
  hospital: string
  location: string
  distance: number
  consultationFee: number
  availableSlots: string[]
  languages: string[]
  image: string
  isOnline: boolean
  responseTime: string
  bio: string
}

export default function DoctorSearchPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const specialties = [
    '内科', '外科', '小児科', '産婦人科', '皮膚科', '眼科', '耳鼻咽喉科',
    '整形外科', '精神科', '泌尿器科', '循環器科', '呼吸器科', '消化器科'
  ]

  const locations = [
    '東京都', '神奈川県', '大阪府', '愛知県', '埼玉県', '千葉県', '兵庫県', '福岡県'
  ]

  useEffect(() => {
    fetchDoctors()
  }, [searchTerm, selectedSpecialty, selectedLocation, sortBy])

  const fetchDoctors = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        specialty: selectedSpecialty,
        location: selectedLocation,
        sortBy
      })
      
      const response = await fetch(`/api/doctors/search?${params}`)
      const data = await response.json()
      setDoctors(data.doctors || mockDoctors)
    } catch (error) {
      console.error('Doctor search error:', error)
      setDoctors(mockDoctors)
    } finally {
      setIsLoading(false)
    }
  }

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: '田中 健一',
      specialty: ['内科', '循環器科'],
      rating: 4.8,
      reviewCount: 127,
      experience: 15,
      hospital: '東京総合病院',
      location: '東京都新宿区',
      distance: 1.2,
      consultationFee: 5000,
      availableSlots: ['今日 15:00', '明日 10:00', '明日 14:00'],
      languages: ['日本語', '英語'],
      image: '/api/placeholder/doctor1.jpg',
      isOnline: true,
      responseTime: '平均15分',
      bio: '循環器疾患の専門医として15年の経験。患者様一人ひとりに寄り添った診療を心がけています。'
    },
    {
      id: '2',
      name: '佐藤 美咲',
      specialty: ['皮膚科', '美容皮膚科'],
      rating: 4.9,
      reviewCount: 203,
      experience: 12,
      hospital: '渋谷スキンクリニック',
      location: '東京都渋谷区',
      distance: 2.5,
      consultationFee: 6000,
      availableSlots: ['今日 16:30', '明日 11:00'],
      languages: ['日本語'],
      image: '/api/placeholder/doctor2.jpg',
      isOnline: true,
      responseTime: '平均10分',
      bio: '皮膚疾患全般に対応。アトピー性皮膚炎やニキビ治療を得意としています。'
    },
    {
      id: '3',
      name: '山田 昭雄',
      specialty: ['整形外科', 'リハビリテーション科'],
      rating: 4.7,
      reviewCount: 89,
      experience: 20,
      hospital: '品川整形外科病院',
      location: '東京都品川区',
      distance: 3.1,
      consultationFee: 5500,
      availableSlots: ['明後日 9:00', '明後日 13:30'],
      languages: ['日本語', '中国語'],
      image: '/api/placeholder/doctor3.jpg',
      isOnline: false,
      responseTime: '平均30分',
      bio: 'スポーツ外傷・障害の治療を専門とし、アスリートのサポートも行っています。'
    }
  ]

  const handleBookConsultation = (doctorId: string, type: 'video' | 'phone' | 'chat') => {
    // 相談予約処理
    console.log(`Booking ${type} consultation with doctor ${doctorId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">医師検索</h1>
              <p className="text-lg text-gray-600">
                あなたに最適な医師を見つけて、安心の医療相談を始めましょう
              </p>
            </div>
          </div>

          {/* 検索フィルター */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="医師名や専門分野で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="col-span-1 md:col-span-2"
              />
              
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべての専門科</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべての地域</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  詳細フィルター
                </Button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="rating">評価順</option>
                  <option value="distance">距離順</option>
                  <option value="experience">経験年数順</option>
                  <option value="fee">料金順</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                {doctors.length}件の医師が見つかりました
              </div>
            </div>

            {/* 詳細フィルター */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      相談方法
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        ビデオ通話
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        音声通話
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        チャット
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      料金範囲
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="fee" className="mr-2" />
                        ¥3,000以下
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="fee" className="mr-2" />
                        ¥3,000-¥5,000
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="fee" className="mr-2" />
                        ¥5,000以上
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      対応言語
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        英語
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        中国語
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        韓国語
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 医師リスト */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">医師を検索中...</p>
              </div>
            ) : (
              doctors.map((doctor, index) => (
                <div key={doctor.id}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* 医師情報 */}
                        <div className="lg:col-span-2">
                          <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="w-10 h-10 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {doctor.name}
                                </h3>
                                {doctor.isOnline && (
                                  <Badge variant="success">オンライン</Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {doctor.specialty.map(spec => (
                                  <Badge key={spec} variant="specialty">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  {doctor.rating} ({doctor.reviewCount}件)
                                </div>
                                <div className="flex items-center">
                                  <Award className="w-4 h-4 mr-1" />
                                  {doctor.experience}年の経験
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {doctor.distance}km
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-3">
                                {doctor.hospital} • {doctor.location}
                              </p>

                              <p className="text-sm text-gray-700">
                                {doctor.bio}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 予約情報 */}
                        <div className="lg:col-span-2">
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-3">
                              利用可能な時間
                            </h4>
                            <div className="space-y-2">
                              {doctor.availableSlots.slice(0, 3).map((slot, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{slot}</span>
                                  <Button size="sm" variant="outline">
                                    予約
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">相談料金:</span>
                              <span className="font-medium">¥{doctor.consultationFee.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">応答時間:</span>
                              <span className="font-medium">{doctor.responseTime}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">対応言語:</span>
                              <span className="font-medium">{doctor.languages.join(', ')}</span>
                            </div>
                          </div>

                          {/* 相談方法ボタン */}
                          <div className="flex space-x-2 mt-4">
                            <Button
                              variant="medical"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleBookConsultation(doctor.id, 'video')}
                            >
                              <Video className="w-4 h-4 mr-1" />
                              ビデオ
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleBookConsultation(doctor.id, 'phone')}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              音声
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleBookConsultation(doctor.id, 'chat')}
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              チャット
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <ModernFooter />
    </div>
  )
}