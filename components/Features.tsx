export default function Features() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      ),
      title: "AI症状分析",
      description: "最新のAI技術（xAI Grok & Google Gemini）を活用し、症状から考えられる病気や推奨される対処法を即座に分析します。",
      benefits: ["24時間利用可能", "即座に結果表示", "高精度分析"],
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      ),
      title: "オンライン診療",
      description: "認定医師とのビデオ通話による遠隔診療。自宅から安全・安心な医療相談を受けることができます。",
      benefits: ["認定医師のみ", "HD画質通話", "録画・記録機能"],
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      ),
      title: "医師・病院検索",
      description: "専門分野、評価、場所などの条件で最適な医師や病院を検索。口コミや詳細情報も確認できます。",
      benefits: ["詳細フィルター", "評価・口コミ", "予約連携"],
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ),
      title: "リアルタイムチャット",
      description: "医師との即座のコミュニケーション。Socket.ioによるリアルタイム双方向通信で迅速な相談が可能です。",
      benefits: ["即座の返答", "ファイル共有", "通知機能"],
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      ),
      title: "セキュリティ保護",
      description: "医療情報の最高レベルの暗号化保護。HIPAA準拠のセキュリティでプライバシーを完全に保護します。",
      benefits: ["エンドツーエンド暗号化", "HIPAA準拠", "データ保護"],
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      title: "個人ダッシュボード",
      description: "相談履歴、予約管理、健康記録を一元管理。パーソナライズされた医療情報を提供します。",
      benefits: ["履歴管理", "健康記録", "リマインダー"],
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    }
  ]

  const techStack = [
    { category: "Frontend", name: "Next.js" },
    { category: "Auth", name: "Google OAuth" },
    { category: "Storage", name: "LocalStorage" },
    { category: "Deploy", name: "Vercel" },
    { category: "AI", name: "xAI Grok" },
    { category: "Realtime", name: "Socket.io" }
  ]

  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            充実の機能で<span className="text-accent">安心の医療サポート</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            最新技術と医療の専門知識を組み合わせ、誰でも簡単に利用できる包括的な医療プラットフォームを提供します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                <div className={`w-8 h-8 ${feature.iconColor}`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">最新技術スタック</h3>
            <p className="text-gray-600">信頼性とパフォーマンスを重視した最新の技術で構築</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
                <div className="text-xs text-gray-500 mb-1">{tech.category}</div>
                <div className="font-semibold text-gray-900">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}