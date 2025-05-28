'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] py-20">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block text-gray-900">AI診断と専門医相談で</span>
              <span className="block text-accent bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
                安心の医療サポートを
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
              最新のAI技術と経験豊富な医師の専門知識を組み合わせ、24時間いつでも信頼できる医療アドバイスを提供します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signin" className="btn btn--primary btn--large group">
                無料で始める
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/ai-diagnosis" className="btn btn--outline btn--large">
                AI症状診断を試す
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">100+</div>
                <div className="text-sm text-gray-600">認定医師</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">提携病院</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">1000+</div>
                <div className="text-sm text-gray-600">完了相談</div>
              </div>
            </div>
          </div>

          <div className="lg:pl-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">今すぐ使える機能</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI症状分析</h4>
                    <p className="text-sm text-gray-600">症状を入力するだけで即座に分析結果を取得</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">リアルタイム相談</h4>
                    <p className="text-sm text-gray-600">専門医とのライブチャット・ビデオ通話</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">安全保証</h4>
                    <p className="text-sm text-gray-600">医師免許確認済み・プライバシー完全保護</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-2 pb-8">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`スライド${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}