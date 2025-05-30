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
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-24 overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob transition-transform duration-1000 ${currentSlide === 0 ? 'translate-x-0' : 'translate-x-4'}`}></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-6rem)] py-12 lg:py-24">
          {/* 左側：メインメッセージとCTA */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-blue-700 mb-4">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              医師認定済み・完全無料で開始
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="block text-gray-900">AI診断と専門医相談で</span>
              <span className="block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                安心の医療サポートを
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              症状が気になったその瞬間から、AI技術と経験豊富な医師があなたの健康をサポート。24時間いつでも、信頼できる医療アドバイスをお届けします。
            </p>
            
            {/* メインCTA */}
            <div className="pt-4 lg:pt-6">
              <Link href="/ai-diagnosis" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                AI症状診断を無料で始める
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                登録無料・クレジットカード不要・30秒で開始
              </p>
            </div>
          </div>

          {/* 右側：メインビジュアル */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* メインビジュアル - オンライン医療相談のイメージ */}
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 overflow-hidden relative">
                {/* 背景のグリッドパターン */}
                <div className="absolute inset-0 opacity-5">
                  <div className="h-full w-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
                  }}>
                  </div>
                </div>

                {/* 医師のアバター（左上） */}
                <div className="absolute top-6 left-6 animate-bounce z-10">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-blue-600">Dr. 田中</div>
                    <div className="w-6 h-1 bg-green-400 rounded-full mx-auto mt-1"></div>
                  </div>
                </div>

                {/* スマートフォン画面（中央右） */}
                <div className="absolute top-1/2 right-6 transform -translate-y-1/2 animate-pulse z-10">
                  <div className="w-32 h-56 bg-gray-900 rounded-2xl p-1 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-xl overflow-hidden relative">
                      {/* 画面上部 */}
                      <div className="bg-blue-500 p-3 text-white text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">AI診断</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* チャット風のやり取り */}
                      <div className="p-2 space-y-2 h-40 overflow-hidden">
                        <div className="bg-gray-100 p-2 rounded-lg text-xs">
                          頭痛と発熱があります
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg text-xs ml-4">
                          症状を分析中...
                        </div>
                        <div className="bg-blue-500 text-white p-2 rounded-lg text-xs ml-2">
                          風邪の症状の可能性があります。医師相談をお勧めします。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI分析結果（右下） */}
                <div className="absolute bottom-6 right-6 animate-bounce z-10" style={{animationDelay: '1s'}}>
                  <div className="bg-white rounded-xl shadow-lg p-4 max-w-36">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <svg className="w-3 h-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-900">AI分析完了</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      一般的な風邪症状
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div className="bg-green-500 h-1 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ハートビート（中央下） */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1">
                    <svg className="w-6 h-6 text-red-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1 bg-red-500 mx-px animate-pulse`} style={{
                          height: `${Math.random() * 12 + 4}px`,
                          animationDelay: `${i * 0.1}s`
                        }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 浮遊する要素 */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{animationDelay: '0.5s'}}>
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 実績数値を下部に移動 */}
        <div className="grid grid-cols-3 gap-4 lg:gap-8 py-12 lg:py-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl lg:text-4xl font-bold text-blue-500 mb-1 lg:mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm lg:text-base">認定医師</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-4xl font-bold text-green-500 mb-1 lg:mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm lg:text-base">利用可能</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-4xl font-bold text-purple-500 mb-1 lg:mb-2">1000+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm lg:text-base">完了相談</div>
          </div>
        </div>
      </div>
    </section>
  )
}