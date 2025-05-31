'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function ModernHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove)
      return () => heroElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section 
      ref={heroRef}
      className={`relative min-h-screen overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(79, 70, 229, 0.1) 0%, 
            rgba(124, 58, 237, 0.05) 50%, 
            transparent 100%),
          linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 25%, 
            #f093fb 50%, 
            #f5576c 75%, 
            #4facfe 100%)
        `,
        backgroundSize: '200% 200%',
        animation: 'rotateGradient 8s ease infinite'
      }}
    >
      {/* 動的背景要素 */}
      <div className="absolute inset-0">
        {/* 浮遊する3D球体 */}
        <div className="absolute top-20 left-20 w-32 h-32 animate-float">
          <div className="w-full h-full glass rounded-full opacity-20 transform-3d hover-lift"></div>
        </div>
        <div className="absolute top-40 right-32 w-24 h-24 animate-float-reverse">
          <div className="w-full h-full glass rounded-full opacity-15 transform-3d hover-lift" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="absolute bottom-32 left-32 w-20 h-20 animate-float">
          <div className="w-full h-full glass rounded-full opacity-25 transform-3d hover-lift" style={{animationDelay: '4s'}}></div>
        </div>

        {/* グリッドパターン */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>

        {/* パーティクル効果 */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse-custom opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* 左側：コンテンツ */}
          <div className={`space-y-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            {/* ステータスバッジ */}
            <div className="inline-flex items-center px-6 py-3 glass rounded-full backdrop-blur-xl border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-white">
                医師認定済み・完全無料で開始
              </span>
            </div>

            {/* メインタイトル */}
            <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="block text-white mb-4">
                AI診断と専門医相談で
              </span>
              <span className="block gradient-text text-6xl lg:text-8xl">
                安心の医療サポート
              </span>
            </h1>

            {/* サブタイトル */}
            <p className="text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-2xl">
              症状が気になったその瞬間から、最先端のAI技術と経験豊富な医師があなたの健康をサポート。
              <span className="gradient-text-alt font-semibold">24時間いつでも</span>、
              信頼できる医療アドバイスをお届けします。
            </p>

            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <Link 
                href="/ai-diagnosis" 
                className="group relative overflow-hidden px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl transform-3d hover-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  AI症状診断を開始
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>

              <Link 
                href="/consultation" 
                className="group px-10 py-5 glass backdrop-blur-xl border border-white/30 text-white rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-105 hover:bg-white/20 transform-3d hover-lift"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  医師に相談する
                </div>
              </Link>
            </div>

            {/* 信頼性指標 */}
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-white/80">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-sm font-medium">登録無料</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-sm font-medium">30秒で開始</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-sm font-medium">クレジットカード不要</span>
              </div>
            </div>
          </div>

          {/* 右側：3Dビジュアル */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            <div className="relative transform-3d">
              {/* メイン3Dカード */}
              <div className="glass backdrop-blur-xl rounded-3xl p-8 hover-lift will-change-transform">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  {/* AI診断インターフェース */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-purple-600/90 backdrop-blur-sm">
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between p-6 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                          </svg>
                        </div>
                        <div className="text-white">
                          <div className="font-semibold">AI症状診断</div>
                          <div className="text-xs opacity-80">リアルタイム分析中...</div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>

                    {/* チャット内容 */}
                    <div className="p-6 space-y-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 ml-8">
                        <p className="text-white text-sm">頭痛と軽い発熱があります。症状が続いています。</p>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-4 mr-8">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-800 text-sm font-medium mb-2">
                              症状を分析しました。一般的な風邪の症状に一致しています。
                            </p>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-green-700">診断信頼度: 85%</span>
                              </div>
                              <div className="text-xs text-green-600">
                                専門医による詳細相談をお勧めします
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 浮遊要素 */}
              <div className="absolute -top-6 -left-6 w-16 h-16 glass rounded-2xl flex items-center justify-center animate-float backdrop-blur-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>

              <div className="absolute -bottom-6 -right-6 w-14 h-14 glass rounded-xl flex items-center justify-center animate-float-reverse backdrop-blur-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>

              <div className="absolute top-1/2 -left-8 w-12 h-12 glass rounded-full flex items-center justify-center animate-pulse-custom backdrop-blur-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 統計セクション */}
        <div className={`grid grid-cols-3 gap-8 py-16 border-t border-white/20 mt-20 transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {[
            { number: '100+', label: '認定医師', color: 'from-blue-400 to-purple-500' },
            { number: '24/7', label: '利用可能', color: 'from-green-400 to-teal-500' },
            { number: '1000+', label: '完了相談', color: 'from-pink-400 to-red-500' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-4xl lg:text-6xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              <div className="text-white/80 font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}