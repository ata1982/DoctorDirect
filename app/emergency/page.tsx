'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Heart,
  Brain,
  Car,
  Navigation,
  PhoneCall,
  Stethoscope
} from 'lucide-react'
import ModernHeader from '@/components/ModernHeader'
import ModernFooter from '@/components/ModernFooter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmergencyContact {
  name: string
  number: string
  type: 'ambulance' | 'police' | 'fire' | 'poison' | 'mental'
  description: string
}

interface NearbyHospital {
  name: string
  address: string
  distance: string
  phone: string
  emergencyAvailable: boolean
  waitTime: string
  departments: string[]
}

export default function EmergencyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospital[]>([])
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string>('')

  useEffect(() => {
    // 位置情報を取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          loadNearbyHospitals()
        },
        (error) => {
          console.error('Location error:', error)
          loadNearbyHospitals() // フォールバック
        }
      )
    } else {
      loadNearbyHospitals() // フォールバック
    }
  }, [])

  const loadNearbyHospitals = () => {
    // モックデータ（実際にはAPI呼び出し）
    setNearbyHospitals([
      {
        name: '東京総合病院',
        address: '東京都千代田区丸の内1-1-1',
        distance: '1.2km',
        phone: '03-1234-5678',
        emergencyAvailable: true,
        waitTime: '15分',
        departments: ['救急科', '内科', '外科', '循環器科']
      },
      {
        name: '中央医療センター',
        address: '東京都港区六本木2-2-2',
        distance: '2.8km',
        phone: '03-2345-6789',
        emergencyAvailable: true,
        waitTime: '30分',
        departments: ['救急科', '脳神経外科', '整形外科']
      },
      {
        name: '都立病院',
        address: '東京都新宿区歌舞伎町3-3-3',
        distance: '3.5km',
        phone: '03-3456-7890',
        emergencyAvailable: false,
        waitTime: '45分',
        departments: ['内科', '外科', '小児科']
      }
    ])
  }

  const emergencyContacts: EmergencyContact[] = [
    {
      name: '救急車',
      number: '119',
      type: 'ambulance',
      description: '生命に関わる緊急事態'
    },
    {
      name: '警察',
      number: '110',
      type: 'police',
      description: '事件・事故・犯罪'
    },
    {
      name: '消防署',
      number: '119',
      type: 'fire',
      description: '火災・救助'
    },
    {
      name: '中毒110番',
      number: '0990-50-2499',
      type: 'poison',
      description: '中毒・誤飲事故'
    },
    {
      name: 'こころの健康相談',
      number: '0570-064-556',
      type: 'mental',
      description: '精神的危機・自殺予防'
    }
  ]

  const emergencyTypes = [
    {
      id: 'cardiac',
      name: '心臓発作',
      icon: Heart,
      color: 'text-red-600 bg-red-100',
      symptoms: ['胸の激痛', '呼吸困難', '冷や汗', '意識朦朧'],
      actions: ['119番通報', '楽な姿勢で安静', 'AEDの準備']
    },
    {
      id: 'stroke',
      name: '脳卒中',
      icon: Brain,
      color: 'text-purple-600 bg-purple-100',
      symptoms: ['突然の麻痺', '言語障害', '激しい頭痛', '意識障害'],
      actions: ['119番通報', '気道確保', '横向きに寝かせる']
    },
    {
      id: 'accident',
      name: '外傷・事故',
      icon: Car,
      color: 'text-orange-600 bg-orange-100',
      symptoms: ['出血', '骨折', '意識不明', '重篤な外傷'],
      actions: ['119番通報', '止血処置', '頸椎固定']
    },
    {
      id: 'poisoning',
      name: '中毒・誤飲',
      icon: AlertTriangle,
      color: 'text-yellow-600 bg-yellow-100',
      symptoms: ['嘔吐', '意識障害', '呼吸困難', '痙攣'],
      actions: ['中毒110番', '原因物質の確認', '嘔吐させない']
    }
  ]

  const callEmergency = (number: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${number}`
    }
  }

  const getDirections = (address: string) => {
    if (typeof window !== 'undefined') {
      const encodedAddress = encodeURIComponent(address)
      window.open(`https://maps.google.com/maps?daddr=${encodedAddress}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-6xl">
          {/* 緊急時ヘッダー */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">緊急時対応</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              緊急事態に迅速に対応するための情報とサポートを提供します
            </p>
          </div>

          {/* 緊急連絡先 */}
          <div className="mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  緊急連絡先
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emergencyContacts.map((contact) => (
                    <div
                      key={contact.name}
                      className="bg-white rounded-lg p-4 border border-red-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <Badge variant="destructive">{contact.number}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{contact.description}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => callEmergency(contact.number)}
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        発信
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 緊急事態の種類 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    緊急事態の種類
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencyTypes.map((type) => {
                      const Icon = type.icon
                      const isSelected = selectedEmergencyType === type.id
                      return (
                        <div
                          key={type.id}
                          onClick={() => setSelectedEmergencyType(
                            isSelected ? '' : type.id
                          )}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${type.color}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {type.name}
                              </h4>
                              
                              {isSelected && (
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="font-medium text-gray-700 mb-1">
                                      主な症状:
                                    </h5>
                                    <div className="flex flex-wrap gap-1">
                                      {type.symptoms.map((symptom) => (
                                        <Badge key={symptom} variant="secondary" className="text-xs">
                                          {symptom}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-medium text-gray-700 mb-2">
                                      対処法:
                                    </h5>
                                    <ul className="space-y-1">
                                      {type.actions.map((action, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                          {action}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      callEmergency('119')
                                    }}
                                  >
                                    <Phone className="w-4 h-4 mr-2" />
                                    119番通報
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 応急処置ガイド */}
              <Card>
                <CardHeader>
                  <CardTitle>応急処置ガイド</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">CPR（心肺蘇生法）</h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. 意識確認・119番通報</li>
                        <li>2. 胸骨圧迫30回（強く・速く・絶え間なく）</li>
                        <li>3. 人工呼吸2回</li>
                        <li>4. 救急隊到着まで継続</li>
                      </ol>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">止血法</h4>
                      <ol className="text-sm text-green-700 space-y-1">
                        <li>1. 清潔なガーゼで傷口を押さえる</li>
                        <li>2. 傷口を心臓より高くする</li>
                        <li>3. 圧迫点を押さえる</li>
                        <li>4. 包帯で固定する</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 近隣病院 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    近隣の医療機関
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nearbyHospitals.map((hospital, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {hospital.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {hospital.address}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Navigation className="w-4 h-4 mr-1" />
                                {hospital.distance}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                待ち時間: {hospital.waitTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Badge 
                              variant={hospital.emergencyAvailable ? "default" : "secondary"}
                            >
                              {hospital.emergencyAvailable ? '救急対応可' : '救急対応不可'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hospital.departments.map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => getDirections(hospital.address)}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            経路案内
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => callEmergency(hospital.phone)}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            連絡
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <ModernFooter />
    </div>
  )
}