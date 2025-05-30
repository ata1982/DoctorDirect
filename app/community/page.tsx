'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
    condition: string
    joinDate: string
  }
  title: string
  content: string
  category: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
  tags: string[]
}

interface SupportGroup {
  id: string
  name: string
  description: string
  memberCount: number
  category: string
  isJoined: boolean
  lastActivity: string
  moderator: string
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'groups' | 'my-posts'>('posts')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: {
        name: '田中さん',
        avatar: '👩',
        condition: '糖尿病',
        joinDate: '2024-01-15'
      },
      title: '血糖値管理の工夫について',
      content: '最近、血糖値の管理がうまくいくようになりました。朝の散歩を習慣にしたのが大きな変化だと思います。皆さんはどのような工夫をされていますか？',
      category: '糖尿病',
      timestamp: '2025-05-30T09:30:00',
      likes: 12,
      comments: 8,
      isLiked: false,
      tags: ['血糖値', '運動', '生活習慣']
    },
    {
      id: '2',
      author: {
        name: '佐藤さん',
        avatar: '👨',
        condition: '高血圧',
        joinDate: '2023-11-20'
      },
      title: '減塩レシピのシェア',
      content: '高血圧の治療で減塩を心がけています。美味しい減塩レシピを見つけたので、皆さんにもシェアしたいと思います。',
      category: '高血圧',
      timestamp: '2025-05-29T18:45:00',
      likes: 25,
      comments: 15,
      isLiked: true,
      tags: ['減塩', 'レシピ', '食事療法']
    }
  ])

  const [supportGroups] = useState<SupportGroup[]>([
    {
      id: '1',
      name: '糖尿病サポートグループ',
      description: '糖尿病患者同士で情報交換や励まし合いを行うグループです',
      memberCount: 245,
      category: '糖尿病',
      isJoined: true,
      lastActivity: '2025-05-30T10:15:00',
      moderator: '医師 山田先生'
    },
    {
      id: '2',
      name: '高血圧改善の会',
      description: '高血圧の予防・改善に関する情報共有グループ',
      memberCount: 189,
      category: '高血圧',
      isJoined: false,
      lastActivity: '2025-05-30T08:30:00',
      moderator: '栄養士 鈴木さん'
    },
    {
      id: '3',
      name: 'がん患者支援グループ',
      description: 'がんと向き合う患者とご家族のための支援グループ',
      memberCount: 156,
      category: 'がん',
      isJoined: false,
      lastActivity: '2025-05-29T20:00:00',
      moderator: '心理カウンセラー 田中先生'
    }
  ])

  const categories = ['all', '糖尿病', '高血圧', 'がん', '心疾患', 'メンタルヘルス', 'その他']

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return '1時間以内'
    if (diffHours < 24) return `${diffHours}時間前`
    return `${Math.floor(diffHours / 24)}日前`
  }

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🤝 コミュニティ</h1>
            <p className="text-lg text-gray-600">
              同じ悩みを持つ仲間と情報交換し、支え合いましょう
            </p>
          </div>

          {/* タブナビゲーション */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'posts' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                📝 投稿一覧
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'groups' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                👥 サポートグループ
              </button>
              <button
                onClick={() => setActiveTab('my-posts')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'my-posts' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                📄 マイ投稿
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* メインコンテンツ */}
            <div className="lg:col-span-3">
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {/* カテゴリフィルター */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">カテゴリで絞り込み</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category === 'all' ? 'すべて' : category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 投稿リスト */}
                  <div className="space-y-6">
                    {filteredPosts.map(post => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{post.author.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                {post.author.condition}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {formatTimeAgo(post.timestamp)}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
                            <p className="text-gray-700 mb-4">{post.content}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              <button 
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center space-x-1 ${
                                  post.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                }`}
                              >
                                <span>{post.isLiked ? '❤️' : '🤍'}</span>
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                                <span>💬</span>
                                <span className="text-sm">{post.comments}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                                <span>📤</span>
                                <span className="text-sm">シェア</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'groups' && (
                <div className="space-y-6">
                  {supportGroups.map(group => (
                    <div key={group.id} className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                          <p className="text-gray-600 text-sm">{group.description}</p>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg font-medium ${
                            group.isJoined
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {group.isJoined ? '参加済み' : '参加する'}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>👥 {group.memberCount}人のメンバー</span>
                        <span>モデレーター: {group.moderator}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                          最終活動: {formatTimeAgo(group.lastActivity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'my-posts' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">投稿がありません</h3>
                  <p className="text-gray-600 mb-6">初めての投稿をしてコミュニティに参加しましょう</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                    新しい投稿を作成
                  </button>
                </div>
              )}
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* 投稿作成 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✏️ 新しい投稿</h3>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                  投稿を作成
                </button>
              </div>

              {/* 人気のトピック */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 人気のトピック</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#血糖値管理</span>
                    <span className="text-xs text-gray-500">42投稿</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#減塩レシピ</span>
                    <span className="text-xs text-gray-500">38投稿</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#運動療法</span>
                    <span className="text-xs text-gray-500">29投稿</span>
                  </div>
                </div>
              </div>

              {/* コミュニティルール */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">📋 コミュニティルール</h3>
                <div className="text-sm text-yellow-700 space-y-2">
                  <p>• 相手を尊重し、思いやりのある投稿を心がけましょう</p>
                  <p>• 医学的なアドバイスは医師に相談してください</p>
                  <p>• 個人情報の投稿は避けてください</p>
                  <p>• 不適切な投稿は削除される場合があります</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}