import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'サービス',
      links: [
        { name: '医師検索', href: '/doctors/search' },
        { name: '病院検索', href: '/hospitals/search' },
        { name: 'AI症状診断', href: '/ai-diagnosis' },
        { name: 'オンライン相談', href: '/consultation' }
      ]
    },
    {
      title: '医療従事者の方へ',
      links: [
        { name: '医師登録', href: '/doctor/register' },
        { name: '病院登録', href: '/hospital/register' },
        { name: '医師向けサポート', href: '/doctor/support' },
        { name: 'よくある質問', href: '/doctor/faq' }
      ]
    },
    {
      title: '会社情報',
      links: [
        { name: '運営会社', href: '/company' },
        { name: 'プライバシーポリシー', href: '/privacy' },
        { name: '利用規約', href: '/terms' },
        { name: 'お問い合わせ', href: '/contact' }
      ]
    },
    {
      title: 'サポート',
      links: [
        { name: 'ヘルプセンター', href: '/help' },
        { name: '使い方ガイド', href: '/guide' },
        { name: '技術サポート', href: '/support' },
        { name: 'セキュリティ', href: '/security' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* ブランド情報 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">Doctor Direct</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              安心・安全なオンライン医療相談プラットフォーム。
              AI技術と医師の専門知識を組み合わせて、
              最適な医療サポートを提供します。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* リンクセクション */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 下部セクション */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Doctor Direct. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                利用規約
              </Link>
              <Link href="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                クッキーポリシー
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-xs text-center">
              このサービスは医師の診断・治療の代替ではありません。緊急時は救急車（119番）をお呼びください。
              医療情報は一般的な参考情報として提供されており、個人の医療相談には医師との直接相談をお勧めします。
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}