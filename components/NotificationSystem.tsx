'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: number
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'info',
      title: '予約リマインダー',
      message: '明日14:00から田中先生との相談があります',
      timestamp: new Date(),
      isRead: false
    },
    {
      id: 2,
      type: 'success',
      title: 'AI診断完了',
      message: '症状分析が完了しました。結果をご確認ください',
      timestamp: new Date(Date.now() - 300000),
      isRead: false
    },
    {
      id: 3,
      type: 'warning',
      title: '健康目標',
      message: '今日の歩数目標まであと2000歩です',
      timestamp: new Date(Date.now() - 600000),
      isRead: true
    }
  ])
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8l-5 5h5m2 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">通知</h3>
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                すべて既読
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-400">
                        {notification.timestamp.toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8l-5 5h5m2 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <p>新しい通知はありません</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2">
              すべての通知を見る
            </button>
          </div>
        </div>
      )}
    </div>
  )
}