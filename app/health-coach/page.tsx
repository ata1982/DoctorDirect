'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Activity, 
  Apple, 
  Moon, 
  Brain, 
  Target,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  Clock
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getHealthCoachAdvice } from '@/lib/ai-client'

export default function HealthCoachPage() {
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState<string>('nutrition')
  const [advice, setAdvice] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState({
    age: 30,
    goals: ['体重減少', '体力向上'],
    currentHealth: '良好',
    preferences: ['野菜中心', '週3回運動']
  })

  const categories = [
    {
      id: 'nutrition',
      name: '栄養指導',
      icon: Apple,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'バランスの取れた食事プランを提案'
    },
    {
      id: 'exercise',
      name: '運動指導',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: '効果的なエクササイズプログラム'
    },
    {
      id: 'sleep',
      name: '睡眠改善',
      icon: Moon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: '質の良い睡眠のためのアドバイス'
    },
    {
      id: 'stress',
      name: 'ストレス管理',
      icon: Brain,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'メンタルヘルスとストレス対処法'
    },
    {
      id: 'medication',
      name: '服薬管理',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: '薬の適切な管理方法'
    }
  ]

  const getAdvice = async (category: string) => {
    setLoading(true)
    try {
      const result = await getHealthCoachAdvice(
        category as any,
        userProfile
      )
      setAdvice(result)
    } catch (error) {
      console.error('Health coach advice error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAdvice(selectedCategory)
  }, [selectedCategory])

  const achievements = [
    {
      title: '7日連続記録',
      description: '健康データを7日間連続で記録しました',
      icon: Award,
      earned: true,
      date: '2024年3月15日'
    },
    {
      title: '目標達成',
      description: '今月の運動目標を達成しました',
      icon: Target,
      earned: true,
      date: '2024年3月10日'
    },
    {
      title: '健康改善',
      description: '血圧が正常範囲に改善されました',
      icon: TrendingUp,
      earned: false,
      date: null
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI健康コーチ
            </h1>
            <p className="text-gray-600">
              あなた専用の健康アドバイザーが最適な健康管理をサポートします
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* カテゴリ選択 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">コーチングカテゴリ</h2>
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedCategory === category.id
                          ? 'ring-2 ring-blue-500 shadow-md'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${category.bgColor}`}>
                            <Icon className={`w-5 h-5 ${category.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            <p className="text-xs text-gray-600">{category.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* メインコンテンツ */}
            <div className="lg:col-span-3 space-y-6">
              {/* AI アドバイス */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    AI健康アドバイス
                    <Badge variant="info" className="ml-2">個人化</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">アドバイスを生成中...</span>
                    </div>
                  ) : advice ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          {categories.find(c => c.id === selectedCategory)?.name}アドバイス
                        </h3>
                        <p className="text-blue-800">{advice.advice}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">推奨アクション</h4>
                        <div className="space-y-2">
                          {advice.actionItems?.map((item: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">目標設定</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {advice.goals?.map((goal: string, index: number) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4 text-indigo-600" />
                                <span className="text-gray-800">{goal}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            推奨期間: {advice.timeline}
                          </span>
                        </div>
                        <Button size="sm">
                          カレンダーに追加
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">カテゴリを選択してアドバイスを受け取りましょう</p>
                  )}
                </CardContent>
              </Card>

              {/* 進捗トラッキング */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    進捗トラッキング
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Apple className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">栄養</span>
                      </div>
                      <div className="text-2xl font-bold text-green-800">85%</div>
                      <p className="text-sm text-green-700">今週の目標達成率</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">運動</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-800">3/5</div>
                      <p className="text-sm text-blue-700">今週の運動回数</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Moon className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900">睡眠</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-800">7.2h</div>
                      <p className="text-sm text-purple-700">平均睡眠時間</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 達成バッジ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-600" />
                    健康達成バッジ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            achievement.earned
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <Icon className={`w-6 h-6 ${
                              achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                            }`} />
                            <h4 className={`font-medium ${
                              achievement.earned ? 'text-yellow-900' : 'text-gray-600'
                            }`}>
                              {achievement.title}
                            </h4>
                          </div>
                          <p className={`text-sm ${
                            achievement.earned ? 'text-yellow-800' : 'text-gray-500'
                          }`}>
                            {achievement.earned ? achievement.description : '未達成'}
                          </p>
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-yellow-600 mt-2">
                              獲得日: {achievement.date}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}