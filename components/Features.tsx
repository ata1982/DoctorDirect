export default function Features() {
  // 主要機能（特別扱い - 大きなレイアウト）
  const primaryFeatures = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      ),
      title: "AI症状分析",
      description: "症状を入力するだけで、最新のAI技術（xAI Grok & Google Gemini）が即座に分析。考えられる病気や推奨される対処法を、24時間いつでも高精度でお届けします。",
      benefits: ["24時間利用可能", "即座に結果表示", "高精度分析", "複数症状対応"],
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      checkBg: "bg-blue-50",
      checkColor: "text-blue-500",
      ctaText: "AI診断を試す",
      ctaLink: "/ai-diagnosis",
      demo: "症状入力 → AI分析 → 結果表示まで約30秒"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      ),
      title: "オンライン診療",
      description: "厳格な審査をクリアした認定医師とのビデオ通話による遠隔診療。自宅から安全・安心な医療相談を受けることができ、必要に応じて処方箋の発行も可能です。",
      benefits: ["認定医師のみ", "HD画質通話", "録画・記録機能", "処方箋対応"],
      iconBg: "bg-green-50",
      iconColor: "text-accent",
      checkBg: "bg-green-50",
      checkColor: "text-accent",
      ctaText: "医師を探す",
      ctaLink: "/doctor-search",
      demo: "医師選択 → 予約 → ビデオ通話開始"
    }
  ]

  // 補助機能（コンパクトなカード）
  const secondaryFeatures = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      ),
      title: "医師・病院検索",
      description: "専門分野、評価、場所などの条件で最適な医師や病院を検索。",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ),
      title: "リアルタイムチャット",
      description: "医師との即座のコミュニケーション。Socket.ioによるリアルタイム双方向通信。",
      iconBg: "bg-orange-50",
      iconColor: "text-accent-orange"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      ),
      title: "セキュリティ保護",
      description: "医療情報の最高レベルの暗号化保護。HIPAA準拠のセキュリティ。",
      iconBg: "bg-red-50",
      iconColor: "text-red-500"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      title: "個人ダッシュボード",
      description: "相談履歴、予約管理、健康記録を一元管理。パーソナライズされた医療情報。",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500"
    }
  ]

  const trustIndicators = [
    { label: "医師認定", value: "100%", icon: "🏥" },
    { label: "データ暗号化", value: "256bit", icon: "🔒" },
    { label: "可用性", value: "99.9%", icon: "⚡" },
    { label: "レスポンス", value: "<1秒", icon: "🚀" }
  ]

  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="container">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-headline text-gray-900 mb-6">
            充実の機能で<span className="text-accent">安心の医療サポート</span>
          </h2>
          <p className="text-body text-secondary max-w-3xl mx-auto leading-relaxed">
            最新技術と医療の専門知識を組み合わせ、誰でも簡単に利用できる包括的な医療プラットフォームを提供します。
          </p>
        </div>

        {/* 主要機能 - 大きな左右レイアウト */}
        <div className="space-y-24 mb-32">
          {primaryFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`grid lg:grid-cols-2 gap-16 items-center animate-slide-up ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`w-20 h-20 ${feature.iconBg} rounded-3xl flex items-center justify-center mb-8 shadow-lg`}>
                  <div className={`w-10 h-10 ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                <p className="text-lg text-secondary mb-8 leading-relaxed">{feature.description}</p>
                
                <ul className="space-y-4 mb-8">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 ${feature.checkBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-3 h-3 ${feature.checkColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-secondary font-medium text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-8 p-4 bg-gray-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">利用の流れ</p>
                  <p className="font-medium text-gray-900">{feature.demo}</p>
                </div>

                <a 
                  href={feature.ctaLink}
                  className="btn btn--outline btn--large inline-flex items-center group"
                >
                  {feature.ctaText}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="medical-card bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-500">
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* デモ画面のイメージ */}
                    <div className="w-full h-full bg-white/50 backdrop-blur-sm rounded-2xl p-8 flex flex-col justify-center">
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
                      </div>
                      <div className="mt-8 text-center">
                        <div className={`w-16 h-16 ${feature.iconBg} rounded-full flex items-center justify-center mx-auto shadow-md`}>
                          <div className={`w-8 h-8 ${feature.iconColor}`}>
                            {feature.icon}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mt-3">{feature.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 信頼性指標 */}
        <div className="medical-card bg-white rounded-3xl shadow-lg p-12 mb-20 animate-slide-up">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">信頼できる医療プラットフォーム</h3>
            <p className="text-secondary max-w-2xl mx-auto">
              厳格な基準をクリアした認定医師のみが参加。最高レベルのセキュリティでお客様の健康情報を保護します。
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center group trust-indicator">
                <div className="text-2xl mb-2">{indicator.icon}</div>
                <div className="text-3xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-200">
                  {indicator.value}
                </div>
                <div className="text-sm text-secondary font-medium">{indicator.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 補助機能 - コンパクトなカード形式 */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">その他の充実機能</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="medical-card bg-white rounded-2xl shadow-lg p-6 group animate-slide-up hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-6 h-6 ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}