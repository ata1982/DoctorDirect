'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Watch, 
  Heart, 
  Activity, 
  Footprints,
  Moon,
  Zap,
  TrendingUp,
  Settings,
  Smartphone,
  Bluetooth,
  Wifi,
  Battery,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function WearablePage() {
  const { data: session } = useSession()
  const [devices, setDevices] = useState<any[]>([])
  const [healthData, setHealthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchDevices()
    fetchHealthData()
  }, [])

  const fetchDevices = async () => {
    // モックデータ - 実際のAPIでは /api/wearable から取得
    setDevices([
      {
        id: 1,
        name: 'Apple Watch Series 9',
        type: 'smartwatch',
        brand: 'Apple',
        connected: true,
        battery: 85,
        lastSync: new Date().toISOString(),
        capabilities: ['heart_rate', 'steps', 'sleep', 'workout']
      },
      {
        id: 2,
        name: 'Fitbit Charge 5',
        type: 'fitness_tracker',
        brand: 'Fitbit',
        connected: false,
        battery: 45,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        capabilities: ['heart_rate', 'steps', 'sleep']
      }
    ])
  }

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/wearable')
      const data = await response.json()
      if (data.success) {
        setHealthData(data.data)
      }
    } catch (error) {
      console.error('Health data fetch error:', error)
      // フォールバック用モックデータ
      setHealthData({
        heartRate: {
          current: 72,
          average: 68,
          max: 145,
          min: 52,
          trend: 'stable'
        },
        steps: {
          today: 8543,
          goal: 10000,
          weekly: [6234, 8921, 7654, 9876, 8543, 7234, 9123]
        },
        sleep: {
          lastNight: 7.2,
          average: 7.5,
          quality: 'good',
          deepSleep: 1.8
        },
        calories: {
          burned: 2340,
          goal: 2500,
          active: 420
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const syncDevice = async (deviceId: number) => {
    setSyncing(true)
    try {
      // デバイス同期のAPI呼び出し
      await new Promise(resolve => setTimeout(resolve, 2000)) // モック遅延
      await fetchHealthData()
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setSyncing(false)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch':
        return Watch
      case 'fitness_tracker':
        return Activity
      case 'smartphone':
        return Smartphone
      default:
        return Watch
    }
  }

  const getConnectionStatus = (connected: boolean) => {
    return connected 
      ? { color: 'bg-green-100 text-green-800', text: '接続中' }
      : { color: 'bg-red-100 text-red-800', text: '未接続' }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600'
    if (level > 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ウェアラブル連携
            </h1>
            <p className="text-gray-600">
              スマートウォッチやフィットネストラッカーと連携して健康データを管理
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* デバイス管理 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Watch className="w-5 h-5 mr-2 text-blue-600" />
                      接続デバイス
                    </CardTitle>
                    <Button size="sm" onClick={() => syncDevice(1)} disabled={syncing}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                      同期
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {devices.map((device) => {
                    const Icon = getDeviceIcon(device.type)
                    const status = getConnectionStatus(device.connected)
                    return (
                      <motion.div
                        key={device.id}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{device.name}</h3>
                              <p className="text-sm text-gray-600">{device.brand}</p>
                            </div>
                          </div>
                          <Badge className={status.color}>
                            {status.text}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Battery className={`w-4 h-4 mr-2 ${getBatteryColor(device.battery)}`} />
                            {device.battery}%
                          </div>
                          <div className="flex items-center text-gray-600">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {new Date(device.lastSync).toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="flex space-x-1">
                            {device.capabilities.map((cap: string) => (
                              <Badge key={cap} variant="outline" className="text-xs">
                                {cap === 'heart_rate' ? '心拍' : 
                                 cap === 'steps' ? '歩数' :
                                 cap === 'sleep' ? '睡眠' :
                                 cap === 'workout' ? '運動' : cap}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}

                  <Button variant="outline" className="w-full">
                    <Bluetooth className="w-4 h-4 mr-2" />
                    新しいデバイスを追加
                  </Button>
                </CardContent>
              </Card>

              {/* 連携状況 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-green-600" />
                    連携状況
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-green-600 mr-3" />
                      <span className="font-medium text-green-900">心拍数</span>
                    </div>
                    <Badge variant="success">同期済み</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Footprints className="w-5 h-5 text-green-600 mr-3" />
                      <span className="font-medium text-green-900">歩数</span>
                    </div>
                    <Badge variant="success">同期済み</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <Moon className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="font-medium text-yellow-900">睡眠</span>
                    </div>
                    <Badge variant="warning">待機中</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 健康データダッシュボード */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">データを読み込み中...</span>
                </div>
              ) : (
                <>
                  {/* 健康指標サマリー */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Heart className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">心拍数</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {healthData?.heartRate?.current || 0} BPM
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Footprints className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">歩数</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {healthData?.steps?.today?.toLocaleString() || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Moon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">睡眠時間</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {healthData?.sleep?.lastNight || 0}h
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Zap className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">消費カロリー</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {healthData?.calories?.burned || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 詳細データ */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 心拍数トレンド */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-red-600" />
                          心拍数トレンド
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">現在</span>
                            <span className="font-semibold">{healthData?.heartRate?.current} BPM</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">平均</span>
                            <span className="font-semibold">{healthData?.heartRate?.average} BPM</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">最高</span>
                            <span className="font-semibold text-red-600">{healthData?.heartRate?.max} BPM</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">最低</span>
                            <span className="font-semibold text-blue-600">{healthData?.heartRate?.min} BPM</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 歩数進捗 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Footprints className="w-5 h-5 mr-2 text-blue-600" />
                          歩数目標
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">今日の歩数</span>
                            <span className="font-semibold">{healthData?.steps?.today?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">目標</span>
                            <span className="font-semibold">{healthData?.steps?.goal?.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min((healthData?.steps?.today / healthData?.steps?.goal) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                          <div className="text-center">
                            <span className="text-sm text-gray-600">
                              達成率: {Math.round((healthData?.steps?.today / healthData?.steps?.goal) * 100)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* アラート・通知 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                        健康アラート
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                          <div>
                            <p className="font-medium text-yellow-900">運動不足の警告</p>
                            <p className="text-sm text-yellow-700">今日の歩数が目標を下回っています</p>
                          </div>
                        </div>

                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Heart className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-blue-900">心拍数が安定しています</p>
                            <p className="text-sm text-blue-700">今週の心拍数は正常範囲内です</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}