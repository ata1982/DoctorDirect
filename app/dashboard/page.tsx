'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Heart, 
  Activity, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Bell,
  Settings,
  FileText,
  Shield,
  Pill
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { healthData, notifications } = useAppStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [healthRecords, setHealthRecords] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      // 健康記録の取得
      const healthResponse = await fetch('/api/health-records')
      const healthData = await healthResponse.json()
      setHealthRecords(healthData.records || [])

      // 予約の取得
      const appointmentsResponse = await fetch('/api/appointments')
      const appointmentsData = await appointmentsResponse.json()
      setAppointments(appointmentsData.appointments || [])

      // 処方箋の取得
      const prescriptionsResponse = await fetch('/api/prescriptions')
      const prescriptionsData = await prescriptionsResponse.json()
      setPrescriptions(prescriptionsData.prescriptions || [])
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
    }
  }

  const stats = [
    {
      title: '今月の相談',
      value: '3',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: '次回予約',
      value: '2日後',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: '健康スコア',
      value: '85',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: '服薬記録',
      value: '98%',
      icon: Pill,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'consultation',
      title: '田中先生との相談',
      description: 'ビデオ通話による健康相談',
      timestamp: '2時間前',
      status: 'completed'
    },
    {
      id: 2,
      type: 'symptom',
      title: '症状記録',
      description: '軽度の頭痛を記録',
      timestamp: '1日前',
      status: 'recorded'
    },
    {
      id: 3,
      type: 'medication',
      title: '薬の服用',
      description: '血圧薬を服用',
      timestamp: '1日前',
      status: 'taken'
    }
  ]

  const upcomingReminders = [
    {
      id: 1,
      type: 'appointment',
      title: '定期検診',
      time: '明日 14:00',
      doctor: '山田先生'
    },
    {
      id: 2,
      type: 'medication',
      title: '血圧薬の服用',
      time: '今日 20:00',
      doctor: null
    }
  ]

  const tabs = [
    { id: 'overview', label: '概要', icon: Activity },
    { id: 'health', label: '健康記録', icon: Heart },
    { id: 'appointments', label: '予約', icon: Calendar },
    { id: 'prescriptions', label: '処方箋', icon: Pill },
    { id: 'settings', label: '設定', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl">
          {/* ヘッダー */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  こんにちは、{session?.user?.name}さん
                </h1>
                <p className="text-gray-600 mt-2">
                  今日も健康管理をしっかりと行いましょう
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  通知 {notifications.length > 0 && `(${notifications.length})`}
                </Button>
                <Button variant="medical" size="sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  緊急相談
                </Button>
              </div>
            </motion.div>
          </div>

          {/* タブナビゲーション */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* 概要タブ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 統計カード */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                              <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 最近のアクティビティ */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        最近のアクティビティ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              {activity.type === 'consultation' && <Users className="w-5 h-5 text-blue-600" />}
                              {activity.type === 'symptom' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                              {activity.type === 'medication' && <Pill className="w-5 h-5 text-green-600" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {activity.timestamp}
                              </p>
                            </div>
                            <Badge variant={activity.status === 'completed' ? 'success' : 'info'}>
                              {activity.status === 'completed' ? '完了' : '記録済み'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 今後のリマインダー */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        今後の予定
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingReminders.map((reminder) => (
                          <div key={reminder.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {reminder.title}
                              </h4>
                              <Badge variant="info">
                                {reminder.type === 'appointment' ? '予約' : '服薬'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {reminder.time}
                            </p>
                            {reminder.doctor && (
                              <p className="text-xs text-gray-500 mt-1">
                                担当: {reminder.doctor}
                              </p>
                            )}
                          </div>
                        ))}
                        <Button className="w-full" variant="outline" size="sm">
                          すべて表示
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* 健康記録タブ */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>健康記録の追加</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Heart className="w-6 h-6 mb-2" />
                      血圧測定
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Activity className="w-6 h-6 mb-2" />
                      体重記録
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <TrendingUp className="w-6 h-6 mb-2" />
                      血糖値
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>健康記録一覧</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthRecords.map((record) => (
                      <div key={record.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {record.title}
                          </h4>
                          <Badge variant="success">
                            {record.status === 'completed' ? '完了' : '未完了'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {record.doctor} • {record.date}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: '#e0f7fa', color: '#00796b' }}>
                            {record.type}
                          </span>
                          <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: '#f3e5f5', color: '#6a1b9a' }}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 予約タブ */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>予約管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {appointment.doctor}
                          </h4>
                          <Badge variant="info">
                            {appointment.status === 'confirmed' ? '確定' : '保留'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {appointment.specialty} • {appointment.date} {appointment.time}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                            {appointment.type}
                          </span>
                          <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: '#f3e5f5', color: '#6a1b9a' }}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 処方箋タブ */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>処方箋管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {prescription.medication}
                          </h4>
                          <Badge variant="success">
                            {prescription.status === 'active' ? '有効' : '無効'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {prescription.doctor} • {prescription.date}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                            {prescription.type}
                          </span>
                          <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: '#f3e5f5', color: '#6a1b9a' }}>
                            {prescription.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 設定タブ */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>プロフィール設定</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}