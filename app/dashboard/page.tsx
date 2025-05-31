'use client'

import React, { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { 
  Calendar, 
  Users, 
  Activity, 
  Bell, 
  Heart, 
  Thermometer, 
  Zap, 
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// 型定義を追加
interface HealthData {
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenSaturation: number
  }
  steps: number
  calories: number
  sleep: number
}

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed'
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: string
  read: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [_healthData, setHealthData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [vitalSigns, setVitalSigns] = useState<Record<string, unknown>>({})
  const [healthMetrics, setHealthMetrics] = useState<Record<string, unknown>>({})
  const [activityData, setActivityData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const session = await getSession()
      if (session?.user) {
        setUser(session.user as { name: string; email: string })
      }

      // 予約情報を取得
      const appointmentsRes = await fetch('/api/appointments')
      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json()
        setAppointments(data.appointments || [])
      }

      // 通知を取得
      setNotifications([
        {
          id: '1',
          title: '予約確認',
          message: '明日の診察予約が確認されました',
          type: 'success',
          timestamp: '2024-01-15T10:00:00Z',
          read: false
        },
        {
          id: '2',
          title: 'ヘルスアラート',
          message: '心拍数が高値を示しています',
          type: 'warning',
          timestamp: '2024-01-15T09:30:00Z',
          read: false
        }
      ])

      // ヘルスデータを取得
      setHealthData({
        vitals: {
          heartRate: 72,
          bloodPressure: '120/80',
          temperature: 36.5,
          oxygenSaturation: 98
        },
        steps: 8500,
        calories: 2100,
        sleep: 7.5
      })

      setVitalSigns({
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 36.5,
        oxygenSaturation: 98
      })

      setHealthMetrics({
        steps: 8500,
        calories: 2100,
        sleep: 7.5,
        weight: 70
      })

      setActivityData({
        todaySteps: 8500,
        weeklyAverage: 7800,
        monthlyGoal: 250000,
        currentMonth: 180000
      })

    } catch (error) {
      console.error('ダッシュボードデータの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const healthTrends = [
    { name: '心拍数', value: 72, unit: 'bpm', trend: '+2%', color: 'text-green-600' },
    { name: '血圧', value: '120/80', unit: 'mmHg', trend: '安定', color: 'text-blue-600' },
    { name: '体重', value: 70, unit: 'kg', trend: '-0.5kg', color: 'text-green-600' },
    { name: '睡眠', value: 7.5, unit: '時間', trend: '+0.5h', color: 'text-blue-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ダッシュボードを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            おかえりなさい、{user?.name}さん
          </h1>
          <p className="text-gray-600">今日の健康状態を確認しましょう</p>
        </div>

        {/* クイックアクション */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button className="h-16 bg-blue-600 hover:bg-blue-700">
            <Calendar className="mr-2 h-5 w-5" />
            予約を取る
          </Button>
          <Button variant="outline" className="h-16">
            <Users className="mr-2 h-5 w-5" />
            医師を探す
          </Button>
          <Button variant="outline" className="h-16">
            <Activity className="mr-2 h-5 w-5" />
            健康記録
          </Button>
          <Button variant="outline" className="h-16">
            <Bell className="mr-2 h-5 w-5" />
            緊急相談
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="health">健康データ</TabsTrigger>
            <TabsTrigger value="appointments">予約</TabsTrigger>
            <TabsTrigger value="reports">レポート</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* バイタルサイン */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">心拍数</CardTitle>
                  <Heart className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72 bpm</div>
                  <p className="text-xs text-muted-foreground">正常範囲</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">血圧</CardTitle>
                  <Activity className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">120/80</div>
                  <p className="text-xs text-muted-foreground">理想的</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">体温</CardTitle>
                  <Thermometer className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36.5°C</div>
                  <p className="text-xs text-muted-foreground">正常</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">歩数</CardTitle>
                  <Zap className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,500</div>
                  <p className="text-xs text-muted-foreground">目標まで1,500歩</p>
                </CardContent>
              </Card>
            </div>

            {/* 健康トレンド */}
            <Card>
              <CardHeader>
                <CardTitle>健康トレンド</CardTitle>
                <CardDescription>過去7日間の健康指標の変化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {healthTrends.map((trend, _index) => (
                    <div key={trend.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.name}</span>
                        <Badge variant="secondary" className={trend.color}>
                          {trend.trend}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">
                        {trend.value} {trend.unit}
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 今日の予定 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>今日の予定</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-4 mb-4 last:mb-0">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {appointment.status === 'confirmed' ? '確定' : '保留中'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>通知</CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.slice(0, 4).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 mb-4 last:mb-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'warning' ? 'bg-yellow-500' : 
                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 他のタブコンテンツ */}
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>詳細な健康データ</CardTitle>
              </CardHeader>
              <CardContent>
                <p>ここに詳細な健康データが表示されます。</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>予約管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p>ここに予約の詳細が表示されます。</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>健康レポート</CardTitle>
              </CardHeader>
              <CardContent>
                <p>ここに健康レポートが表示されます。</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}