# 🚀 Doctor Direct - 自動デプロイ設定完了チェックリスト

## ✅ 設定状況

### ファイル構成
- [x] `.github/workflows/deploy.yml` - GitHub Actions ワークフロー
- [x] `vercel.json` - Vercel設定ファイル（Next.js最適化済み）
- [x] `next.config.js` - Next.js設定（Vercel対応）
- [x] `package.json` - ビルドスクリプト設定済み
- [x] **NextAuth.js認証機能** - Google/GitHub OAuth対応
- [x] **環境変数設定** - Vercelデータ取得済み

### 必要な手順（初回のみ）

#### ✅ 1. Vercel API情報取得済み
- [x] Vercel API Token: `fps9igcLXnBXi6QjlAZLXReB`
- [x] Vercel Project ID: `prj_udZpAmo6gFxhc9OLYEKUrIIoXSD6`
- [x] Vercel Org ID: `team_x1yX5LGP9hQd14xqyuHkFZEj`
- [x] 本番URL: `https://doctor-direct-delta.vercel.app/`

#### 🚨 2. GitHub Secrets設定（要実行）
GitHub Repository → Settings → Secrets and variables → Actions で以下を設定：

```
VERCEL_TOKEN=fps9igcLXnBXi6QjlAZLXReB
VERCEL_PROJECT_ID=prj_udZpAmo6gFxhc9OLYEKUrIIoXSD6
VERCEL_ORG_ID=team_x1yX5LGP9hQd14xqyuHkFZEj
NEXTAUTH_SECRET=tbeORFbiad6z+HIjK4M8n9u3VgysNbHcK4pCvTcy6X4=
NEXTAUTH_URL=https://doctor-direct-delta.vercel.app/
```

#### ✅ 3. Vercel Dashboard環境変数設定済み
Vercel Dashboard → Settings → Environment Variables で設定済み：
- `NODE_ENV=production`
- `NEXTAUTH_URL=https://doctor-direct-delta.vercel.app/`
- `NEXTAUTH_SECRET=tbeORFbiad6z+HIjK4M8n9u3VgysNbHcK4pCvTcy6X4=`

#### 4. OAuth アプリ設定（認証を有効にする場合）

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect URIs: `https://doctor-direct-delta.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
1. GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Authorization callback URL: `https://doctor-direct-delta.vercel.app/api/auth/callback/github`

#### 5. 次回プッシュで自動デプロイ完了
```bash
# 環境変数設定後にプッシュ
git add .
git commit -m "feat: 本番環境変数設定完了"
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

### 新機能: NextAuth.js認証

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
2. **OAuth設定確認**: リダイレクトURLが `https://doctor-direct-delta.vercel.app/` に設定されているか
3. **NEXTAUTH_SECRET**: 本番とローカルで同じ値を使用しているか

### ❌ GitHub Actions失敗
1. **Secrets確認**: GitHub Secretsが正しく設定されているか
2. **ビルドログ確認**: 認証関連のコンパイルエラーがないか

## ⚠️ 重要な次のステップ

### 1. GitHub Secretsの設定
上記の5つの環境変数をGitHub Repository → Settings → Secrets and variables → Actions で設定してください。

### 2. OAuth設定（認証機能を有効にする場合）
Google/GitHubでOAuthアプリを作成し、対応する環境変数をGitHub SecretsとVercelに追加してください。

## ✅ 自動デプロイのメリット（更新版）

- ✅ **完全自動化**: VSCodeからプッシュするだけ
- ✅ **プレビュー機能**: Pull Request毎にプレビューURL生成
- ✅ **安全性**: mainブランチのみ本番デプロイ
- ✅ **高速**: 約2-3分で本番反映
- ✅ **エラー検知**: ビルド失敗時に自動通知
- ✅ **認証機能**: Google/GitHub OAuth完全対応
- ✅ **セキュリティ**: JWT方式の安全なセッション管理
- ✅ **本番環境**: https://doctor-direct-delta.vercel.app/ で稼働中

これで VSCode → GitHub → Vercel の完全自動デプロイパイプライン + **認証機能付き** + **本番環境設定完了** です！