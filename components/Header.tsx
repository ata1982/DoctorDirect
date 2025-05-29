'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthButton from './AuthButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-apple border-b border-gray-100">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              D
            </div>
            <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-500 transition-colors duration-200">Doctor Direct</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/ai-diagnosis" className="text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-full transition-all duration-200 hover:bg-gray-50">
              AI症状診断
            </Link>
            <Link href="/doctor-search" className="text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-full transition-all duration-200 hover:bg-gray-50">
              医師検索
            </Link>
            <Link href="/consultation" className="text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-full transition-all duration-200 hover:bg-gray-50">
              オンライン相談
            </Link>
            <Link href="/health-coach" className="text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-full transition-all duration-200 hover:bg-gray-50">
              健康コーチ
            </Link>
            <Link href="/dashboard" className="text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-full transition-all duration-200 hover:bg-gray-50">
              マイページ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <AuthButton />
            </div>
            <button 
              type="button" 
              className="md:hidden p-3 rounded-full hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="メニューを開く"
            >
              <div className="flex flex-col space-y-1.5">
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="backdrop-blur-apple border-t border-gray-100">
            <nav className="container py-6 space-y-1">
              <Link href="/ai-diagnosis" className="block text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                AI症状診断
              </Link>
              <Link href="/doctor-search" className="block text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                医師検索
              </Link>
              <Link href="/consultation" className="block text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                オンライン相談
              </Link>
              <Link href="/health-coach" className="block text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                健康コーチ
              </Link>
              <Link href="/dashboard" className="block text-secondary hover:text-blue-500 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50">
                マイページ
              </Link>
              <div className="px-4 py-3">
                <AuthButton />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}