import React from 'react'
import { Heart, Shield, Clock, Users } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: '信頼できる医師',
    description: '厳選された専門医師のみを掲載しています'
  },
  {
    icon: Shield,
    title: '安全な診療',
    description: 'プライバシー保護と安全な医療環境を提供'
  },
  {
    icon: Clock,
    title: '24時間予約',
    description: 'いつでもどこでも簡単に予約が可能'
  },
  {
    icon: Users,
    title: '実績豊富',
    description: '多くの患者様に選ばれている実績'
  }
]

export default function FeatureHighlights() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Doctor Directの特徴
          </h2>
          <p className="text-gray-600 text-lg">
            安心して医療相談ができる理由
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}