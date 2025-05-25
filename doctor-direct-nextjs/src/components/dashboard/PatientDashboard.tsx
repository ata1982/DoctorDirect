'use client'

import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendarAlt, 
  faComments, 
  faBell, 
  faChartLine,
  faStethoscope,
  faHeart,
  faRefresh,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

interface PatientDashboardProps {
  user: any
  data: any
  socket: Socket | null
  onRefresh: () => void
  onMarkNotificationRead: (id: string) => void
}

export default function PatientDashboard({ user, data, socket, onRefresh, onMarkNotificationRead }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // AI症状分析を開始
  const startSymptomAnalysis = () => {
    // AIページへリダイレクト
    window.location.href = '/ai/analyze'
  }

  // 健康インサイト生成
  const generateHealthInsights = async () => {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST'
      })
      
      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('健康インサイト生成エラー:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今後の予約</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.stats?.upcomingAppointments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FontAwesomeIcon icon={faComments} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">相談履歴</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.stats?.recentConsultations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">未読通知</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.stats?.unreadNotifications || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FontAwesomeIcon icon={faChartLine} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI分析</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.stats?.totalAnalyses || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          クイックアクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={startSymptomAnalysis}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faStethoscope} className="h-5 w-5 mr-2" />
            AI症状分析
          </button>
          
          <button
            onClick={generateHealthInsights}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FontAwesomeIcon icon={faHeart} className="h-5 w-5 mr-2" />
            健康インサイト生成
          </button>
          
          <button
            onClick={() => window.location.href = '/appointments/book'}
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 mr-2" />
            診察予約
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', label: '概要' },
              { id: 'appointments', label: '予約' },
              { id: 'consultations', label: '相談' },
              { id: 'insights', label: '健康インサイト' },
              { id: 'notifications', label: '通知' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 健康インサイト */}
              {data.healthInsights && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    最新の健康インサイト
                  </h3>
                  <p className="text-blue-800 mb-3">
                    {data.healthInsights.insights?.substring(0, 200)}...
                  </p>
                  <button
                    onClick={() => setActiveTab('insights')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    詳細を見る →
                  </button>
                </div>
              )}

              {/* 次回の予約 */}
              {data.upcomingAppointments?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    次回の予約
                  </h3>
                  <div className="space-y-3">
                    {data.upcomingAppointments.slice(0, 3).map((appointment: any) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.doctor.user?.name}医師
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleString('ja-JP')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.doctor.hospital?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            確定済み
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  予約一覧
                </h3>
                <button
                  onClick={onRefresh}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faRefresh} className="h-4 w-4 mr-2" />
                  更新
                </button>
              </div>
              
              {data.upcomingAppointments?.length > 0 ? (
                <div className="space-y-4">
                  {data.upcomingAppointments.map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {appointment.doctor.user?.name}医師
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            診療科: {appointment.doctor.specializations?.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            日時: {new Date(appointment.appointmentDate).toLocaleString('ja-JP')}
                          </p>
                          <p className="text-sm text-gray-600">
                            場所: {appointment.doctor.hospital?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'CONFIRMED' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status === 'CONFIRMED' ? '確定済み' : '保留中'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">予約がありません</p>
                  <button
                    onClick={() => window.location.href = '/appointments/book'}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    診察を予約する
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                通知一覧
              </h3>
              
              {data.notifications?.length > 0 ? (
                <div className="space-y-3">
                  {data.notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                        !notification.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          onMarkNotificationRead(notification.id)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString('ja-JP')}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="ml-4">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faBell} className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">通知がありません</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  健康インサイト
                </h3>
                <button
                  onClick={generateHealthInsights}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 mr-2" />
                  新しいインサイト生成
                </button>
              </div>

              {data.healthInsights ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-3">
                      最新の健康分析
                    </h4>
                    <div className="prose prose-sm max-w-none text-green-800">
                      <p>{data.healthInsights.insights}</p>
                    </div>
                    <div className="mt-4 text-sm text-green-600">
                      有効期限: {new Date(data.healthInsights.validUntil).toLocaleDateString('ja-JP')}
                    </div>
                  </div>

                  {data.healthInsights.recommendations && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-3">
                        推奨事項
                      </h4>
                      <div className="prose prose-sm max-w-none text-blue-800">
                        <p>{data.healthInsights.recommendations}</p>
                      </div>
                    </div>
                  )}

                  {data.healthInsights.riskFactors && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 mr-2" />
                        注意すべき要因
                      </h4>
                      <div className="prose prose-sm max-w-none text-yellow-800">
                        <p>{data.healthInsights.riskFactors}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faChartLine} className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">
                    健康インサイトがまだ生成されていません
                  </p>
                  <button
                    onClick={generateHealthInsights}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    インサイトを生成
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 最終更新時刻 */}
      <div className="text-center text-sm text-gray-500">
        最終更新: {new Date(data.lastUpdated).toLocaleString('ja-JP')}
      </div>
    </div>
  )
}