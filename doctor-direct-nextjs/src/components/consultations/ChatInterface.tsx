'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPaperPlane, 
  faPhone, 
  faVideo,
  faFileUpload,
  faSmile,
  faInfoCircle,
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faRobot
} from '@fortawesome/free-solid-svg-icons'
import { aiService } from '@/lib/ai-service'

interface ChatInterfaceProps {
  consultation: any
  currentUser: any
}

interface Message {
  id: string
  content: string
  senderId: string
  sender: any
  timestamp: Date
  type: 'text' | 'file' | 'ai_analysis' | 'system'
  attachments?: any[]
  isRead: boolean
}

export default function ChatInterface({ consultation, currentUser }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>(consultation.chatMessages || [])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showConsultationInfo, setShowConsultationInfo] = useState(false)
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isDoctor = currentUser.role === 'DOCTOR'
  const otherUser = isDoctor ? consultation.patient : consultation.doctor?.user

  // Socket.io接続
  useEffect(() => {
    if (!session?.user) return

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      auth: {
        token: session.user.id,
        consultationId: consultation.id
      }
    })

    newSocket.on('connect', () => {
      console.log('チャット: Socket.io接続完了')
      setIsConnected(true)
      newSocket.emit('join-consultation', consultation.id)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    // 新しいメッセージ受信
    newSocket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message])
      scrollToBottom()
    })

    // タイピング状態受信
    newSocket.on('user-typing', (data: { userId: string, isTyping: boolean }) => {
      if (data.userId !== session.user.id) {
        setOtherUserTyping(data.isTyping)
      }
    })

    // 相談状態更新
    newSocket.on('consultation-updated', (updatedConsultation: any) => {
      // 相談状態が変更された場合の処理
      console.log('相談状態更新:', updatedConsultation)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [session?.user.id, consultation.id])

  // メッセージの自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // メッセージ送信
  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return

    const messageData = {
      consultationId: consultation.id,
      content: newMessage.trim(),
      type: 'text'
    }

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        const sentMessage = await response.json()
        socket.emit('send-message', sentMessage.data)
        setNewMessage('')
        setIsTyping(false)
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error)
    }
  }

  // タイピング状態の更新
  const handleTyping = (value: string) => {
    setNewMessage(value)
    
    if (socket) {
      const typing = value.length > 0
      if (typing !== isTyping) {
        setIsTyping(typing)
        socket.emit('typing', { consultationId: consultation.id, isTyping: typing })
      }
    }
  }

  // AI症状分析を実行
  const performAiAnalysis = async () => {
    if (!isDoctor) return

    setIsAiAnalyzing(true)
    try {
      const response = await fetch('/api/ai/analyze-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId: consultation.id,
          messages: messages.map(m => ({
            role: m.sender?.role === 'DOCTOR' ? 'doctor' : 'patient',
            content: m.content,
            timestamp: m.timestamp
          }))
        })
      })

      if (response.ok) {
        const analysis = await response.json()
        
        // AI分析結果をチャットに追加
        const aiMessage = {
          id: `ai-${Date.now()}`,
          content: analysis.data.summary,
          senderId: 'ai',
          sender: { name: 'AI分析', role: 'AI' },
          timestamp: new Date(),
          type: 'ai_analysis',
          isRead: false
        }

        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('AI分析エラー:', error)
    } finally {
      setIsAiAnalyzing(false)
    }
  }

  // ファイルアップロード
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('consultationId', consultation.id)

    try {
      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        socket?.emit('send-message', result.data)
      }
    } catch (error) {
      console.error('ファイルアップロードエラー:', error)
    }
  }

  // 相談終了
  const endConsultation = async () => {
    if (!isDoctor) return

    try {
      const response = await fetch(`/api/consultations/${consultation.id}/end`, {
        method: 'PATCH'
      })

      if (response.ok) {
        socket?.emit('consultation-ended', { consultationId: consultation.id })
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('相談終了エラー:', error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {otherUser?.image ? (
                  <img
                    src={otherUser.image}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {otherUser?.name?.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {otherUser?.name}
                {isDoctor ? 'さん' : '医師'}
              </h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-500">
                  {isConnected ? 'オンライン' : 'オフライン'}
                </span>
                {otherUserTyping && (
                  <span className="text-sm text-blue-500 animate-pulse">
                    入力中...
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowConsultationInfo(!showConsultationInfo)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5" />
            </button>
            
            {isDoctor && (
              <>
                <button
                  onClick={performAiAnalysis}
                  disabled={isAiAnalyzing}
                  className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faRobot} className="h-4 w-4 mr-2" />
                  {isAiAnalyzing ? '分析中...' : 'AI分析'}
                </button>
                
                <button
                  onClick={endConsultation}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  相談終了
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 相談情報サイドバー */}
      {showConsultationInfo && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">相談情報</h2>
              <button
                onClick={() => setShowConsultationInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">症状</h3>
                <p className="mt-1 text-sm text-gray-900">{consultation.symptoms}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">緊急度</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

              <div>
                <h3 className="text-sm font-medium text-gray-500">開始時刻</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(consultation.createdAt).toLocaleString('ja-JP')}
                </p>
              </div>

              {consultation.preAnalysis && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">AI事前分析</h3>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      {consultation.preAnalysis.summary}
                    </p>
                    {consultation.preAnalysis.riskLevel && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          consultation.preAnalysis.riskLevel === 'high' 
                            ? 'bg-red-100 text-red-800'
                            : consultation.preAnalysis.riskLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          リスク: {consultation.preAnalysis.riskLevel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'ai_analysis'
                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                : message.senderId === currentUser.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              {message.type === 'ai_analysis' && (
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faRobot} className="h-4 w-4 mr-2" />
                  <span className="text-xs font-medium">AI分析結果</span>
                </div>
              )}
              
              <p className="text-sm">{message.content}</p>
              
              <div className="mt-2 text-xs opacity-75">
                {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* メッセージ入力エリア */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faFileUpload} className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="メッセージを入力..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}