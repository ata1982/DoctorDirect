# Doctor Direct プロジェクト

このプロジェクトは、PHP製のバックエンドAPIとNext.js製のフロントエンドアプリケーションで構成されています。

## ディレクトリ構成

- `backend/`: PHPバックエンド (API)
- `doctor-direct-nextjs/`: Next.jsフロントエンドアプリケーション
- `scripts/`: 起動スクリプトなど
- `docs/`: ドキュメント
- `.github/workflows/`: GitHub Actions自動デプロイ設定

## セットアップ

プロジェクトのセットアップは、ルートディレクトリにある `setup.sh` を実行します。

```bash
./setup.sh
```

このスクリプトにより以下が自動実行されます：
- PHPバックエンドの依存関係インストール（Composer）
- データベースのセットアップ（MySQL）
- Next.jsフロントエンドの依存関係インストール（npm）
- Prisma Clientの生成
- プロジェクトルートの依存関係インストール

## 起動方法

### 🚀 統合起動（推奨）

バックエンドとフロントエンドを同時に起動：

```bash
npm run dev
```

### 🔧 個別起動

#### バックエンドAPI

```bash
npm run backend
```

バックエンドAPIは `http://localhost:8000/api/v1/` で利用可能になります。

#### フロントエンド (Next.js)

```bash
npm run frontend
```

フロントエンドは `http://localhost:3000` で利用可能になります。

### 📦 その他のコマンド

```bash
# Next.jsのビルド
npm run build

# 本番環境での起動
npm start

# ESLintチェック
npm run frontend:lint

# Next.jsフロントエンドの依存関係更新
npm run install:frontend
```

## 環境設定

各アプリケーションの環境設定ファイルは以下を参考にしてください。

- **バックエンド**: `backend/app/core/config.php` (データベース接続情報など)
    - `setup.sh` 実行時にサンプルが生成されます。
- **フロントエンド (Next.js)**: `doctor-direct-nextjs/.env` または `doctor-direct-nextjs/.env.local`
    - データベースURL (`DATABASE_URL`)、NextAuth関連 (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`) などの設定が必要です。
    - Renderデプロイ時の環境変数については、[`docs/github-actions-render-deploy.md`](docs/github-actions-render-deploy.md) も参照してください。

## GitHub Actions自動デプロイ

Next.jsアプリケーションのRenderプラットフォームへの自動デプロイ設定が `.github/workflows/deploy.yml` に含まれています。

### 必要なGitHub Secrets

以下のSecretsをGitHubリポジトリに設定してください：

```
RENDER_DEPLOY_HOOK_URL  # RenderのDeploy Hook URL
RENDER_SERVICE_ID       # RenderサービスID (srv-xxxxx)
RENDER_API_KEY          # RenderのAPI Key
DATABASE_URL            # PostgreSQLデータベースURL
NEXTAUTH_SECRET         # NextAuth用シークレット
```

詳細な設定手順は [`docs/github-actions-render-deploy.md`](docs/github-actions-render-deploy.md) を参照してください。

## 開発フロー

1. **ローカル開発**: `npm run dev` でローカル環境を起動
2. **コード変更**: 各機能の開発・修正
3. **テスト**: `npm run frontend:lint` でコード品質チェック
4. **Git Push**: `git push origin main` で自動デプロイがトリガー
5. **本番確認**: RenderでデプロイされたアプリケーションをURLで確認

## プロジェクト技術スタック

### バックエンド
- PHP 8.x
- MySQL
- Composer
- JWT認証

### フロントエンド
- Next.js 15.x (App Router)
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- NextAuth.js (認証)
- Socket.io (リアルタイム通信)

### インフラ・CI/CD
- Render (ホスティング)
- GitHub Actions (自動デプロイ)
- PostgreSQL (本番DB)

## その他ドキュメント

- Next.jsアプリケーション詳細: [`doctor-direct-nextjs/README.md`](doctor-direct-nextjs/README.md)
- Renderデプロイガイド: [`docs/github-actions-render-deploy.md`](docs/github-actions-render-deploy.md)