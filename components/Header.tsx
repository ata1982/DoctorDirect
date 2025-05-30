'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthButton from './AuthButton'
import NotificationSystem from './NotificationSystem'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-apple border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              D
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-200">Doctor Direct</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/ai-diagnosis" className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
              AI症状診断
            </Link>
            <Link href="/image-diagnosis" className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
              画像診断
            </Link>
            <Link href="/doctor-search" className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
              医師検索
            </Link>
            <Link href="/consultation" className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
              オンライン相談
            </Link>
            <Link href="/health-coach" className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
              健康コーチ
            </Link>
            <Link href="/pharmacy" className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
              薬局連携
            </Link>
            <Link href="/emergency" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm">
              緊急サポート
            </Link>
            <Link href="/dashboard" className="text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
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
              aria-label="メニューを開く"
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
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="backdrop-blur-apple border-t border-gray-100 dark:border-gray-800">
            <nav className="container py-6 space-y-1">
              <Link href="/ai-diagnosis" className="block text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                AI症状診断
              </Link>
              <Link href="/image-diagnosis" className="block text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                画像診断
              </Link>
              <Link href="/doctor-search" className="block text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                医師検索
              </Link>
              <Link href="/consultation" className="block text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                オンライン相談
              </Link>
              <Link href="/health-coach" className="block text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                健康コーチ
              </Link>
              <Link href="/pharmacy" className="block text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                薬局連携
              </Link>
              <Link href="/emergency" className="block text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20">
                緊急サポート
              </Link>
              <Link href="/dashboard" className="block text-secondary dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                マイページ
              </Link>
              <div className="px-4 py-3 flex items-center justify-between">
                <ThemeToggle />
                <NotificationSystem />
                <AuthButton />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}