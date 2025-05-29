# Doctor Direct プロジェクト

このプロジェクトは、Next.js製のフロントエンドアプリケーションとTailwind CSSで構成されたモダンな医療相談プラットフォームです。

## 技術スタック

### フロントエンド
- Next.js 15.x (App Router)
- TypeScript
- Tailwind CSS 4.x
- React 19.x

### 認証・セキュリティ
- NextAuth.js (OAuth認証)
- Google OAuth 2.0
- GitHub OAuth
- JWT セッション管理

### インフラ・デプロイ
- Vercel (ホスティング)
- GitHub Actions (CI/CD)

## セットアップ

プロジェクトのセットアップ手順：

```bash
# 依存関係のインストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.local を編集して必要な値を設定

# 開発サーバーの起動
npm run dev
```

## 起動方法

### 🚀 開発環境

```bash
npm run dev
```

開発サーバーは `http://localhost:3000` で利用可能になります。

### 📦 その他のコマンド

```bash
# Next.jsのビルド
npm run build

# 本番環境での起動
npm start

# ESLintチェック
npm run lint
```

## 🔐 認証機能

このプロジェクトには **NextAuth.js** による認証機能が統合されています：

### サポート認証方式
- **Google OAuth** - Googleアカウントでログイン
- **GitHub OAuth** - GitHubアカウントでログイン
- **JWT セッション** - サーバーレス環境に最適化

### 認証の設定

#### 環境変数 (.env.local)
```bash
# NextAuth.js 必須設定
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (オプション)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (オプション)  
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

#### OAuth アプリの設定
認証を有効にするには、各プロバイダーでOAuthアプリを作成する必要があります：

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

**GitHub OAuth:**
1. GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 🚀 自動デプロイ設定

このプロジェクトは **VSCode → GitHub → Vercel** の完全自動デプロイパイプラインを構築済みです。

### ✅ 設定状況

#### ファイル構成
- [x] `.github/workflows/deploy.yml` - GitHub Actions ワークフロー
- [x] `vercel.json` - Vercel設定ファイル（Next.js最適化済み）
- [x] `next.config.js` - Next.js設定（Vercel対応）
- [x] `package.json` - ビルドスクリプト設定済み
- [x] **NextAuth.js認証機能** - Google/GitHub OAuth対応
- [x] **環境変数設定** - Vercelデータ取得済み

#### ✅ Vercel API情報取得済み
- [x] Vercel API Token: `fps9igcLXnBXi6QjlAZLXReB`
- [x] Vercel Project ID: `prj_udZpAmo6gFxhc9OLYEKUrIIoXSD6`
- [x] Vercel Org ID: `team_x1yX5LGP9hQd14xqyuHkFZEj`
- [x] 本番URL: `https://doctor-direct-delta.vercel.app/`

### 必要な手順

#### 🚨 GitHub Secrets設定（要実行）
GitHub Repository → Settings → Secrets and variables → Actions で以下を設定：

```
VERCEL_TOKEN=fps9igcLXnBXi6QjlAZLXReB
VERCEL_PROJECT_ID=prj_udZpAmo6gFxhc9OLYEKUrIIoXSD6
VERCEL_ORG_ID=team_x1yX5LGP9hQd14xqyuHkFZEj
NEXTAUTH_SECRET=tbeORFbiad6z+HIjK4M8n9u3VgysNbHcK4pCvTcy6X4=
NEXTAUTH_URL=https://doctor-direct-delta.vercel.app/
```

#### ✅ Vercel Dashboard環境変数設定済み
Vercel Dashboard → Settings → Environment Variables で設定済み：
- `NODE_ENV=production`
- `NEXTAUTH_URL=https://doctor-direct-delta.vercel.app/`
- `NEXTAUTH_SECRET=tbeORFbiad6z+HIjK4M8n9u3VgysNbHcK4pCvTcy6X4=`

#### OAuth アプリ設定（認証を有効にする場合）

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect URIs: `https://doctor-direct-delta.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
1. GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Authorization callback URL: `https://doctor-direct-delta.vercel.app/api/auth/callback/github`

## 🔄 日常の開発フロー

```bash
# 1. ローカル開発
npm run dev

# 2. 変更をコミット&プッシュ
git add .
git commit -m "feat: 新機能追加"
git push origin main

# 3. 自動デプロイ完了まで待機（約2-3分）
# GitHub Actions → Vercel → 本番サイト更新
```

## 📊 デプロイ確認

1. **GitHub Actions**: Repository → Actions タブで実行状況確認
2. **Vercel Dashboard**: Deployments で本番デプロイ確認
3. **本番サイト**: `https://doctor-direct-delta.vercel.app/` で動作確認
4. **認証テスト**: ヘッダーのログインボタンで認証機能確認

## 🎯 本番環境情報

### 本番URL
```
https://doctor-direct-delta.vercel.app/
```

### 認証エンドポイント
```
https://doctor-direct-delta.vercel.app/api/auth/signin
https://doctor-direct-delta.vercel.app/api/auth/signout
```

## トラブルシューティング

### ❌ 認証エラーが発生した場合
1. **環境変数確認**: `.env.local` と Vercel 環境変数が一致しているか
2. **OAuth設定確認**: リダイレクトURLが `https://doctor-direct-delta.vercel.app/` に設定されているか
3. **NEXTAUTH_SECRET**: 本番とローカルで同じ値を使用しているか

### ❌ GitHub Actions失敗
1. **Secrets確認**: GitHub Secretsが正しく設定されているか
2. **ビルドログ確認**: 認証関連のコンパイルエラーがないか

### ❌ ビルドエラーが発生した場合
```bash
# ローカルでビルドテスト
npm run build

# エラーを修正してプッシュ
git add .
git commit -m "fix: ビルドエラー修正"
git push origin main
```

## プロジェクト構成

```
├── .github/
│   └── workflows/
│       └── deploy.yml     # 自動デプロイ設定
├── .env.local             # ローカル環境変数
├── app/                   # Next.js App Router
│   ├── globals.css        # Tailwind CSS設定
│   ├── layout.tsx         # ルートレイアウト（認証Provider含む）
│   ├── page.tsx           # メインページ
│   ├── ai-diagnosis/      # AI症状診断ページ
│   ├── consultation/      # オンライン相談ページ
│   ├── dashboard/         # ダッシュボードページ
│   ├── doctor-search/     # 医師検索ページ
│   ├── health-coach/      # 健康コーチページ
│   ├── hospital-search/   # 病院検索ページ
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts # NextAuth.js API
├── components/            # Reactコンポーネント
│   ├── AuthButton.tsx     # 認証ボタン
│   ├── AuthProvider.tsx   # 認証プロバイダー
│   ├── Header.tsx         # ヘッダー（認証統合済み）
│   ├── Hero.tsx           # ヒーローセクション
│   ├── Features.tsx       # 機能セクション
│   ├── CTA.tsx            # CTAセクション
│   └── Footer.tsx         # フッターコンポーネント
├── types/
│   └── next-auth.d.ts     # NextAuth.js型定義
├── public/                # 静的ファイル
├── next.config.js         # Next.js設定（Vercel最適化済み）
├── vercel.json            # Vercel設定ファイル
├── tailwind.config.js     # Tailwind CSS設定
└── tsconfig.json          # TypeScript設定
```

## 主な機能

- **レスポンシブデザイン**: 全デバイス対応
- **AI症状診断**: 症状入力による分析機能
- **医師検索**: 専門医師の検索・予約
- **病院検索**: 近隣病院の検索機能
- **オンライン相談**: リアルタイム医療相談
- **ヘルスコーチ**: AI健康アドバイス機能
- **ダッシュボード**: ユーザー健康管理画面
- **ユーザー認証**: Google/GitHub OAuth対応
- **セキュリティ**: 医療情報の暗号化保護

## ✅ 自動デプロイのメリット

- ✅ **完全自動化**: VSCodeからプッシュするだけ
- ✅ **プレビュー機能**: Pull Request毎にプレビューURL生成
- ✅ **安全性**: mainブランチのみ本番デプロイ
- ✅ **高速**: 約2-3分で本番反映
- ✅ **エラー検知**: ビルド失敗時に自動通知
- ✅ **認証機能**: Google/GitHub OAuth完全対応
- ✅ **セキュリティ**: JWT方式の安全なセッション管理
- ✅ **本番環境**: https://doctor-direct-delta.vercel.app/ で稼働中

## 今後の拡張予定

- バックエンドAPI統合
- データベース連携（Prisma）
- リアルタイム通信（Socket.io）
- ユーザープロファイル管理
- 医師認証システム