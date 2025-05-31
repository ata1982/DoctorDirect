'use client'

import { useState, useEffect, useRef } from 'react'

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
    title: 'AI症状診断',
    description: '最先端のAI技術で症状を瞬時に分析し、可能性のある病気や対処法を教えます。',
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    ),
    title: '専門医相談',
    description: '認定された専門医と直接リアルタイムでチャット相談。専門的なアドバイスをお受けいただけます。',
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: '24時間対応',
    description: 'いつでも、どこでも医療サポートを受けることができます。深夜や休日でも安心です。',
    color: 'from-green-500 to-teal-500',
    bgGradient: 'from-green-500/20 to-teal-500/20'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: 'セキュア通信',
    description: '医療情報は最高レベルの暗号化で保護。プライバシーを完全に守ります。',
    color: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/20 to-red-500/20'
  }
]

export default function ModernFeatures() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 段階的にアニメーション表示
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems(prev => [...prev, index])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
      
      {/* 背景パターン */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='0.05'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`
          }}
        ></div>
      </div>

      <div className="container relative z-10">
        {/* セクションヘッダー */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center px-6 py-3 glass rounded-full backdrop-blur-xl border border-gray-200/50 mb-8 transform transition-all duration-1000 ${
            visibleItems.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              革新的な医療サポート機能
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-black mb-6 transform transition-all duration-1000 delay-200 ${
            visibleItems.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <span className="gradient-text">Doctor Direct</span>
            <span className="text-gray-800">の特徴</span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${
            visibleItems.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            最新のAI技術と専門医のネットワークで、これまでにない
            <span className="gradient-text-alt font-semibold">革新的な医療体験</span>
            を提供します
          </p>
        </div>

        {/* 機能グリッド */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative transform transition-all duration-1000 ${
                visibleItems.includes(index) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${600 + index * 100}ms` }}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* カード */}
              <div className="relative h-full p-8 glass backdrop-blur-xl rounded-3xl border border-white/20 hover-lift will-change-transform overflow-hidden">
                {/* 背景グラデーション */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* アイコン */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>

                {/* コンテンツ */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* ホバー時の装飾 */}
                <div className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                <div className={`absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>

                {/* 進行状況インジケーター */}
                {hoveredItem === index && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className={`h-1 bg-gradient-to-r ${feature.color} animate-gradient`}></div>
                  </div>
                )}
              </div>

              {/* 浮遊する装飾要素 */}
              <div className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full opacity-20 animate-float group-hover:opacity-40 transition-opacity duration-300`}></div>
              <div className={`absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r ${feature.color} rounded-full opacity-15 animate-float-reverse group-hover:opacity-30 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* 追加の信頼性要素 */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-gray-200/50 transform transition-all duration-1000 delay-1000 ${
          visibleItems.length >= features.length ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {[
            { number: '99.9%', label: 'アップタイム', icon: '⚡' },
            { number: '<30秒', label: '平均応答時間', icon: '⏱️' },
            { number: 'HIPAA', label: '準拠セキュリティ', icon: '🔒' },
            { number: '4.9/5', label: 'ユーザー満足度', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl lg:text-3xl font-bold gradient-text mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}