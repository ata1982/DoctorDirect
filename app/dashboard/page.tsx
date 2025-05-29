'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface HealthRecord {
  id: number
  date: string
  type: 'consultation' | 'diagnosis' | 'prescription' | 'test'
  title: string
  doctor: string
  status: 'completed' | 'pending' | 'scheduled'
}

interface Appointment {
  id: number
  date: string
  time: string
  doctor: string
  specialty: string
  type: 'video' | 'chat' | 'clinic'
  status: 'confirmed' | 'pending' | 'cancelled'
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const healthRecords: HealthRecord[] = [
    {
      id: 1,
      date: '2024-05-25',
      type: 'consultation',
      title: '頭痛の相談',
      doctor: '田中 健一',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-05-20',
      type: 'diagnosis',
      title: 'AI症状診断 - 感冒症候群',
      doctor: 'AI診断システム',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-05-15',
      type: 'prescription',
      title: '処方薬 - 頭痛薬',
      doctor: '佐藤 美咲',
      status: 'completed'
    }
  ]

  const upcomingAppointments: Appointment[] = [
    {
      id: 1,
      date: '2024-05-30',
      time: '14:00',
      doctor: '山田 修',
      specialty: '循環器科',
      type: 'video',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-06-02',
      time: '10:30',
      doctor: '田中 健一',
      specialty: '内科',
      type: 'chat',
      status: 'pending'
    }
  ]

  const healthMetrics = {
    totalConsultations: 12,
    completedDiagnoses: 8,
    activePrescriptions: 2,
    healthScore: 85
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">マイダッシュボード</h1>
            <p className="text-gray-600">健康記録と予約の管理</p>
          </div>

          {/* 概要カード */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{healthMetrics.totalConsultations}</div>
                  <div className="text-sm text-gray-600">総相談回数</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{healthMetrics.completedDiagnoses}</div>
                  <div className="text-sm text-gray-600">完了診断</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{healthMetrics.activePrescriptions}</div>
                  <div className="text-sm text-gray-600">処方薬</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{healthMetrics.healthScore}</div>
                  <div className="text-sm text-gray-600">健康スコア</div>
                </div>
              </div>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: '概要', icon: '📊' },
                  { id: 'appointments', label: '予約', icon: '📅' },
                  { id: 'records', label: '健康記録', icon: '📋' },
                  { id: 'profile', label: 'プロフィール', icon: '👤' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">最近の活動</h3>
                    <div className="space-y-3">
                      {healthRecords.slice(0, 3).map(record => (
                        <div key={record.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            record.type === 'consultation' ? 'bg-blue-500' :
                            record.type === 'diagnosis' ? 'bg-green-500' :
                            record.type === 'prescription' ? 'bg-purple-500' : 'bg-orange-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="font-medium">{record.title}</div>
                            <div className="text-sm text-gray-600">{record.doctor} • {record.date}</div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'completed' ? 'bg-green-100 text-green-800' :
                            record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.status === 'completed' ? '完了' :
                             record.status === 'pending' ? '待機中' : '予定'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">今後の予約</h3>
                    <div className="space-y-3">
                      {upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div>
                            <div className="font-medium">{appointment.doctor}</div>
                            <div className="text-sm text-gray-600">{appointment.specialty}</div>
                            <div className="text-sm text-blue-600">{appointment.date} {appointment.time}</div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs mb-2 ${
                              appointment.type === 'video' ? 'bg-green-100 text-green-800' :
                              appointment.type === 'chat' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {appointment.type === 'video' ? 'ビデオ' :
                               appointment.type === 'chat' ? 'チャット' : '来院'}
                            </span>
                            <div>
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                詳細
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">予約管理</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      新しい予約
                    </button>
                  </div>
                  <div className="space-y-4">
                    {upcomingAppointments.map(appointment => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{appointment.doctor}</h4>
                            <p className="text-gray-600">{appointment.specialty}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {appointment.date} {appointment.time}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                              変更
                            </button>
                            <button className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">
                              キャンセル
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'records' && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">健康記録</h3>
                  <div className="space-y-4">
                    {healthRecords.map(record => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{record.title}</h4>
                            <p className="text-gray-600">{record.doctor}</p>
                            <p className="text-sm text-gray-500 mt-1">{record.date}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            詳細を見る
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">プロフィール設定</h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">氏名</label>
                        <input 
                          type="text" 
                          defaultValue="山田 太郎"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                        <input 
                          type="email" 
                          defaultValue="yamada@example.com"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                        <input 
                          type="tel" 
                          defaultValue="090-1234-5678"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
                        <input 
                          type="date" 
                          defaultValue="1990-01-01"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">アレルギー・既往歴</label>
                      <textarea 
                        rows={4}
                        defaultValue="特になし"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}