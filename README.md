# 🩺 Doctor Direct - モダン医療AIプラットフォーム

> 最先端のAI技術と革新的なデザインで、未来の医療体験を提供する Next.js アプリケーション

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

## ✨ 世界最高レベルの特徴

### 🎨 **革新的なデザインシステム**
- **3Dグラスモーフィズム**: 最新のガラス風エフェクトとバックドロップブラー
- **ダイナミックグラデーション**: マウスに追従する美しいカラーアニメーション
- **フローティングアニメーション**: 滑らかな3D変形エフェクト
- **ニューモーフィズム**: 柔らかで立体的なUI要素
- **パーティクルエフェクト**: 没入感のある背景アニメーション

### ⚡ **次世代パフォーマンス**
- **GPUアクセラレーション**: 60fps の滑らかなアニメーション
- **レイジーローディング**: 必要な時だけリソース読み込み
- **高DPI対応**: Retina ディスプレイで美しく表示
- **プログレッシブ開示**: 段階的なコンテンツ表示

### 🌙 **スマートダークモード**
- **インテリジェント切り替え**: システム設定を自動検出
- **永続化**: ユーザー設定を記憶
- **アニメーション付きトグル**: 美しい切り替えエフェクト

## 🚀 **超高速セットアップ（30秒で完了）**

### **自動セットアップ（推奨）**
```bash
# リポジトリクローン
git clone https://github.com/ata1982/DoctorDirect.git
cd DoctorDirect

# 🎯 ワンクリックセットアップ実行
./setup.sh
```

### **手動セットアップ**
```bash
# 依存関係のインストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.local でAPIキーを設定

# ビルドテスト
npm run build

# 開発サーバー起動
npm run dev
```

## 🛠️ **技術スタック**

### **フロントエンド**
- **Next.js 15.3** - 最新のApp Router & React Server Components
- **TypeScript 5.8** - 型安全性とDX向上
- **React 19.1** - 最新の Concurrent Features
- **Custom CSS** - 世界クラスのデザインシステム

### **デザイン & アニメーション**
- **グラスモーフィズム** - 透明感のある美しいUI
- **3D CSS変形** - 立体感のあるインタラクション
- **カスタムアニメーション** - 滑らかで自然な動き
- **レスポンシブデザイン** - 全デバイス完全対応

### **認証 & セキュリティ**
- **NextAuth.js** - エンタープライズレベルの認証
- **OAuth 2.0** - Google & GitHub 連携
- **JWT セッション** - サーバーレス最適化

### **開発 & デプロイ**
- **ESLint + TypeScript** - コード品質保証
- **自動ビルド検証** - エラー防止システム
- **Vercel デプロイ** - 世界最速CDN
- **GitHub Actions** - CI/CD自動化

## 📱 **主要機能**

### 🤖 **AI症状診断**
- 最先端AI技術による症状分析
- リアルタイム結果表示
- 専門医との連携機能

### 👨‍⚕️ **医師相談システム**
- 認定医師とのライブチャット
- ビデオ通話対応
- 24時間サポート

### 🔍 **インテリジェント検索**
- AI駆動の医師検索
- 位置情報対応病院検索
- 専門分野フィルタリング

### 📊 **ヘルスダッシュボード**
- 個人健康データ管理
- ウェアラブル端末連携
- トレンド分析機能

## 🎯 **ユーザーエクスペリエンス**

### **即座の視覚的インパクト**
- 息を呑むような美しいヒーローセクション
- 動的な背景エフェクト
- プレミアムな質感とアニメーション

### **直感的なインタラクション**
- マイクロインタラクション搭載
- ホバーエフェクトとフィードバック
- スムーズなページ遷移

### **アクセシビリティ完備**
- WCAG 2.1 AA準拠
- キーボードナビゲーション
- スクリーンリーダー対応

## 🏗️ **プロジェクト構成**

```
Doctor Direct/
├── 🎨 app/                    # Next.js App Router
│   ├── globals.css            # グローバルスタイル（カスタムCSS）
│   ├── page.tsx               # ランディングページ
│   ├── ai-diagnosis/          # AI診断機能
│   ├── consultation/          # 医師相談
│   ├── dashboard/            # ダッシュボード
│   └── api/                  # APIエンドポイント
├── ⚛️  components/            # Reactコンポーネント
│   ├── Modern*/              # 最新デザインコンポーネント
│   ├── ui/                   # 基本UIコンポーネント
│   └── Auth*.tsx             # 認証関連
├── 📚 lib/                   # ユーティリティ
├── 🔧 types/                 # TypeScript型定義
├── 🚀 setup.sh              # 自動セットアップスクリプト
└── 📋 README.md             # このファイル
```

## 🌟 **開発コマンド**

```bash
# 🚀 開発サーバー起動
npm run dev

# 🔨 プロダクションビルド
npm run build

# 🔍 型チェック
npm run type-check

# ✅ Lintチェック
npm run lint

# 🧹 プロジェクトクリーン
npm run clean

# 📊 バンドルサイズ分析
npm run build:analyze
```

## 🚀 **デプロイ & CI/CD**

### **自動デプロイパイプライン**
1. **ローカル開発** → `git push`
2. **GitHub Actions** → 自動ビルド & テスト
3. **Vercel** → 世界最速CDNでデプロイ
4. **本番サイト** → 即座に更新

### **本番環境**
```
🌐 https://doctor-direct-delta.vercel.app/
```

## 🔐 **環境変数設定**

`.env.local` ファイルを作成：

```env
# Next.js認証
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI API キー
GOOGLE_AI_API_KEY=your-google-ai-key
OPENAI_API_KEY=your-openai-key

# OAuth設定（オプション）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# データベース（オプション）
DATABASE_URL="file:./dev.db"
```

## 🎨 **デザインシステム詳細**

### **カラーパレット**
- **プライマリー**: Blue (#4f46e5) → Purple (#7c3aed)
- **セカンダリー**: Pink (#ec4899) → Red (#ef4444)
- **アクセント**: Cyan (#06b6d4) → Teal (#14b8a6)

### **アニメーション仕様**
- **イージング**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **持続時間**: 200ms〜800ms
- **フレームレート**: 60fps保証

### **レスポンシブブレークポイント**
- **モバイル**: 0px - 767px
- **タブレット**: 768px - 1023px
- **デスクトップ**: 1024px - 1535px
- **大画面**: 1536px+

## 🧪 **テスト & 品質保証**

```bash
# テスト実行
npm test

# カバレッジ確認
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

## 🔧 **トラブルシューティング**

### **ビルドエラー**
```bash
# 依存関係リセット
rm -rf node_modules package-lock.json
npm install

# ビルドキャッシュクリア
npm run clean
npm run build
```

### **開発サーバー問題**
```bash
# ポート変更
npm run dev -- -p 3001

# 型チェック実行
npm run type-check
```

## 🤝 **コントリビューション**

1. **Fork** このリポジトリ
2. **Feature Branch** 作成 (`git checkout -b feature/amazing-feature`)
3. **Commit** 変更 (`git commit -m 'Add amazing feature'`)
4. **Push** ブランチ (`git push origin feature/amazing-feature`)
5. **Pull Request** 作成

## 📄 **ライセンス**

このプロジェクトは ISC ライセンスの下で公開されています。

## 🙏 **謝辞**

- **Next.js チーム** - 素晴らしいフレームワーク
- **Vercel** - 最高のデプロイプラットフォーム
- **React チーム** - 革新的なライブラリ
- **TypeScript チーム** - 型安全性の向上

---

<div align="center">

### 🌟 **Doctor Direct で未来の医療体験を今すぐ始めましょう！**

**[🚀 今すぐ試す](https://doctor-direct-delta.vercel.app/) • [📖 ドキュメント](#) • [💬 サポート](#)**

</div>