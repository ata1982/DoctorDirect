'use client'

import { useState, useEffect } from 'react'

export default function ModernThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(saved === 'dark' || (!saved && prefersDark))
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }
  }, [isDark, mounted])

  if (!mounted) {
    return (
      <div className="w-14 h-8 glass rounded-full border border-white/20"></div>
    )
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`relative w-14 h-8 glass rounded-full border border-white/20 backdrop-blur-xl transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 ${
        isDark ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
      }`}
      aria-label="Toggle theme"
    >
      {/* スライダー */}
      <div
        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-500 flex items-center justify-center ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {/* アイコン */}
        <div className={`transition-all duration-300 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
          {isDark ? (
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          )}
        </div>
      </div>

      {/* 背景の装飾 */}
      <div className={`absolute inset-0 rounded-full opacity-30 blur-md transition-all duration-500 ${
        isDark ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
      }`}></div>
    </button>
  )
}