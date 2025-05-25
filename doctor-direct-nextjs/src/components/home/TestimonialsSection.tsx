'use client'

import { useState } from 'react'

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "田中 美咲",
      age: 32,
      location: "東京都",
      avatar: "/testimonials/tanaka.jpg",
      rating: 5,
      title: "夜中の急な症状でも安心",
      content: "子供が夜中に熱を出した時、病院が閉まっていて不安でした。Doctor DirectのAI診断で症状を入力すると、すぐに適切なアドバイスをもらえて、翌朝一番に適切な病院を紹介してもらえました。本当に助かりました。",
      date: "2024年3月15日",
      consultation: "小児科相談"
    },
    {
      id: 2,
      name: "佐藤 健一",
      age: 45,
      location: "大阪府",
      avatar: "/testimonials/sato.jpg",
      rating: 5,
      title: "専門医との相談が便利",
      content: "持病の糖尿病について、普段通っている病院以外の専門医の意見も聞きたくて利用しました。ビデオ通話での相談は思った以上にスムーズで、セカンドオピニオンとして非常に価値がありました。",
      date: "2024年2月28日",
      consultation: "内分泌科相談"
    },
    {
      id: 3,
      name: "山田 花子",
      age: 28,
      location: "神奈川県",
      avatar: "/testimonials/yamada.jpg",
      rating: 5,
      title: "忙しい中でも医療相談ができる",
      content: "仕事が忙しくて病院に行く時間がなかなか取れませんでした。Doctor Directなら自分の都合の良い時間に相談でき、通院の必要性や緊急度も教えてもらえるので、時間を有効活用できています。",
      date: "2024年4月10日",
      consultation: "一般内科相談"
    },
    {
      id: 4,
      name: "鈴木 太郎",
      age: 38,
      location: "愛知県",
      avatar: "/testimonials/suzuki.jpg",
      rating: 5,
      title: "地方でも専門医にアクセス",
      content: "地方在住で近くに専門医がいないのが悩みでした。Doctor Directを使えば、全国の専門医と相談できるので、都市部と同じレベルの医療相談を受けられます。地方格差を感じなくなりました。",
      date: "2024年1月20日",
      consultation: "整形外科相談"
    },
    {
      id: 5,
      name: "高橋 真理",
      age: 52,
      location: "北海道",
      avatar: "/testimonials/takahashi.jpg",
      rating: 5,
      title: "母の介護相談に大変助かった",
      content: "高齢の母の介護で分からないことが多く、いつも不安でした。Doctor Directでは介護に関する医療相談もでき、専門スタッフからアドバイスをもらえるので、安心して介護に取り組めています。",
      date: "2024年3月5日",
      consultation: "高齢者医療相談"
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* セクションヘッダー */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">利用者の声</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            実際にDoctor Directを利用された方々からの感想をご紹介します。
          </p>
        </div>

        {/* メインテスティモニアル */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* アバターとユーザー情報 */}
              <div className="flex-shrink-0 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-gray-600">
                  {testimonials[currentTestimonial].age}歳 • {testimonials[currentTestimonial].location}
                </p>
                <div className="flex justify-center mt-2">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* テスティモニアル内容 */}
              <div className="flex-grow">
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {testimonials[currentTestimonial].consultation}
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {testimonials[currentTestimonial].title}
                </h4>
                <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <p className="text-sm text-gray-500">
                  {testimonials[currentTestimonial].date}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">満足度</div>
          </div>
          <div className="p-6 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">4.9</div>
            <div className="text-gray-600">平均評価</div>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
            <div className="text-gray-600">平均返答時間</div>
          </div>
          <div className="p-6 bg-orange-50 rounded-xl">
            <div className="text-3xl font-bold text-orange-600 mb-2">50万+</div>
            <div className="text-gray-600">総相談件数</div>
          </div>
        </div>
      </div>
    </section>
  )
}