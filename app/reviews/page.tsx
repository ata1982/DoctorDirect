'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Search, ThumbsUp, Repeat2, Bot, Brain, Twitter, Globe, Hospital, AlertCircle } from 'lucide-react';

interface AIReviewResponse {
  success: boolean;
  query: string;
  provider: string;
  reviews: string;
  timestamp: string;
  error?: string;
}

interface ParsedReview {
  id: string;
  rating: number;
  reviewer: string;
  comment: string;
  rawText: string;
}

interface HospitalSearchResponse {
  success: boolean;
  hospitalName: string;
  searchType: string;
  results: string;
  timestamp: string;
  error?: string;
}

interface ParsedTwitterPost {
  id: string;
  username: string;
  content: string;
  likes: number;
  retweets: number;
  date: string;
}

interface ParsedWebReview {
  id: string;
  siteName: string;
  rating: number;
  reviewer: string;
  date: string;
  review: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ParsedReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('新宿の内科クリニック');
  const [activeProvider, setActiveProvider] = useState<'gemini' | 'grok'>('gemini');
  const [rawResponse, setRawResponse] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [error, setError] = useState<string>('');

  // 駒込病院専用の検索結果
  const [hospitalSearchResults, setHospitalSearchResults] = useState<ParsedTwitterPost[] | ParsedWebReview[]>([]);
  const [hospitalSearchType, setHospitalSearchType] = useState<'twitter' | 'web'>('twitter');
  const [hospitalSearchLoading, setHospitalSearchLoading] = useState(false);
  const [hospitalName, setHospitalName] = useState('駒込病院');
  const [hospitalRawResponse, setHospitalRawResponse] = useState('');
  const [hospitalError, setHospitalError] = useState<string>('');

  // AIレビューを解析して構造化データに変換
  const parseAIReviews = (reviewText: string): ParsedReview[] => {
    try {
      const reviewBlocks = reviewText.split(/レビュー\d+:/);
      const parsedReviews: ParsedReview[] = [];

      reviewBlocks.forEach((block, index) => {
        if (!block.trim()) return;

        const lines = block.trim().split('\n').filter(line => line.trim());
        let rating = 3;
        let reviewer = '匿名ユーザー';
        let comment = '';

        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.includes('評価:') || trimmedLine.includes('★')) {
            // 星の数をカウント
            const stars = (trimmedLine.match(/★/g) || []).length;
            if (stars > 0) rating = stars;
            
            // 数字での評価も抽出
            const numberMatch = trimmedLine.match(/(\d+)\/5/);
            if (numberMatch) rating = parseInt(numberMatch[1]);
          } else if (trimmedLine.includes('レビュアー:') || trimmedLine.includes('投稿者:')) {
            reviewer = trimmedLine.replace(/^(レビュアー:|投稿者:)\s*/, '');
          } else if (trimmedLine.includes('コメント:')) {
            comment = trimmedLine.replace(/^コメント:\s*/, '');
          } else if (!trimmedLine.includes('評価:') && !trimmedLine.includes('レビュアー:') && trimmedLine.length > 10) {
            // 長いテキストはコメントとして扱う
            if (!comment) comment = trimmedLine;
          }
        });

        if (comment) {
          parsedReviews.push({
            id: `review-${index}`,
            rating,
            reviewer,
            comment,
            rawText: block.trim()
          });
        }
      });

      return parsedReviews;
    } catch (parseError) {
      console.error('Review parsing error:', parseError);
      return [];
    }
  };

  const fetchAIReviews = async (query: string, provider: 'gemini' | 'grok') => {
    setLoading(true);
    setLastQuery(query);
    setError('');
    
    try {
      const response = await fetch(`/api/reviews?query=${encodeURIComponent(query)}&provider=${provider}`, {
        signal: AbortSignal.timeout(30000) // 30秒タイムアウト
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: AIReviewResponse = await response.json();

      if (data.success) {
        setRawResponse(data.reviews);
        const parsedReviews = parseAIReviews(data.reviews);
        setReviews(parsedReviews);
      } else {
        const errorMessage = data.error || 'AIレビュー生成に失敗しました';
        setError(errorMessage);
        setRawResponse(errorMessage);
        setReviews([]);
      }
    } catch (networkError) {
      const errorMessage = networkError instanceof Error ? 
        `ネットワークエラー: ${networkError.message}` : 
        'ネットワークエラーが発生しました';
      setError(errorMessage);
      setRawResponse(errorMessage);
      setReviews([]);
      console.error('Network error:', networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchAIReviews(searchQuery, activeProvider);
    }
  };

  // デモ用のサンプル検索
  const sampleQueries = [
    '東京駅周辺の総合病院',
    '渋谷の皮膚科クリニック',
    '横浜の小児科',
    '大阪の歯科医院',
    '名古屋の眼科'
  ];

  const handleSampleQuery = (query: string) => {
    setSearchQuery(query);
    fetchAIReviews(query, activeProvider);
  };

  // Twitter投稿を解析
  const parseTwitterPosts = (responseText: string): ParsedTwitterPost[] => {
    try {
      const posts: ParsedTwitterPost[] = [];
      const twitterBlocks = responseText.split(/Twitter投稿\d+:/);
      
      twitterBlocks.forEach((block, index) => {
        if (!block.trim()) return;
        
        const lines = block.trim().split('\n').filter(line => line.trim());
        let username = '';
        let content = '';
        let likes = 0;
        let retweets = 0;
        let date = '';
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('@')) {
            const match = trimmedLine.match(/@([^:]+):\s*(.+)/);
            if (match) {
              username = match[1];
              content = match[2];
            }
          } else if (trimmedLine.includes('いいね:')) {
            const likeMatch = trimmedLine.match(/いいね:\s*(\d+)/);
            const rtMatch = trimmedLine.match(/RT:\s*(\d+)/);
            const dateMatch = trimmedLine.match(/投稿日:\s*([^\n]+)/);
            
            if (likeMatch) likes = parseInt(likeMatch[1]);
            if (rtMatch) retweets = parseInt(rtMatch[1]);
            if (dateMatch) date = dateMatch[1];
          }
        });
        
        if (username && content) {
          posts.push({
            id: `twitter-${index}`,
            username,
            content,
            likes,
            retweets,
            date
          });
        }
      });
      
      return posts;
    } catch (parseError) {
      console.error('Twitter parsing error:', parseError);
      return [];
    }
  };

  // ウェブレビューを解析
  const parseWebReviews = (responseText: string): ParsedWebReview[] => {
    try {
      const reviews: ParsedWebReview[] = [];
      const webBlocks = responseText.split(/ウェブ評価\d+:/);
      
      webBlocks.forEach((block, index) => {
        if (!block.trim()) return;
        
        const lines = block.trim().split('\n').filter(line => line.trim());
        let siteName = '';
        let rating = 3;
        let reviewer = '';
        let date = '';
        let review = '';
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.includes('サイト名:')) {
            siteName = trimmedLine.replace(/^サイト名:\s*/, '');
          } else if (trimmedLine.includes('評価:')) {
            const ratingMatch = trimmedLine.match(/(\d+\.\d+)\/5/);
            if (ratingMatch) rating = parseFloat(ratingMatch[1]);
          } else if (trimmedLine.includes('レビュアー:')) {
            reviewer = trimmedLine.replace(/^レビュアー:\s*/, '');
          } else if (trimmedLine.includes('投稿日:')) {
            date = trimmedLine.replace(/^投稿日:\s*/, '');
          } else if (trimmedLine.includes('詳細レビュー:')) {
            review = trimmedLine.replace(/^詳細レビュー:\s*/, '');
          }
        });
        
        if (siteName && review) {
          reviews.push({
            id: `web-${index}`,
            siteName,
            rating,
            reviewer,
            date,
            review
          });
        }
      });
      
      return reviews;
    } catch (parseError) {
      console.error('Web review parsing error:', parseError);
      return [];
    }
  };

  // 病院検索を実行
  const searchHospital = async (type: 'twitter' | 'web') => {
    setHospitalSearchLoading(true);
    setHospitalSearchType(type);
    setHospitalError('');
    
    try {
      const response = await fetch(
        `/api/hospital-search?hospital=${encodeURIComponent(hospitalName)}&type=${type}`,
        {
          signal: AbortSignal.timeout(60000) // 60秒タイムアウト（Grok3は時間がかかるため）
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: HospitalSearchResponse = await response.json();
      
      if (data.success) {
        setHospitalRawResponse(data.results);
        
        if (type === 'twitter') {
          const parsedPosts = parseTwitterPosts(data.results);
          setHospitalSearchResults(parsedPosts);
        } else {
          const parsedReviews = parseWebReviews(data.results);
          setHospitalSearchResults(parsedReviews);
        }
      } else {
        const errorMessage = data.error || '病院検索に失敗しました';
        setHospitalError(errorMessage);
        setHospitalRawResponse(errorMessage);
        setHospitalSearchResults([]);
      }
    } catch (searchError) {
      const errorMessage = searchError instanceof Error ? 
        `検索エラー: ${searchError.message}` : 
        '病院検索でエラーが発生しました';
      setHospitalError(errorMessage);
      setHospitalRawResponse(errorMessage);
      setHospitalSearchResults([]);
      console.error('Hospital search error:', searchError);
    } finally {
      setHospitalSearchLoading(false);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🤖 AI医療レビュー生成システム</h1>
          <p className="text-xl text-gray-600 mb-6">
            Google Gemini & xAI Grok3を活用したリアルタイムレビュー生成
          </p>
        </div>

        {/* 駒込病院専用検索セクション */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Hospital className="w-6 h-6" />
              駒込病院 評価検索 (Grok3専用)
            </CardTitle>
            <CardDescription className="text-blue-600">
              xAI Grok3を使用してTwitter/X上とウェブ上での駒込病院の評価を検索します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 病院名入力 */}
            <div className="flex gap-2">
              <Input
                placeholder="病院名を入力..."
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* 検索タイプ選択と実行 */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => searchHospital('twitter')}
                disabled={hospitalSearchLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Twitter className="w-4 h-4" />
                Twitter/X検索
              </Button>
              <Button
                onClick={() => searchHospital('web')}
                disabled={hospitalSearchLoading}
                variant="outline"
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Globe className="w-4 h-4" />
                ウェブ検索
              </Button>
            </div>

            {/* エラー表示 */}
            {hospitalError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">エラー</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{hospitalError}</p>
                </CardContent>
              </Card>
            )}

            {/* ローディング状態 */}
            {hospitalSearchLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-blue-600">
                  Grok3で{hospitalSearchType === 'twitter' ? 'Twitter/X' : 'ウェブ'}検索中...
                  <br />
                  <span className="text-xs text-blue-500">
                    (処理時間: 約{hospitalSearchType === 'twitter' ? '6-9' : '5-8'}秒)
                  </span>
                </p>
              </div>
            )}

            {/* Twitter検索結果 */}
            {hospitalSearchType === 'twitter' && hospitalSearchResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-blue-800 flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter/X上の{hospitalName}に関する投稿
                </h4>
                {hospitalSearchResults.map((post) => (
                  <Card key={post.id} className="border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Twitter className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-blue-700">@{(post as ParsedTwitterPost).username}</span>
                            <span className="text-sm text-gray-500">{post.date}</span>
                          </div>
                          <p className="text-gray-800 mb-2">{(post as ParsedTwitterPost).content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {(post as ParsedTwitterPost).likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Repeat2 className="w-3 h-3" />
                              {(post as ParsedTwitterPost).retweets}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* ウェブ検索結果 */}
            {hospitalSearchType === 'web' && hospitalSearchResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-blue-800 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  ウェブ上の{hospitalName}の評価
                </h4>
                {(hospitalSearchResults as ParsedWebReview[]).map((review) => (
                  <Card key={review.id} className="border-l-4 border-l-green-400">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-600">{review.siteName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderRating(Math.round(review.rating))}
                            <span className="text-sm text-gray-500">({review.rating}/5.0)</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-800 mb-2">{review.review}</p>
                      <p className="text-sm text-gray-600">投稿者: {review.reviewer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* 生の応答表示（デバッグ用） */}
            {hospitalRawResponse && !hospitalError && (
              <details className="mt-4">
                <summary className="text-sm text-blue-600 cursor-pointer">生の応答を表示（デバッグ用）</summary>
                <pre className="text-xs bg-gray-50 p-3 rounded mt-2 overflow-auto max-h-40 border">
                  {hospitalRawResponse}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>

        {/* AIプロバイダー選択 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeProvider === 'gemini' ? 'default' : 'outline'}
                  onClick={() => setActiveProvider('gemini')}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Google Gemini
                </Button>
                <Button
                  variant={activeProvider === 'grok' ? 'default' : 'outline'}
                  onClick={() => setActiveProvider('grok')}
                  className="flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  xAI Grok3
                </Button>
              </div>

              {/* 検索バー */}
              <div className="flex gap-2">
                <Input
                  placeholder="医療機関名や地域を入力..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  生成
                </Button>
              </div>

              {/* サンプルクエリ */}
              <div>
                <p className="text-sm text-gray-600 mb-2">サンプル検索:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQueries.map((query) => (
                    <Button
                      key={query}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleQuery(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* エラー表示 */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">エラーが発生しました</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* ローディング状態 */}
        {loading && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {activeProvider === 'gemini' ? 'Google Gemini' : 'xAI Grok3'}でレビューを生成中...
                <br />
                <span className="text-sm text-gray-500">
                  (処理時間: 約10-30秒)
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* 結果表示 */}
        {lastQuery && !error && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeProvider === 'gemini' ? <Brain className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                検索結果: {lastQuery}
              </CardTitle>
              <CardDescription>
                AI: {activeProvider === 'gemini' ? 'Google Gemini' : 'xAI Grok3'} | 
                生成レビュー数: {reviews.length}件
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* パースされたレビュー一覧 */}
        {reviews.length > 0 && (
          <div className="grid gap-6 mb-8">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{lastQuery}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {renderRating(review.rating)}
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {activeProvider === 'gemini' ? <Brain className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                          AI生成
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    投稿者: {review.reviewer}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 生の応答表示（デバッグ用） */}
        {rawResponse && !error && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm">AI生レスポンス（デバッグ用）</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-60">
                {rawResponse}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>AI活用レビューシステムについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-2">Google Gemini</h4>
                  <p className="text-gray-600">
                    Googleの最新AI技術を活用して、医療機関のレビューを生成します。
                    高品質で詳細な評価コメントが特徴です。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bot className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-2">xAI Grok3</h4>
                  <p className="text-gray-600">
                    xAIのGrok3を活用して、よりカジュアルで実用的な口コミ風レビューを生成します。
                    Twitter/X上の口コミ風な内容が特徴です。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong> これらのレビューはAIによって生成された架空のものです。
                実際の医療機関選択の際は、公式情報や実際の口コミサイトもご確認ください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}