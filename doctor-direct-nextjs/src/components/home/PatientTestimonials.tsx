import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: '田中 美香',
    age: 35,
    rating: 5,
    comment: '迅速で丁寧な対応でした。オンライン診療でも安心して相談できました。',
    specialty: '内科'
  },
  {
    id: 2,
    name: '佐藤 健太',
    age: 42,
    rating: 5,
    comment: '忙しい中でも24時間予約できるのが助かります。先生も親切でした。',
    specialty: '整形外科'
  },
  {
    id: 3,
    name: '山田 花子',
    age: 28,
    rating: 4,
    comment: '子育て中でも自宅から相談できて本当に便利です。',
    specialty: '小児科'
  }
]

export default function PatientTestimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            患者様の声
          </h2>
          <p className="text-gray-600 text-lg">
            実際にご利用いただいた患者様からの評価
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-blue-600 mr-3" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.comment}"
              </p>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.age}歳 • {testimonial.specialty}受診</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            もっと見る
          </button>
        </div>
      </div>
    </section>
  )
}