import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-32 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mb-6">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            今すぐ無料で始められます
          </div>

          <h2 className="text-display text-gray-900 mb-8">
            あなたの健康を<span className="text-blue-500">AI と専門医</span>がサポート
          </h2>
          <p className="text-body text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
            症状が気になったら、まずはAI診断で安心を。必要に応じて専門医との相談へスムーズに進めます。
          </p>
          
          {/* メインCTA - 1つに集約 */}
          <div className="animate-slide-up">
            <Link href="/ai-diagnosis" className="btn btn--primary btn--xl group inline-flex items-center mb-4">
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              AI症状診断を無料で始める
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
            
            <p className="text-sm text-secondary flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              登録無料・クレジットカード不要・30秒で開始
            </p>
          </div>

          {/* 利用の流れ */}
          <div className="mt-20 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-12">簡単3ステップで健康管理</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto relative">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">症状を入力</h4>
                <p className="text-secondary leading-relaxed">気になる症状を自然な言葉で入力。プライバシーは完全に保護されます。</p>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto relative">
                    <span className="text-2xl font-bold text-green-600">2</span>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">AI分析結果</h4>
                <p className="text-secondary leading-relaxed">最新のAI技術が症状を分析し、考えられる原因と対処法を即座に提示。</p>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto relative">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">専門医相談</h4>
                <p className="text-secondary leading-relaxed">必要に応じて認定医師とのオンライン相談へ。詳細な診断とアドバイスを受けられます。</p>
              </div>
            </div>
          </div>

          {/* 安心要素 */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="text-3xl font-bold text-blue-500 mb-2">100%</div>
                <div className="text-sm text-secondary font-medium">認定医師</div>
              </div>
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                <div className="text-sm text-secondary font-medium">利用可能</div>
              </div>
              <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="text-3xl font-bold text-purple-500 mb-2">完全</div>
                <div className="text-sm text-secondary font-medium">プライバシー保護</div>
              </div>
              <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="text-3xl font-bold text-orange-500 mb-2">無料</div>
                <div className="text-sm text-secondary font-medium">基本機能</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}