'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Pharmacy {
  id: number
  name: string
  address: string
  phone: string
  distance: string
  openHours: string
  services: string[]
  rating: number
  isOpen: boolean
  image: string
}

interface Prescription {
  id: number
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  doctorName: string
  issueDate: string
  status: 'pending' | 'sent' | 'ready' | 'completed'
}

interface MedicationReminder {
  id: number
  medicineName: string
  time: string
  dosage: string
  taken: boolean
  frequency: string
}

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'prescriptions' | 'reminders' | 'history'>('search')

  const pharmacies: Pharmacy[] = [
    {
      id: 1,
      name: "ドラッグストア マツモトキヨシ 渋谷店",
      address: "東京都渋谷区渋谷1-1-1",
      phone: "03-1234-5678",
      distance: "0.5km",
      openHours: "9:00-22:00",
      services: ["処方箋受付", "24時間受付", "在宅配送", "薬歴管理"],
      rating: 4.5,
      isOpen: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "すずらん薬局 新宿店",
      address: "東京都新宿区新宿3-2-1",
      phone: "03-2345-6789",
      distance: "1.2km",
      openHours: "8:00-20:00",
      services: ["処方箋受付", "健康相談", "在宅配送"],
      rating: 4.8,
      isOpen: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "ファミリー薬局 池袋店",
      address: "東京都豊島区池袋2-3-4",
      phone: "03-3456-7890",
      distance: "2.1km",
      openHours: "10:00-19:00",
      services: ["処方箋受付", "薬歴管理", "健康相談"],
      rating: 4.2,
      isOpen: false,
      image: "/api/placeholder/300/200"
    }
  ]

  const prescriptions: Prescription[] = [
    {
      id: 1,
      medicineName: "ロキソニン錠60mg",
      dosage: "1錠",
      frequency: "1日3回",
      duration: "7日分",
      doctorName: "田中医師",
      issueDate: "2024-05-28",
      status: "pending"
    },
    {
      id: 2,
      medicineName: "カロナール錠300",
      dosage: "1錠",
      frequency: "1日2回",
      duration: "5日分",
      doctorName: "佐藤医師",
      issueDate: "2024-05-25",
      status: "ready"
    }
  ]

  const medicationReminders: MedicationReminder[] = [
    {
      id: 1,
      medicineName: "ロキソニン錠",
      time: "08:00",
      dosage: "1錠",
      taken: true,
      frequency: "朝"
    },
    {
      id: 2,
      medicineName: "ロキソニン錠",
      time: "12:00",
      dosage: "1錠",
      taken: false,
      frequency: "昼"
    },
    {
      id: 3,
      medicineName: "ロキソニン錠",
      time: "18:00",
      dosage: "1錠",
      taken: false,
      frequency: "夜"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '送信待ち'
      case 'sent': return '送信済み'
      case 'ready': return '受取可能'
      case 'completed': return '完了'
      default: return 'unknown'
    }
  }

  const sendPrescription = (_prescriptionId: number, _pharmacyId: number) => {
    alert('処方箋をデジタル送信しました。薬局からの連絡をお待ちください。')
  }

  const handlePharmacyDetails = (pharmacy: Pharmacy) => {
    alert(`${pharmacy.name}の詳細情報を表示します。`)
  }

  const handleAddPrescription = () => {
    alert('新しい処方箋の追加フォームを表示します。')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              💊 薬局連携サービス
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              処方箋の送信から服薬管理まで、すべてデジタルで完結
            </p>
          </div>

          {/* タブナビゲーション */}
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                🔍 薬局検索
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'prescriptions'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                📋 処方箋管理
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'reminders'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                ⏰ 服薬管理
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                📚 薬歴管理
              </button>
            </div>
          </div>

          {/* 薬局検索タブ */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">近くの薬局を検索</h2>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="薬局名または住所で検索"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    検索
                  </button>
                </div>

                <div className="grid gap-6">
                  {pharmacies.map(pharmacy => (
                    <div key={pharmacy.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pharmacy.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pharmacy.isOpen 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {pharmacy.isOpen ? '営業中' : '営業時間外'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">{pharmacy.address}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>📞 {pharmacy.phone}</span>
                            <span>📍 {pharmacy.distance}</span>
                            <span>🕒 {pharmacy.openHours}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-medium text-gray-900 dark:text-white">{pharmacy.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {pharmacy.services.map((service, index) => (
                          <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                            {service}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => handlePharmacyDetails(pharmacy)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          詳細を見る
                        </button>
                        <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          お気に入り
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 処方箋管理タブ */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">処方箋管理</h2>
                  <button 
                    onClick={handleAddPrescription}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ➕ 新しい処方箋
                  </button>
                </div>

                <div className="space-y-4">
                  {prescriptions.map(prescription => (
                    <div key={prescription.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{prescription.medicineName}</h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div>
                              <span className="font-medium">用量:</span> {prescription.dosage}
                            </div>
                            <div>
                              <span className="font-medium">服用頻度:</span> {prescription.frequency}
                            </div>
                            <div>
                              <span className="font-medium">日数:</span> {prescription.duration}
                            </div>
                            <div>
                              <span className="font-medium">担当医:</span> {prescription.doctorName}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                            {getStatusText(prescription.status)}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            発行日: {prescription.issueDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {prescription.status === 'pending' && (
                          <select 
                            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            onChange={(e) => {
                              if (e.target.value) {
                                sendPrescription(prescription.id, parseInt(e.target.value))
                              }
                            }}
                          >
                            <option value="">送信先薬局を選択</option>
                            {pharmacies.map(pharmacy => (
                              <option key={pharmacy.id} value={pharmacy.id}>{pharmacy.name}</option>
                            ))}
                          </select>
                        )}
                        {prescription.status === 'ready' && (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            受取予約
                          </button>
                        )}
                        <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          詳細
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 服薬管理タブ */}
          {activeTab === 'reminders' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">今日の服薬スケジュール</h2>
                
                <div className="space-y-4">
                  {medicationReminders.map(reminder => (
                    <div key={reminder.id} className={`border rounded-lg p-4 ${
                      reminder.taken 
                        ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            reminder.taken 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}></div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{reminder.medicineName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {reminder.time} ({reminder.frequency}) - {reminder.dosage}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!reminder.taken && (
                            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                              服用済み
                            </button>
                          )}
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            ⏰ 時間変更
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">服薬アドバイス</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• 薬は決められた時間に服用しましょう</li>
                    <li>• 飲み忘れた場合は次回分と一緒に飲まず、医師に相談してください</li>
                    <li>• 副作用を感じた場合は速やかに医師または薬剤師に相談してください</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 薬歴管理タブ */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">服薬履歴</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">今月の服薬率</h3>
                    <div className="text-3xl font-bold">87%</div>
                    <p className="text-blue-100">前月より +5%</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">連続服薬日数</h3>
                    <div className="text-3xl font-bold">12日</div>
                    <p className="text-green-100">継続中</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">最近の処方薬</h3>
                  {prescriptions.map(prescription => (
                    <div key={prescription.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{prescription.medicineName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {prescription.frequency} | {prescription.duration} | {prescription.doctorName}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {prescription.issueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}