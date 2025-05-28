'use client'

import Link from 'next/link'
import { useState } from 'react'

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

          <nav className="hidden md:flex space-x-8">
            <Link href="/doctors" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              医師検索
            </Link>
            <Link href="/hospitals" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              病院検索
            </Link>
            <Link href="/ai-diagnosis" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              AI症状診断
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              サービス案内
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              お問い合わせ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/signin" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">
              ログイン
            </Link>
            <Link href="/signup" className="btn btn--primary text-sm">
              無料登録
            </Link>
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
      </div>
    </header>
  )
}