'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface HealthTip {
  id: number
  category: string
  title: string
  description: string
  icon: string
  urgency: 'low' | 'medium' | 'high'
}

interface AICoachSession {
  id: number
  date: string
  goal: string
  progress: number
  nextAction: string
}

export default function HealthCoachPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [userGoals, setUserGoals] = useState({
    weight: 70,
    exercise: 30,
    sleep: 8,
    water: 2000
  })

  const categories = [
    { value: 'all', label: '全て', icon: '🎯' },
    { value: 'nutrition', label: '栄養', icon: '🥗' },
    { value: 'exercise', label: '運動', icon: '🏃‍♂️' },
    { value: 'sleep', label: '睡眠', icon: '😴' },
    { value: 'mental', label: 'メンタル', icon: '🧠' },
    { value: 'prevention', label: '予防', icon: '🛡️' }
  ]

  const healthTips: HealthTip[] = [
    {
      id: 1,
      category: 'nutrition',
      title: '1日の水分摂取量を増やしましょう',
      description: '現在の摂取量が目標を下回っています。水分不足は頭痛や疲労の原因となります。',
      icon: '💧',
      urgency: 'medium'
    },
    {
      id: 2,
      category: 'exercise',
      title: '軽いストレッチから始めましょう',
      description: '運動不足解消のため、まずは10分間のストレッチから始めることをお勧めします。',
      icon: '🤸‍♀️',
      urgency: 'low'
    },
    {
      id: 3,
      category: 'sleep',
      title: '就寝時間を30分早めることをお勧めします',
      description: '睡眠の質を向上させるため、就寝時間を早めて7-8時間の睡眠を確保しましょう。',
      icon: '🌙',
      urgency: 'high'
    },
    {
      id: 4,
      category: 'mental',
      title: '深呼吸とマインドフルネス',
      description: 'ストレス軽減のため、1日5分間の深呼吸や瞑想を取り入れてみてください。',
      icon: '🧘‍♀️',
      urgency: 'medium'
    }
  ]

  const coachSessions: AICoachSession[] = [
    {
      id: 1,
      date: '2024-05-28',
      goal: '体重管理',
      progress: 75,
      nextAction: '週3回の有酸素運動を継続'
    },
    {
      id: 2,
      date: '2024-05-25',
      goal: '睡眠改善',
      progress: 60,
      nextAction: 'スマートフォンの使用を就寝1時間前に停止'
    }
  ]

  const filteredTips = activeCategory === 'all' 
    ? healthTips 
    : healthTips.filter(tip => tip.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI健康コーチ</h1>
            <p className="text-lg text-gray-600">
              あなた専用のパーソナライズされた健康アドバイスと目標管理
            </p>
          </div>

          {/* 健康スコアダッシュボード */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">今日の健康スコア</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">運動</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <p className="text-sm text-gray-600">45/100</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🥗</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">栄養</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <p className="text-sm text-gray-600">75/100</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">😴</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">睡眠</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <p className="text-sm text-gray-600">6.5時間</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">メンタル</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
                <p className="text-sm text-gray-600">良好</p>
              </div>
            </div>
          </div>

          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === category.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* AIからの健康アドバイス */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">今日のパーソナライズアドバイス</h2>
            <div className="grid gap-6">
              {filteredTips.map((tip) => (
                <div key={tip.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        tip.urgency === 'high' ? 'bg-red-100' :
                        tip.urgency === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        {tip.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                        <p className="text-gray-600 mb-3">{tip.description}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            tip.urgency === 'high' ? 'bg-red-100 text-red-800' :
                            tip.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {tip.urgency === 'high' ? '高優先度' :
                             tip.urgency === 'medium' ? '中優先度' : '低優先度'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {categories.find(c => c.value === tip.category)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        実行する
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        後で
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 目標設定と進捗 */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">健康目標設定</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目標体重 (kg)
                  </label>
                  <input
                    type="number"
                    value={userGoals.weight}
                    onChange={(e) => setUserGoals({...userGoals, weight: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日々の運動時間 (分)
                  </label>
                  <input
                    type="number"
                    value={userGoals.exercise}
                    onChange={(e) => setUserGoals({...userGoals, exercise: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目標睡眠時間 (時間)
                  </label>
                  <input
                    type="number"
                    value={userGoals.sleep}
                    onChange={(e) => setUserGoals({...userGoals, sleep: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    水分摂取目標 (ml)
                  </label>
                  <input
                    type="number"
                    value={userGoals.water}
                    onChange={(e) => setUserGoals({...userGoals, water: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  目標を更新
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">AIコーチセッション履歴</h3>
              <div className="space-y-4">
                {coachSessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{session.goal}</h4>
                      <span className="text-sm text-gray-500">{session.date}</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">進捗</span>
                        <span className="text-sm font-medium text-gray-900">{session.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{width: `${session.progress}%`}}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>次のアクション:</strong> {session.nextAction}
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                新しいセッション開始
              </button>
            </div>
          </div>

          {/* AIチャット機能 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">AIヘルスコーチに相談</h3>
            <div className="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    AI
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-gray-800">
                      こんにちは！今日の体調はいかがですか？何か気になることがあれば、お気軽にご相談ください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="健康に関する質問や相談を入力してください..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                送信
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}