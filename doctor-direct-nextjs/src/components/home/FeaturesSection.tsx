export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI症状分析",
      description: "最新のAI技術（xAI Grok & Google Gemini）を活用し、症状から考えられる病気や推奨される対処法を即座に分析します。",
      benefits: ["24時間利用可能", "即座に結果表示", "高精度分析"]
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "オンライン診療",
      description: "認定医師とのビデオ通話による遠隔診療。自宅から安全・安心な医療相談を受けることができます。",
      benefits: ["認定医師のみ", "HD画質通話", "録画・記録機能"]
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "医師・病院検索",
      description: "専門分野、評価、場所などの条件で最適な医師や病院を検索。口コミや詳細情報も確認できます。",
      benefits: ["詳細フィルター", "評価・口コミ", "予約連携"]
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "リアルタイムチャット",
      description: "医師との即座のコミュニケーション。Socket.ioによるリアルタイム双方向通信で迅速な相談が可能です。",
      benefits: ["即座の返答", "ファイル共有", "通知機能"]
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "セキュリティ保護",
      description: "医療情報の最高レベルの暗号化保護。HIPAA準拠のセキュリティでプライバシーを完全に保護します。",
      benefits: ["エンドツーエンド暗号化", "HIPAA準拠", "データ保護"]
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "個人ダッシュボード",
      description: "相談履歴、予約管理、健康記録を一元管理。パーソナライズされた医療情報を提供します。",
      benefits: ["履歴管理", "健康記録", "リマインダー"]
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* セクションヘッダー */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            充実の機能で
            <span className="text-blue-600">安心の医療サポート</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            最新技術と医療の専門知識を組み合わせ、誰でも簡単に利用できる包括的な医療プラットフォームを提供します。
          </p>
        </div>

        {/* 機能グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 技術スタック情報 */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">最新技術スタック</h3>
            <p className="text-gray-600">
              信頼性とパフォーマンスを重視した最新の技術で構築
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            <div className="text-center">
              <div className="text-blue-600 font-semibold text-sm">Frontend</div>
              <div className="text-gray-900 font-bold">Next.js 14</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold text-sm">Database</div>
              <div className="text-gray-900 font-bold">PostgreSQL</div>
            </div>
            <div className="text-center">
              <div className="text-purple-600 font-semibold text-sm">ORM</div>
              <div className="text-gray-900 font-bold">Prisma</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-semibold text-sm">Auth</div>
              <div className="text-gray-900 font-bold">NextAuth.js</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 font-semibold text-sm">AI</div>
              <div className="text-gray-900 font-bold">xAI Grok</div>
            </div>
            <div className="text-center">
              <div className="text-indigo-600 font-semibold text-sm">Realtime</div>
              <div className="text-gray-900 font-bold">Socket.io</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}