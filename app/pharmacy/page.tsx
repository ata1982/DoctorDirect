'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Pill, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  QrCode,
  Download
} from 'lucide-react'
import ModernHeader from '@/components/ModernHeader'
import ModernFooter from '@/components/ModernFooter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function PharmacyPage() {
  const { data: session } = useSession()
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [nearbyPharmacies, setNearbyPharmacies] = useState<any[]>([])

  useEffect(() => {
    fetchPrescriptions()
    fetchNearbyPharmacies()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions')
      const data = await response.json()
      if (data.success) {
        setPrescriptions(data.prescriptions)
      }
    } catch (error) {
      console.error('Prescriptions fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNearbyPharmacies = async () => {
    // 近くの薬局を取得（モックデータ）
    setNearbyPharmacies([
      {
        id: 1,
        name: 'みどり薬局',
        address: '東京都渋谷区神南1-1-1',
        phone: '03-1234-5678',
        distance: '0.3km',
        rating: 4.5,
        openHours: '9:00-20:00',
        services: ['処方箋受付', '健康相談', '配達サービス']
      },
      {
        id: 2,
        name: 'さくら調剤薬局',
        address: '東京都渋谷区渋谷2-2-2',
        phone: '03-2345-6789',
        distance: '0.5km',
        rating: 4.3,
        openHours: '8:30-19:30',
        services: ['処方箋受付', '在宅医療', '薬歴管理']
      }
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '服用中'
      case 'COMPLETED':
        return '完了'
      case 'EXPIRED':
        return '期限切れ'
      default:
        return status
    }
  }

  const formatMedications = (medications: any[]) => {
    if (!Array.isArray(medications)) return '処方薬情報なし'
    return medications.map(med => med.name).join(', ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              処方箋・薬局管理
            </h1>
            <p className="text-gray-600">
              処方箋の管理と近くの薬局を探すことができます
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 処方箋一覧 */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Pill className="w-5 h-5 mr-2 text-blue-600" />
                      処方箋一覧
                    </CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      新規追加
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : prescriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">処方箋がありません</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <div
                          key={prescription.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {formatMedications(prescription.medications)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                処方日: {new Date(prescription.prescribedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(prescription.status)}>
                              {getStatusText(prescription.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {prescription.frequency}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {prescription.duration}
                            </div>
                          </div>

                          {prescription.doctor && (
                            <div className="flex items-center mt-3 pt-3 border-t">
                              <User className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                処方医: {prescription.doctor.name}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <QrCode className="w-4 h-4 mr-2" />
                                QRコード
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                              </Button>
                            </div>
                            <Button size="sm">
                              薬局に送信
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 服薬リマインダー */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-600" />
                    服薬リマインダー
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                        <div>
                          <p className="font-medium text-orange-900">アムロジピン錠</p>
                          <p className="text-sm text-orange-700">朝食後 - 8:00 AM</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        服用完了
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-blue-900">メトホルミン錠</p>
                          <p className="text-sm text-blue-700">夕食後 - 6:00 PM</p>
                        </div>
                      </div>
                      <Badge variant="info">予定</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 近くの薬局 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    近くの薬局
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="住所または薬局名で検索..."
                      className="w-full"
                    />
                    
                    {nearbyPharmacies.map((pharmacy) => (
                      <div
                        key={pharmacy.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                          <Badge variant="success">{pharmacy.distance}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {pharmacy.address}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {pharmacy.openHours}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-gray-600 ml-1">
                              {pharmacy.rating}
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            詳細を見る
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 薬局サービス */}
              <Card>
                <CardHeader>
                  <CardTitle>薬局サービス</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <QrCode className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">電子処方箋</p>
                      <p className="text-sm text-blue-700">QRコードで簡単受付</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">配達サービス</p>
                      <p className="text-sm text-green-700">自宅まで薬をお届け</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-purple-900">薬剤師相談</p>
                      <p className="text-sm text-purple-700">お薬に関する相談</p>
                    </div>
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