# 🚀 Doctor Direct - 自動デプロイ設定完了チェックリスト

## ✅ 設定状況

### ファイル構成
- [x] `.github/workflows/deploy.yml` - GitHub Actions ワークフロー
- [x] `vercel.json` - Vercel設定ファイル（Next.js最適化済み）
- [x] `next.config.js` - Next.js設定（Vercel対応）
- [x] `package.json` - ビルドスクリプト設定済み
- [x] **NextAuth.js認証機能** - Google/GitHub OAuth対応

### 必要な手順（初回のみ）

#### 1. Vercel API情報取得
- [ ] Vercel API Token取得 → https://vercel.com/account/tokens
- [ ] Vercel Project ID取得（プロジェクト設定画面）
- [ ] Vercel Org ID取得（チーム設定画面）

#### 2. GitHub Secrets設定
GitHub Repository → Settings → Secrets and variables → Actions で設定：

```
# Vercel デプロイ用
VERCEL_TOKEN = [取得したAPI Token]
VERCEL_PROJECT_ID = [取得したProject ID]
VERCEL_ORG_ID = [取得したOrg ID]

# NextAuth.js認証用 (NEW!)
NEXTAUTH_SECRET = tbeORFbiad6z+HIjK4M8n9u3VgysNbHcK4pCvTcy6X4=
NEXTAUTH_URL = https://your-domain.vercel.app

# OAuth プロバイダー設定 (オプション)
GOOGLE_CLIENT_ID = [Google OAuth Client ID]
GOOGLE_CLIENT_SECRET = [Google OAuth Client Secret]
GITHUB_ID = [GitHub OAuth App ID]
GITHUB_SECRET = [GitHub OAuth App Secret]
```

#### 3. Vercel Dashboard環境変数設定
Vercel Dashboard → Settings → Environment Variables で同じ値を設定

#### 4. OAuth アプリ設定（認証を有効にする場合）

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
1. GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

#### 5. 初回プッシュテスト
```bash
# 現在の変更をコミット
git add .
git commit -m "feat: NextAuth.js認証機能追加"

# GitHubにプッシュ（自動デプロイ開始）
git push origin main
```

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
3. **本番サイト**: デプロイ完了後のURLで動作確認
4. **認証テスト**: ヘッダーのログインボタンで認証機能確認

## 🎯 新機能: NextAuth.js認証

### 追加された機能
- ✅ **Google OAuth** - Googleアカウントでログイン
- ✅ **GitHub OAuth** - GitHubアカウントでログイン  
- ✅ **セッション管理** - ログイン状態の永続化
- ✅ **レスポンシブUI** - モバイル対応の認証ボタン
- ✅ **型安全性** - TypeScript完全対応

### 認証フロー
```
1. ユーザーがログインボタンクリック
2. OAuth プロバイダー選択画面表示
3. 外部サービス（Google/GitHub）で認証
4. 認証成功後、アプリケーションにリダイレクト
5. セッション情報がヘッダーに表示
```

## 🛠️ ローカル開発での認証テスト

```bash
# 開発サーバー起動
npm run dev

# → http://localhost:3000 でアクセス
# → ヘッダーの「ログイン」ボタンをクリック
# → NextAuth.js の認証画面が表示される
```

## 🆘 トラブルシューティング

### ❌ 認証エラーが発生した場合
1. **環境変数確認**: `.env.local` と Vercel 環境変数が一致しているか
2. **OAuth設定確認**: リダイレクトURLが正しく設定されているか
3. **NEXTAUTH_SECRET**: 本番とローカルで同じ値を使用しているか

### ❌ GitHub Actions失敗
1. **Secrets確認**: NextAuth.js関連の環境変数が設定されているか
2. **ビルドログ確認**: 認証関連のコンパイルエラーがないか

## ✅ 自動デプロイのメリット（更新版）

- ✅ **完全自動化**: VSCodeからプッシュするだけ
- ✅ **プレビュー機能**: Pull Request毎にプレビューURL生成
- ✅ **安全性**: mainブランチのみ本番デプロイ
- ✅ **高速**: 約2-3分で本番反映
- ✅ **エラー検知**: ビルド失敗時に自動通知
- ✅ **認証機能**: Google/GitHub OAuth完全対応
- ✅ **セキュリティ**: JWT方式の安全なセッション管理

これで VSCode → GitHub → Vercel の完全自動デプロイパイプライン + **認証機能付き** が完成しました！