'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface WearableDevice {
  id: string
  name: string
  type: 'watch' | 'fitness' | 'monitor'
  brand: string
  isConnected: boolean
  lastSync: string
  battery?: number
  icon: string
}

interface HealthData {
  date: string
  steps: number
  heartRate: { avg: number; max: number; min: number }
  sleep: { duration: number; quality: 'good' | 'fair' | 'poor' }
  calories: number
  distance: number
}

export default function WearableIntegrationPage() {
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([
    {
      id: '1',
      name: 'Apple Watch Series 9',
      type: 'watch',
      brand: 'Apple',
      isConnected: true,
      lastSync: '2025-05-30T10:30:00',
      battery: 85,
      icon: '⌚'
    }
  ])

  const [availableDevices] = useState<WearableDevice[]>([
    {
      id: '2',
      name: 'Fitbit Charge 5',
      type: 'fitness',
      brand: 'Fitbit',
      isConnected: false,
      lastSync: '',
      icon: '📱'
    },
    {
      id: '3',
      name: 'Garmin Venu 3',
      type: 'watch',
      brand: 'Garmin',
      isConnected: false,
      lastSync: '',
      icon: '⌚'
    },
    {
      id: '4',
      name: 'Oura Ring Gen3',
      type: 'monitor',
      brand: 'Oura',
      isConnected: false,
      lastSync: '',
      icon: '💍'
    }
  ])

  const [healthData] = useState<HealthData[]>([
    {
      date: '2025-05-30',
      steps: 8542,
      heartRate: { avg: 72, max: 145, min: 58 },
      sleep: { duration: 7.5, quality: 'good' },
      calories: 2150,
      distance: 6.8
    },
    {
      date: '2025-05-29',
      steps: 12034,
      heartRate: { avg: 75, max: 152, min: 62 },
      sleep: { duration: 6.8, quality: 'fair' },
      calories: 2340,
      distance: 9.2
    }
  ])

  const connectDevice = (deviceId: string) => {
    const device = availableDevices.find(d => d.id === deviceId)
    if (device) {
      const connectedDevice: WearableDevice = {
        ...device,
        isConnected: true,
        lastSync: new Date().toISOString()
      }
      setConnectedDevices(prev => [...prev, connectedDevice])
    }
  }

  const disconnectDevice = (deviceId: string) => {
    setConnectedDevices(prev => prev.filter(d => d.id !== deviceId))
  }

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 60) return `${diffMinutes}分前`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}時間前`
    return `${Math.floor(diffMinutes / 1440)}日前`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">📱 ウェアラブル連携</h1>
            <p className="text-lg text-gray-600">
              健康データを自動同期して、より詳細な健康管理を実現
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 接続済みデバイス */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">🔗 接続済みデバイス</h2>
                
                {connectedDevices.length > 0 ? (
                  <div className="space-y-4">
                    {connectedDevices.map(device => (
                      <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{device.icon}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{device.name}</h3>
                              <p className="text-sm text-gray-600">{device.brand}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-green-600">接続済み</span>
                            </div>
                            {device.battery && (
                              <span className="text-sm text-gray-600">🔋 {device.battery}%</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            最終同期: {formatLastSync(device.lastSync)}
                          </span>
                          <div className="flex space-x-2">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                              同期
                            </button>
                            <button 
                              onClick={() => disconnectDevice(device.id)}
                              className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50"
                            >
                              切断
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-4 block">📱</span>
                    <p>接続されているデバイスがありません</p>
                  </div>
                )}
              </div>

              {/* 健康データダッシュボード */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">📊 今日の健康データ</h2>
                
                {healthData.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-blue-900">歩数</h3>
                        <span className="text-2xl">🚶</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{healthData[0].steps.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">歩</p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-red-900">心拍数</h3>
                        <span className="text-2xl">❤️</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">{healthData[0].heartRate.avg}</p>
                      <p className="text-sm text-red-600">bpm (平均)</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-purple-900">睡眠</h3>
                        <span className="text-2xl">😴</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{healthData[0].sleep.duration}</p>
                      <p className="text-sm text-purple-600">時間</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-green-900">消費カロリー</h3>
                        <span className="text-2xl">🔥</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{healthData[0].calories}</p>
                      <p className="text-sm text-green-600">kcal</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* 利用可能なデバイス */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">➕ デバイスを追加</h2>
                
                <div className="space-y-3">
                  {availableDevices.map(device => (
                    <div key={device.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{device.icon}</span>
                          <div>
                            <h4 className="font-medium text-sm">{device.name}</h4>
                            <p className="text-xs text-gray-600">{device.brand}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => connectDevice(device.id)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          接続
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 健康アラート */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">⚠️ 健康アラート</h2>
                
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-800 text-sm">💧 水分補給</h4>
                    <p className="text-xs text-yellow-700">今日の水分摂取が不足しています</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 text-sm">🎯 目標達成</h4>
                    <p className="text-xs text-green-700">歩数目標を達成しました！</p>
                  </div>
                </div>
              </div>

              {/* データエクスポート */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📤 データエクスポート</h2>
                
                <div className="space-y-3">
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200">
                    📊 CSV形式でダウンロード
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200">
                    📋 医師と共有
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}