'use client'

import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendarCheck, 
  faComments, 
  faUserMd, 
  faYenSign,
  faStar,
  faChartBar,
  faRefresh,
  faPhone,
  faVideo,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'

interface DoctorDashboardProps {
  user: any
  data: any
  socket: Socket | null
  onRefresh: () => void
  onMarkNotificationRead: (id: string) => void
}

export default function DoctorDashboard({ user, data, socket, onRefresh, onMarkNotificationRead }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isAvailable, setIsAvailable] = useState(data.profile?.isAvailable || false)

  // 相談リクエストを受諾
  const acceptConsultation = async (consultationId: string) => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/accept`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        onRefresh()
        // Socket.ioで相談開始通知
        socket?.emit('consultation-accepted', { consultationId })
      }
    } catch (error) {
      console.error('相談受諾エラー:', error)
    }
  }

  // 可用性状態を更新
  const toggleAvailability = async () => {
    try {
      const response = await fetch(`/api/doctors/${data.profile?.id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !isAvailable })
      })
      
      if (response.ok) {
        setIsAvailable(!isAvailable)
        onRefresh()
      }
    } catch (error) {
      console.error('可用性更新エラー:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 医師用統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今日の診察</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.stats?.todayAppointments || 0}
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
              <p className="text-sm font-medium text-gray-600">アクティブ相談</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.stats?.activeConsultations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FontAwesomeIcon icon={faStar} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均評価</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.stats?.averageRating?.toFixed(1) || '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FontAwesomeIcon icon={faYenSign} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">月間収益</p>
              <p className="text-2xl font-semibold text-gray-900">
                ¥{(data.stats?.monthlyEarnings || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 医師用クイックアクション */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            医師コントロール
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {isAvailable ? 'オンライン' : 'オフライン'}
            </span>
            <button
              onClick={toggleAvailability}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAvailable ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAvailable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('consultations')}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faComments} className="h-5 w-5 mr-2" />
            相談管理
          </button>
          
          <button
            onClick={() => setActiveTab('appointments')}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5 mr-2" />
            予約管理
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 mr-2" />
            統計分析
          </button>
          
          <button
            onClick={onRefresh}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faRefresh} className="h-5 w-5 mr-2" />
            更新
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', label: '概要' },
              { id: 'consultations', label: '相談' },
              { id: 'appointments', label: '予約' },
              { id: 'reviews', label: 'レビュー' },
              { id: 'analytics', label: '分析' }
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
                {tab.id === 'consultations' && data.stats?.activeConsultations > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {data.stats.activeConsultations}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 緊急相談リクエスト */}
              {data.activeConsultations?.filter((c: any) => c.urgency === 'HIGH').length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 mr-2" />
                    緊急相談リクエスト
                  </h3>
                  <div className="space-y-3">
                    {data.activeConsultations
                      ?.filter((c: any) => c.urgency === 'HIGH')
                      .map((consultation: any) => (
                        <div key={consultation.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-900">
                              {consultation.patient?.name}さん
                            </p>
                            <p className="text-sm text-red-700">
                              症状: {consultation.symptoms.substring(0, 50)}...
                            </p>
                          </div>
                          <button
                            onClick={() => acceptConsultation(consultation.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            受諾
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 今日の予約 */}
              {data.todayAppointments?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    今日の予約
                  </h3>
                  <div className="space-y-3">
                    {data.todayAppointments.map((appointment: any) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.patient?.name}さん
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleTimeString('ja-JP', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                            <FontAwesomeIcon icon={faVideo} className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'consultations' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                相談管理
              </h3>
              
              {data.activeConsultations?.length > 0 ? (
                <div className="space-y-4">
                  {data.activeConsultations.map((consultation: any) => (
                    <div
                      key={consultation.id}
                      className={`border rounded-lg p-4 ${
                        consultation.urgency === 'HIGH' 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-medium text-gray-900">
                              {consultation.patient?.name}さん
                            </h4>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              consultation.urgency === 'HIGH' 
                                ? 'bg-red-100 text-red-800'
                                : consultation.urgency === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {consultation.urgency === 'HIGH' ? '緊急' : 
                               consultation.urgency === 'MEDIUM' ? '中' : '低'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            症状: {consultation.symptoms}
                          </p>
                          <p className="text-xs text-gray-500">
                            作成日時: {new Date(consultation.createdAt).toLocaleString('ja-JP')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {consultation.status === 'WAITING_FOR_DOCTOR' ? (
                            <button
                              onClick={() => acceptConsultation(consultation.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              受諾
                            </button>
                          ) : (
                            <button
                              onClick={() => window.location.href = `/consultations/${consultation.id}/chat`}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              チャット開始
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faComments} className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">アクティブな相談はありません</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                予約管理
              </h3>
              
              {data.upcomingAppointments?.length > 0 ? (
                <div className="space-y-4">
                  {data.upcomingAppointments.map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {appointment.patient?.name}さん
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            日時: {new Date(appointment.appointmentDate).toLocaleString('ja-JP')}
                          </p>
                          <p className="text-sm text-gray-600">
                            種類: {appointment.type || '一般診察'}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 mt-2">
                              備考: {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'CONFIRMED' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status === 'CONFIRMED' ? '確定済み' : '保留中'}
                          </span>
                          <div className="mt-2 space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              編集
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              キャンセル
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faCalendarCheck} className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">予定されている予約はありません</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                患者レビュー
              </h3>
              
              {data.recentReviews?.length > 0 ? (
                <div className="space-y-4">
                  {data.recentReviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.patient?.name}さん
                          </h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FontAwesomeIcon
                                key={i}
                                icon={faStar}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faStar} className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">レビューがありません</p>
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