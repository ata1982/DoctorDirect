'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HeroSectionProps {
  stats: {
    doctors: number
    hospitals: number
    completedConsultations: number
  }
}

export function HeroSection({ stats }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "AI診断と専門医相談で",
      subtitle: "安心の医療サポートを",
      description: "最新のAI技術と経験豊富な医師の専門知識を組み合わせ、24時間いつでも信頼できる医療アドバイスを提供します。",
      ctaText: "無料で始める",
      ctaLink: "/auth/signup",
      bgImage: "bg-gradient-to-br from-blue-600 to-blue-800"
    },
    {
      title: "全国の認定医師と",
      subtitle: "オンラインで相談",
      description: "専門分野ごとに厳選された医師とリアルタイムでビデオ相談。場所を選ばず、質の高い医療相談を受けられます。",
      ctaText: "医師を探す",
      ctaLink: "/doctors/search",
      bgImage: "bg-gradient-to-br from-green-600 to-green-800"
    },
    {
      title: "症状に応じた",
      subtitle: "最適な病院を検索",
      description: "症状や専門分野、評価などから最適な医療機関を検索。予約からアフターフォローまでサポートします。",
      ctaText: "病院を探す",
      ctaLink: "/hospitals/search",
      bgImage: "bg-gradient-to-br from-purple-600 to-purple-800"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-screen flex items-center">
      {/* スライドコンテンツ */}
      <div className={`absolute inset-0 transition-all duration-1000 ${slides[currentSlide].bgImage}`}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* メインコンテンツ */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {slides[currentSlide].title}
              <br />
              <span className="text-blue-300">{slides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={slides[currentSlide].ctaLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                {slides[currentSlide].ctaText}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/ai-diagnosis"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                AI症状診断を試す
              </Link>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white border-opacity-20">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-300 mb-2">
                  {stats.doctors.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-300">認定医師</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-300 mb-2">
                  {stats.hospitals.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-300">提携病院</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">
                  {stats.completedConsultations.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-300">完了相談</div>
              </div>
            </div>
          </div>

          {/* サイドコンテンツ */}
          <div className="relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white mb-6">今すぐ使える機能</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white bg-opacity-10 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">AI症状分析</h4>
                    <p className="text-gray-300 text-sm">症状を入力するだけで即座に分析結果を取得</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-white bg-opacity-10 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">リアルタイム相談</h4>
                    <p className="text-gray-300 text-sm">専門医とのライブチャット・ビデオ通話</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-white bg-opacity-10 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">安全保証</h4>
                    <p className="text-gray-300 text-sm">医師免許確認済み・プライバシー完全保護</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* スライドインジケーター */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}