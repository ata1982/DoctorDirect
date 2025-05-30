'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  suggestions?: string[]
  quickActions?: {
    label: string
    action: string
    icon: string
  }[]
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "こんにちは！Doctor DirectのAIアシスタントです。24時間いつでも健康に関するご相談をお受けします。どのようなことでお困りですか？",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "症状について相談したい",
        "薬について知りたい",
        "病院を探している",
        "緊急時の対応を知りたい"
      ]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): Message => {
    // 簡単なAI応答ロジック（実際のAIでは外部APIを使用）
    const responses = {
      '症状': {
        text: "症状についてお聞かせください。どのような症状でお困りですか？詳しく教えていただければ、適切なアドバイスや医療機関の紹介ができます。",
        quickActions: [
          { label: "AI症状診断", action: "diagnosis", icon: "🔍" },
          { label: "緊急度チェック", action: "emergency", icon: "🚨" },
          { label: "病院検索", action: "hospital", icon: "🏥" }
        ]
      },
      '薬': {
        text: "お薬に関するご質問ですね。処方薬の飲み方、副作用、市販薬との飲み合わせなど、どのようなことを知りたいですか？",
        quickActions: [
          { label: "薬局検索", action: "pharmacy", icon: "💊" },
          { label: "飲み合わせチェック", action: "interaction", icon: "⚠️" },
          { label: "副作用について", action: "sideeffects", icon: "📋" }
        ]
      },
      '病院': {
        text: "病院をお探しですね。お住まいの地域や希望する診療科、症状などを教えていただければ、最適な医療機関をご紹介します。",
        quickActions: [
          { label: "病院検索", action: "hospital", icon: "🏥" },
          { label: "診療科から選ぶ", action: "specialty", icon: "👨‍⚕️" },
          { label: "緊急医療機関", action: "emergency", icon: "🚨" }
        ]
      },
      '緊急': {
        text: "緊急時の対応についてですね。症状の緊急度によって対応が変わります。どのような状況でしょうか？",
        quickActions: [
          { label: "119番通報", action: "call119", icon: "📞" },
          { label: "緊急度判定", action: "triage", icon: "🚨" },
          { label: "応急処置ガイド", action: "firstaid", icon: "🆘" }
        ]
      },
      'default': {
        text: "申し訳ございませんが、その内容については専門医にご相談されることをお勧めします。症状が心配な場合は、お近くの医療機関を受診してください。",
        quickActions: [
          { label: "医師に相談", action: "consultation", icon: "👨‍⚕️" },
          { label: "病院検索", action: "hospital", icon: "🏥" },
          { label: "AI症状診断", action: "diagnosis", icon: "🔍" }
        ]
      }
    }

    const lowerMessage = userMessage.toLowerCase()
    let response = responses.default

    if (lowerMessage.includes('症状') || lowerMessage.includes('痛い') || lowerMessage.includes('具合')) {
      response = responses['症状']
    } else if (lowerMessage.includes('薬') || lowerMessage.includes('服用') || lowerMessage.includes('副作用')) {
      response = responses['薬']
    } else if (lowerMessage.includes('病院') || lowerMessage.includes('医療機関') || lowerMessage.includes('クリニック')) {
      response = responses['病院']
    } else if (lowerMessage.includes('緊急') || lowerMessage.includes('救急') || lowerMessage.includes('応急')) {
      response = responses['緊急']
    }

    return {
      id: Date.now(),
      text: response.text,
      sender: 'ai',
      timestamp: new Date(),
      quickActions: response.quickActions
    }
  }

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // AIの応答をシミュレート
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'diagnosis':
        window.location.href = '/ai-diagnosis'
        break
      case 'hospital':
        window.location.href = '/doctor-search'
        break
      case 'pharmacy':
        window.location.href = '/pharmacy'
        break
      case 'consultation':
        window.location.href = '/consultation'
        break
      case 'emergency':
        window.location.href = '/emergency'
        break
      case 'call119':
        window.open('tel:119')
        break
      default:
        handleSendMessage(`${action}について教えて`)
    }
  }

  return (
    <>
      {/* チャットボット起動ボタン */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600 animate-pulse'
          }`}
        >
          {isOpen ? (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <div className="text-white text-center">
              <div className="text-2xl">🤖</div>
              <div className="text-xs">AI</div>
            </div>
          )}
        </button>
        
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-90">
            24時間AI相談
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* チャットウィンドウ */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* ヘッダー */}
          <div className="bg-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-500 text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">AI医療アシスタント</h3>
                <p className="text-xs text-blue-100">24時間対応</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-xs">オンライン</span>
            </div>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                } rounded-2xl px-4 py-2`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="block w-full text-left p-2 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {message.quickActions && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.quickActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(action.action)}
                          className="p-2 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <span className="mr-1">{action.icon}</span>
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="症状や質問を入力してください..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              緊急時は迷わず119番通報をしてください
            </div>
          </div>
        </div>
      )}
    </>
  )
}