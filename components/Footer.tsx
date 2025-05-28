import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container">
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <span className="text-xl font-bold">Doctor Direct</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                安心・安全なオンライン医療相談プラットフォーム。
                AI技術と医師の専門知識を組み合わせて、最適な医療サポートを提供します。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:col-span-3">
              <div>
                <h3 className="font-semibold text-lg mb-6">サービス</h3>
                <ul className="space-y-4">
                  <li><Link href="/doctors" className="text-gray-400 hover:text-white transition-colors">医師検索</Link></li>
                  <li><Link href="/hospitals" className="text-gray-400 hover:text-white transition-colors">病院検索</Link></li>
                  <li><Link href="/ai-diagnosis" className="text-gray-400 hover:text-white transition-colors">AI症状診断</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">オンライン相談</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-6">医療従事者の方へ</h3>
                <ul className="space-y-4">
                  <li><a href="#doctor-register" className="text-gray-400 hover:text-white transition-colors">医師登録</a></li>
                  <li><a href="#hospital-register" className="text-gray-400 hover:text-white transition-colors">病院登録</a></li>
                  <li><a href="#doctor-support" className="text-gray-400 hover:text-white transition-colors">医師向けサポート</a></li>
                  <li><a href="#doctor-faq" className="text-gray-400 hover:text-white transition-colors">よくある質問</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-6">会社情報</h3>
                <ul className="space-y-4">
                  <li><a href="#company" className="text-gray-400 hover:text-white transition-colors">運営会社</a></li>
                  <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors">プライバシーポリシー</a></li>
                  <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors">利用規約</a></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2024 Doctor Direct. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">プライバシーポリシー</a>
              <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">利用規約</a>
              <a href="#cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">クッキーポリシー</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 leading-relaxed">
              このサービスは医師の診断・治療の代替ではありません。緊急時は救急車（119番）をお呼びください。
              医療情報は一般的な参考情報として提供されており、個人の医療相談には医師との直接相談をお勧めします。
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}