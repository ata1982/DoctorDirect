'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ModernFooter() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const footerSections = [
    {
      title: 'サービス',
      links: [
        { label: 'AI症状診断', href: '/ai-diagnosis' },
        { label: '医師相談', href: '/consultation' },
        { label: '医師検索', href: '/doctor-search' },
        { label: '緊急サポート', href: '/emergency' }
      ]
    },
    {
      title: '機能',
      links: [
        { label: 'ヘルスコーチ', href: '/health-coach' },
        { label: '薬局検索', href: '/pharmacy' },
        { label: 'ウェアラブル連携', href: '/wearable' },
        { label: 'コミュニティ', href: '/community' }
      ]
    },
    {
      title: '情報',
      links: [
        { label: '医師登録', href: '/doctor-registration' },
        { label: 'レビュー', href: '/reviews' },
        { label: 'ダッシュボード', href: '/dashboard' },
        { label: '画像診断', href: '/image-diagnosis' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' }
  ]

  return (
    <footer className="relative overflow-hidden">
      {/* 背景グラデーション */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(79, 70, 229, 0.1) 0%, 
              rgba(124, 58, 237, 0.05) 50%, 
              transparent 100%),
            linear-gradient(135deg, 
              #1a1a1a 0%, 
              #2d2d2d 50%, 
              #1a1a1a 100%)
          `
        }}
      ></div>

      {/* パーティクル背景 */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse-custom opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container relative z-10 py-20">
        {/* メインフッターコンテンツ */}
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          {/* ブランドセクション */}
          <div className="lg:col-span-1">
            <Link href="/" className="group flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                D
              </div>
              <div>
                <div className="text-xl font-black text-white">Doctor Direct</div>
                <div className="text-xs text-gray-400 -mt-1">医療AIプラットフォーム</div>
              </div>
            </Link>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              最先端のAI技術と専門医のネットワークで、
              安心で信頼できる医療サポートを24時間提供します。
            </p>

            {/* ソーシャルリンク */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 glass rounded-xl backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover-lift will-change-transform transition-all duration-300 hover:bg-white/10"
                  aria-label={social.name}
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ナビゲーションセクション */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-lg font-bold text-white">{section.title}</h3>
              <nav className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* ニュースレター */}
        <div className="glass backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                最新の医療情報をお届け
              </h3>
              <p className="text-gray-300">
                健康に関する最新情報やAI診断の改善点など、
                価値ある情報を定期的にお送りします。
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="メールアドレスを入力"
                className="flex-1 px-4 py-3 glass backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                登録
              </button>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { number: '10,000+', label: '利用者数', icon: '👥' },
            { number: '500+', label: '認定医師', icon: '👨‍⚕️' },
            { number: '50,000+', label: '相談件数', icon: '💬' },
            { number: '99.8%', label: '満足度', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl lg:text-3xl font-bold gradient-text mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-400 font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 分割線 */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* コピーライト */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>&copy; 2024 Doctor Direct. All rights reserved.</p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-300">
                利用規約
              </Link>
              <Link href="/security" className="hover:text-white transition-colors duration-300">
                セキュリティ
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>全システム稼働中</span>
          </div>
        </div>
      </div>

      {/* 装飾要素 */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float-reverse"></div>
    </footer>
  )
}