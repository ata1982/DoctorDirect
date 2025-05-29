'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Message {
  id: number
  sender: 'user' | 'doctor'
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
}

interface Doctor {
  id: number
  name: string
  specialty: string
  status: 'online' | 'busy' | 'offline'
  avatar: string
}

export default function OnlineConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'doctor',
      content: 'こんにちは！田中医師です。どのような症状でお悩みでしょうか？',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedDoctor] = useState<Doctor>({
    id: 1,
    name: '田中 健一',
    specialty: '内科',
    status: 'online',
    avatar: '/api/placeholder/50/50'
  })
  const [isVideoCall, setIsVideoCall] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: 'user',
        content: newMessage,
        timestamp: new Date(),
        type: 'text'
      }
      setMessages([...messages, message])
      setNewMessage('')
      
      // 医師の自動返信をシミュレート
      setIsTyping(true)
      setTimeout(() => {
        const doctorReply: Message = {
          id: messages.length + 2,
          sender: 'doctor',
          content: 'ありがとうございます。症状について詳しく教えてください。いつ頃から始まりましたか？',
          timestamp: new Date(),
          type: 'text'
        }
        setMessages(prev => [...prev, doctorReply])
        setIsTyping(false)
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const message: Message = {
        id: messages.length + 1,
        sender: 'user',
        content: `ファイル: ${file.name}`,
        timestamp: new Date(),
        type: 'file'
      }
      setMessages([...messages, message])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-4">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-6rem)]">
            {/* サイドバー */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <img 
                  src={selectedDoctor.avatar} 
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                />
                <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
                <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                <div className="flex items-center justify-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    selectedDoctor.status === 'online' ? 'bg-green-500' : 
                    selectedDoctor.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-600 capitalize">{selectedDoctor.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsVideoCall(!isVideoCall)}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-colors ${
                    isVideoCall 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isVideoCall 
                        ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-5.197-5.197m0 0L5.636 5.636M18.364 18.364L12 18l-.776.776a3 3 0 01-4.24 0L5.636 5.636"
                        : "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      } 
                    />
                  </svg>
                  {isVideoCall ? 'ビデオ通話を終了' : 'ビデオ通話を開始'}
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  音声通話
                </button>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  ファイル送信
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">相談料金</h4>
                <p className="text-sm text-blue-700">初回相談: 3,000円（30分）</p>
                <p className="text-sm text-blue-700">追加料金: 1,000円（10分毎）</p>
              </div>
            </div>

            {/* メインチャット */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg flex flex-col">
              {/* ヘッダー */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">オンライン相談</h2>
                  <p className="text-sm text-gray-600">医師との直接相談</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    相談開始: {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* ビデオ通話エリア */}
              {isVideoCall && (
                <div className="p-4 bg-gray-900 relative">
                  <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg">ビデオ通話中...</p>
                      <p className="text-sm opacity-75">医師が接続するまでお待ちください</p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">あなた</span>
                  </div>
                </div>
              )}

              {/* メッセージエリア */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.type === 'file' && (
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-sm">添付ファイル</span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 入力エリア */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="メッセージを入力してください..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <span>Enterで送信、Shift+Enterで改行</span>
                  <span>相談時間: 15分経過</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx"
      />

      <Footer />
    </div>
  )
}