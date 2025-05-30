'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Goal {
  id: number
  title: string
  category: 'exercise' | 'nutrition' | 'sleep' | 'mental' | 'medical'
  target: number
  current: number
  unit: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'paused'
  progress: number
}

interface Recommendation {
  id: number
  type: 'tip' | 'exercise' | 'nutrition' | 'reminder'
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeRequired: number
  icon: string
  isCompleted: boolean
}

export default function HealthCoachPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'recommendations' | 'progress'>('dashboard')
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'exercise' as const,
    target: 0,
    unit: '',
    deadline: '',
    priority: 'medium' as const
  })

  const goals: Goal[] = [
    {
      id: 1,
      title: "毎日8000歩歩く",
      category: "exercise",
      target: 8000,
      current: 6200,
      unit: "歩",
      deadline: "2024-06-30",
      priority: "high",
      status: "active",
      progress: 77.5
    },
    {
      id: 2,
      title: "体重を5kg減らす",
      category: "nutrition",
      target: 5,
      current: 2.3,
      unit: "kg",
      deadline: "2024-08-31",
      priority: "high",
      status: "active",
      progress: 46
    },
    {
      id: 3,
      title: "毎日7時間睡眠",
      category: "sleep",
      target: 7,
      current: 6.2,
      unit: "時間",
      deadline: "2024-07-15",
      priority: "medium",
      status: "active",
      progress: 88.6
    },
    {
      id: 4,
      title: "週3回瞑想する",
      category: "mental",
      target: 3,
      current: 3,
      unit: "回/週",
      deadline: "2024-06-15",
      priority: "medium",
      status: "completed",
      progress: 100
    }
  ]

  const recommendations: Recommendation[] = [
    {
      id: 1,
      type: "exercise",
      title: "朝のストレッチルーティン",
      description: "起床後10分間の全身ストレッチで血行を促進し、1日のエネルギーを高めましょう。",
      category: "運動",
      difficulty: "easy",
      timeRequired: 10,
      icon: "🧘‍♀️",
      isCompleted: false
    },
    {
      id: 2,
      type: "nutrition",
      title: "水分補給リマインダー",
      description: "1日2リットルの水分摂取を目標に、2時間おきにコップ1杯の水を飲みましょう。",
      category: "栄養",
      difficulty: "easy",
      timeRequired: 1,
      icon: "💧",
      isCompleted: false
    },
    {
      id: 3,
      type: "tip",
      title: "階段を使う習慣",
      description: "エレベーターの代わりに階段を使って、日常的な運動量を増やしましょう。",
      category: "運動",
      difficulty: "medium",
      timeRequired: 5,
      icon: "🚶‍♂️",
      isCompleted: true
    },
    {
      id: 4,
      type: "reminder",
      title: "就寝前のスマホ断ち",
      description: "睡眠の質を向上させるため、就寝1時間前からスマホの使用を控えましょう。",
      category: "睡眠",
      difficulty: "medium",
      timeRequired: 60,
      icon: "📱",
      isCompleted: false
    }
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return '🏃‍♂️'
      case 'nutrition': return '🥗'
      case 'sleep': return '😴'
      case 'mental': return '🧠'
      case 'medical': return '💊'
      default: return '📋'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exercise': return 'bg-blue-100 text-blue-700'
      case 'nutrition': return 'bg-green-100 text-green-700'
      case 'sleep': return 'bg-purple-100 text-purple-700'
      case 'mental': return 'bg-pink-100 text-pink-700'
      case 'medical': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const activeGoals = goals.filter(goal => goal.status === 'active')
  const completedGoals = goals.filter(goal => goal.status === 'completed')
  const overallProgress = goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length

  const addNewGoal = () => {
    // 新しい目標を追加するロジック
    setShowNewGoalModal(false)
    setNewGoal({
      title: '',
      category: 'exercise',
      target: 0,
      unit: '',
      deadline: '',
      priority: 'medium'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏋️‍♂️ パーソナルヘルスコーチ
            </h1>
            <p className="text-lg text-gray-600">
              あなたの健康目標達成をサポートします
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                📊 ダッシュボード
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'goals'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                🎯 目標管理
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'recommendations'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                💡 おすすめ
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'progress'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                📈 進捗分析
              </button>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">総合進捗</h3>
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.round(overallProgress)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">アクティブ目標</h3>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {activeGoals.length}
                  </div>
                  <p className="text-sm text-gray-600">進行中の目標</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">達成済み</h3>
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {completedGoals.length}
                  </div>
                  <p className="text-sm text-gray-600">完了した目標</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">今週の成果</h3>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    12
                  </div>
                  <p className="text-sm text-gray-600">達成したタスク</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="mr-2">🎯</span>
                    今日の目標
                  </h3>
                  <div className="space-y-4">
                    {activeGoals.slice(0, 3).map(goal => (
                      <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                            <span className="font-medium">{goal.title}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {Math.round(goal.progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="mr-2">💡</span>
                    今日のおすすめ
                  </h3>
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map(rec => (
                      <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <span className="text-2xl">{rec.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{rec.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                                {rec.difficulty === 'easy' ? '簡単' : rec.difficulty === 'medium' ? '普通' : '難しい'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                ⏱️ {rec.timeRequired}分
                              </span>
                              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                                実行する
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">目標管理</h2>
                <button
                  onClick={() => setShowNewGoalModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ➕ 新しい目標を追加
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    アクティブな目標
                  </h3>
                  <div className="space-y-4">
                    {activeGoals.map(goal => (
                      <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                            <h4 className="font-medium">{goal.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                              {goal.category === 'exercise' ? '運動' : goal.category === 'nutrition' ? '栄養' : goal.category === 'sleep' ? '睡眠' : goal.category === 'mental' ? 'メンタル' : '医療'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                              {goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              進捗: {goal.current} / {goal.target} {goal.unit}
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                              {Math.round(goal.progress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>期限: {goal.deadline}</span>
                          <button 
                            onClick={() => setSelectedGoal(goal)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            詳細 →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">✅</span>
                    達成済みの目標
                  </h3>
                  <div className="space-y-4">
                    {completedGoals.map(goal => (
                      <div key={goal.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                            <h4 className="font-medium text-green-800">{goal.title}</h4>
                          </div>
                          <span className="text-green-600 font-bold">100%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-green-600">
                          <span>{goal.target} {goal.unit} 達成</span>
                          <span>🎉 完了!</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">パーソナライズされたおすすめ</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(rec => (
                  <div key={rec.id} className={`bg-white rounded-2xl shadow-lg p-6 ${rec.isCompleted ? 'opacity-75' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{rec.icon}</span>
                      {rec.isCompleted && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          完了
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{rec.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{rec.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(rec.category)}`}>
                        {rec.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                        {rec.difficulty === 'easy' ? '簡単' : rec.difficulty === 'medium' ? '普通' : '難しい'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        ⏱️ {rec.timeRequired}分
                      </span>
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          rec.isCompleted 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={rec.isCompleted}
                      >
                        {rec.isCompleted ? '完了済み' : '実行する'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">進捗分析</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-6">カテゴリ別進捗</h3>
                  <div className="space-y-4">
                    {['exercise', 'nutrition', 'sleep', 'mental'].map(category => {
                      const categoryGoals = goals.filter(g => g.category === category)
                      const avgProgress = categoryGoals.length > 0 
                        ? categoryGoals.reduce((acc, g) => acc + g.progress, 0) / categoryGoals.length 
                        : 0
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getCategoryIcon(category)}</span>
                              <span className="font-medium">
                                {category === 'exercise' ? '運動' : category === 'nutrition' ? '栄養' : category === 'sleep' ? '睡眠' : 'メンタル'}
                              </span>
                            </div>
                            <span className="font-bold text-blue-600">{Math.round(avgProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full transition-all"
                              style={{ width: `${avgProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-6">週間サマリー</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-blue-900">最も進捗の良い目標</h4>
                        <p className="text-sm text-blue-700">毎日7時間睡眠</p>
                      </div>
                      <span className="text-2xl">🏆</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-yellow-900">改善が必要な目標</h4>
                        <p className="text-sm text-yellow-700">体重を5kg減らす</p>
                      </div>
                      <span className="text-2xl">⚠️</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-green-900">今週の成果</h4>
                        <p className="text-sm text-green-700">3つの新しい習慣を開始</p>
                      </div>
                      <span className="text-2xl">🎉</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">新しい目標を追加</h3>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目標名</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="例: 毎日30分ウォーキング"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="exercise">🏃‍♂️ 運動</option>
                  <option value="nutrition">🥗 栄養</option>
                  <option value="sleep">😴 睡眠</option>
                  <option value="mental">🧠 メンタル</option>
                  <option value="medical">💊 医療</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目標値</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">単位</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                    placeholder="例: 歩、kg、時間"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">期限</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">🔴 高</option>
                  <option value="medium">🟡 中</option>
                  <option value="low">🟢 低</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={addNewGoal}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                目標を追加
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">目標詳細</h3>
              <button
                onClick={() => setSelectedGoal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-2 block">{getCategoryIcon(selectedGoal.category)}</span>
                <h4 className="text-xl font-bold mb-2">{selectedGoal.title}</h4>
                <div className="flex justify-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedGoal.category)}`}>
                    {selectedGoal.category === 'exercise' ? '運動' : selectedGoal.category === 'nutrition' ? '栄養' : selectedGoal.category === 'sleep' ? '睡眠' : selectedGoal.category === 'mental' ? 'メンタル' : '医療'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedGoal.priority)}`}>
                    {selectedGoal.priority === 'high' ? '高優先度' : selectedGoal.priority === 'medium' ? '中優先度' : '低優先度'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {Math.round(selectedGoal.progress)}%
                  </div>
                  <div className="text-sm text-gray-600">達成率</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${selectedGoal.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>現在: {selectedGoal.current} {selectedGoal.unit}</span>
                  <span>目標: {selectedGoal.target} {selectedGoal.unit}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">期限:</span>
                  <span className="font-medium">{selectedGoal.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">残り日数:</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(selectedGoal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ステータス:</span>
                  <span className={`font-medium ${selectedGoal.status === 'active' ? 'text-green-600' : 'text-blue-600'}`}>
                    {selectedGoal.status === 'active' ? '進行中' : '完了'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                  編集
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  進捗を更新
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}