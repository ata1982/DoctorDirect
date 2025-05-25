'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import PatientDashboard from './PatientDashboard'
import DoctorDashboard from './DoctorDashboard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface DashboardContentProps {
  user: any
  data: any
}

export default function DashboardContent({ user, data }: DashboardContentProps) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [realTimeData, setRealTimeData] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  // Socket.io接続とリアルタイム更新
  useEffect(() => {
    if (!session?.user) return

    // Socket.io接続
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      auth: {
        token: session.user.id
      }
    })

    newSocket.on('connect', () => {
      console.log('ダッシュボード: Socket.io接続完了')
      // ユーザールームに参加
      newSocket.emit('join-user-room', session.user.id)
    })

    // リアルタイム通知受信
    newSocket.on('new-notification', (notification) => {
      setRealTimeData((prev: any) => ({
        ...prev,
        notifications: [notification, ...(prev.notifications || [])],
        stats: {
          ...prev.stats,
          unreadNotifications: (prev.stats?.unreadNotifications || 0) + 1
        }
      }))
      
      // ブラウザ通知表示
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/favicon.ico'
        })
      }
    })

    // 新しい相談リクエスト（医師用）
    newSocket.on('new-consultation-request', (consultationData) => {
      if (user.role === 'DOCTOR') {
        setRealTimeData((prev: any) => ({
          ...prev,
          activeConsultations: [...(prev.activeConsultations || []), consultationData.consultation],
          stats: {
            ...prev.stats,
            activeConsultations: (prev.stats?.activeConsultations || 0) + 1
          }
        }))
      }
    })

    // 予約更新通知
    newSocket.on('appointment-updated', (appointmentData) => {
      refreshDashboardData()
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [session?.user.id, user.role])

  // ブラウザ通知許可要求
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // ダッシュボードデータの更新
  const refreshDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const updatedData = await response.json()
        setRealTimeData(updatedData.data)
      }
    } catch (error) {
      console.error('ダッシュボードデータ更新エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 通知を既読にする
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })

      setRealTimeData((prev: any) => ({
        ...prev,
        notifications: prev.notifications?.map((n: any) => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        stats: {
          ...prev.stats,
          unreadNotifications: Math.max(0, (prev.stats?.unreadNotifications || 0) - 1)
        }
      }))
    } catch (error) {
      console.error('通知既読エラー:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // ユーザーの役割に応じてダッシュボードを表示
  if (user.role === 'DOCTOR') {
    return (
      <DoctorDashboard
        user={user}
        data={realTimeData}
        socket={socket}
        onRefresh={refreshDashboardData}
        onMarkNotificationRead={markNotificationAsRead}
      />
    )
  } else {
    return (
      <PatientDashboard
        user={user}
        data={realTimeData}
        socket={socket}
        onRefresh={refreshDashboardData}
        onMarkNotificationRead={markNotificationAsRead}
      />
    )
  }
}