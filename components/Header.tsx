'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import NotificationSystem from './NotificationSystem'
import AuthButton from './AuthButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-apple border-b border-gray-100 dark:border-gray-800">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* ロゴ */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            aria-label="Doctor Direct ホームページに移動"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443a55.381 55.381 0 0 1 5.25 2.882V15" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Doctor Direct
            </span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="メインナビゲーション">
            <Link 
              href="/ai-diagnosis" 
              className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              aria-label="AI症状診断ページに移動"
            >
              AI症状診断
            </Link>
            <Link 
              href="/image-diagnosis" 
              className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              aria-label="画像診断ページに移動"
            >
              画像診断
            </Link>
            <Link 
              href="/consultation" 
              className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              aria-label="オンライン相談ページに移動"
            >
              オンライン相談
            </Link>
            <Link 
              href="/doctor-search" 
              className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              aria-label="医師検索ページに移動"
            >
              医師検索
            </Link>
            <Link 
              href="/pharmacy" 
              className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              aria-label="薬局連携ページに移動"
            >
              薬局連携
            </Link>
            <Link 
              href="/emergency" 
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
              aria-label="緊急サポートページに移動"
            >
              緊急サポート
            </Link>
            <Link 
              href="/dashboard" 
              className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              aria-label="マイページに移動"
            >
              マイページ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              <ThemeToggle />
              <NotificationSystem />
              <AuthButton />
            </div>
            <button 
              type="button" 
              className="lg:hidden p-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="flex flex-col space-y-1.5">
                <span className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div 
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
          role="navigation"
          aria-label="モバイルナビゲーション"
        >
          <div className="backdrop-blur-apple border-t border-gray-100 dark:border-gray-800">
            <nav className="container py-6 space-y-1" role="menu">
              {[
                { href: '/ai-diagnosis', label: 'AI症状診断' },
                { href: '/image-diagnosis', label: '画像診断' },
                { href: '/consultation', label: 'オンライン相談' },
                { href: '/doctor-search', label: '医師検索' },
                { href: '/pharmacy', label: '薬局連携' },
                { href: '/emergency', label: '緊急サポート', isEmergency: true },
                { href: '/dashboard', label: 'マイページ' }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`block font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    item.isEmergency 
                      ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
                  }`}
                  role="menuitem"
                  aria-label={`${item.label}ページに移動`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 py-3 flex items-center justify-between" role="menuitem">
                <span className="text-secondary dark:text-gray-300 text-sm font-medium">設定</span>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <NotificationSystem />
                  <AuthButton />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}