'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthButton from './AuthButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <span className="text-xl font-bold text-gray-900">Doctor Direct</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/ai-diagnosis" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              AI症状診断
            </Link>
            <Link href="/doctor-search" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              医師検索
            </Link>
            <Link href="/consultation" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              オンライン相談
            </Link>
            <Link href="/health-coach" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              健康コーチ
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              マイページ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <AuthButton />
            <button 
              type="button" 
              className="md:hidden flex flex-col space-y-1 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="メニューを開く"
            >
              <span className="w-6 h-0.5 bg-gray-600 transition-all"></span>
              <span className="w-6 h-0.5 bg-gray-600 transition-all"></span>
              <span className="w-6 h-0.5 bg-gray-600 transition-all"></span>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="container py-4 space-y-2">
              <Link href="/ai-diagnosis" className="block text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
                AI症状診断
              </Link>
              <Link href="/doctor-search" className="block text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
                医師検索
              </Link>
              <Link href="/consultation" className="block text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
                オンライン相談
              </Link>
              <Link href="/health-coach" className="block text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
                健康コーチ
              </Link>
              <Link href="/dashboard" className="block text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
                マイページ
              </Link>
              <div className="px-3 py-2">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}