import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container">
        <div className="py-20">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  D
                </div>
                <span className="text-xl font-semibold">Doctor Direct</span>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                安心・安全なオンライン医療相談プラットフォーム。
                AI技術と医師の専門知識を組み合わせて、最適な医療サポートを提供します。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:col-span-3">
              <div>
                <h3 className="font-semibold text-lg mb-8 text-white">サービス</h3>
                <ul className="space-y-4">
                  <li><Link href="/doctors" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">医師検索</Link></li>
                  <li><Link href="/hospitals" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">病院検索</Link></li>
                  <li><Link href="/ai-diagnosis" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">AI症状診断</Link></li>
                  <li><Link href="/consultation" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">オンライン相談</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-8 text-white">医療従事者の方へ</h3>
                <ul className="space-y-4">
                  <li><a href="#doctor-register" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">医師登録</a></li>
                  <li><a href="#hospital-register" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">病院登録</a></li>
                  <li><a href="#doctor-support" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">医師向けサポート</a></li>
                  <li><a href="#doctor-faq" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">よくある質問</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-8 text-white">会社情報</h3>
                <ul className="space-y-4">
                  <li><a href="#company" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">運営会社</a></li>
                  <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">プライバシーポリシー</a></li>
                  <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">利用規約</a></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 text-base">お問い合わせ</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-base">© 2024 Doctor Direct. All rights reserved.</p>
            <div className="flex space-x-8">
              <a href="#privacy" className="text-gray-400 hover:text-white text-base transition-colors duration-200">プライバシーポリシー</a>
              <a href="#terms" className="text-gray-400 hover:text-white text-base transition-colors duration-200">利用規約</a>
              <a href="#cookie-policy" className="text-gray-400 hover:text-white text-base transition-colors duration-200">クッキーポリシー</a>
            </div>
          </div>
        </div>

        {/* 技術スタック - フッターに移動 */}
        <div className="border-t border-gray-800 py-10">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">最新技術で構築</h3>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              パフォーマンスと信頼性を重視した最新の技術スタックを採用
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Next.js", color: "bg-gray-800 text-gray-300 hover:bg-gray-700" },
              { name: "Google OAuth", color: "bg-gray-800 text-gray-300 hover:bg-gray-700" },
              { name: "xAI Grok", color: "bg-gray-800 text-gray-300 hover:bg-gray-700" },
              { name: "Socket.io", color: "bg-gray-800 text-gray-300 hover:bg-gray-700" },
              { name: "Vercel", color: "bg-gray-800 text-gray-300 hover:bg-gray-700" },
              { name: "LocalStorage", color: "bg-gray-800 text-gray-300 hover:bg-gray-700" }
            ].map((tech, index) => (
              <div 
                key={index} 
                className={`px-3 py-1 rounded-full text-xs font-medium ${tech.color} transition-all duration-200 cursor-default`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 py-6">
          <div className="mt-0">
            <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
              このサービスは医師の診断・治療の代替ではありません。緊急時は救急車（119番）をお呼びください。
              医療情報は一般的な参考情報として提供されており、個人の医療相談には医師との直接相談をお勧めします。
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}