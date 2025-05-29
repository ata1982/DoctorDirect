import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            今すぐ始めて、安心の医療サポートを体験しよう
          </h2>
          <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
            登録は無料、わずか3分で完了。AI症状診断から専門医相談まで、すべての機能を今すぐご利用いただけます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-diagnosis" className="btn btn--large bg-white text-primary-600 hover:bg-gray-50 font-semibold">
              AI症状診断を試す
            </Link>
            <Link href="/doctor-search" className="btn btn--outline btn--large border-white text-white hover:bg-white hover:text-primary-600">
              医師を検索
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}