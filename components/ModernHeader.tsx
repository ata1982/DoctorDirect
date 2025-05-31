'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ModernThemeToggle from './ModernThemeToggle'

export default function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/ai-diagnosis', label: 'AI診断', icon: '🤖' },
    { href: '/consultation', label: '医師相談', icon: '👨‍⚕️' },
    { href: '/doctor-search', label: '医師検索', icon: '🔍' },
    { href: '/emergency', label: '緊急サポート', icon: '🚨', isEmergency: true }
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass backdrop-blur-2xl border-b border-white/20 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between py-4 lg:py-6">
          {/* ロゴ */}
          <Link href="/" className="group flex items-center gap-3 hover-lift will-change-transform">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                D
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-black gradient-text">Doctor Direct</div>
              <div className="text-xs text-gray-500 -mt-1">医療AIプラットフォーム</div>
            </div>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 hover-lift will-change-transform ${
                  item.isEmergency
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </span>
                {!item.isEmergency && (
                  <div className="absolute inset-0 glass rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* アクション */}
          <div className="flex items-center gap-4">
            <ModernThemeToggle />
            
            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 glass rounded-xl backdrop-blur-xl border border-white/20 flex items-center justify-center hover-lift will-change-transform"
              aria-label="メニューを開く"
            >
              <div className="relative w-5 h-5 flex flex-col justify-center">
                <div className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : 'mb-1'}`}></div>
                <div className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100 mb-1'}`}></div>
                <div className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-6 border-t border-white/20">
            <div className="grid gap-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl font-medium transition-all duration-300 transform ${
                    item.isEmergency
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'glass backdrop-blur-xl border border-white/20 text-gray-700 hover:text-gray-900'
                  } ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                  <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}