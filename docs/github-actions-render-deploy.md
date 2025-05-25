# GitHub Actions → Render 自動デプロイ設定

## 概要
このワークフローは、mainブランチへのpush時にNext.js 14アプリケーションをRenderに自動デプロイします。

## ワークフロー構成

### トリガー
- **Push**: mainブランチへのpush
- **Pull Request**: mainブランチへのPR（テスト・ビルドのみ）

### ジョブ構成

#### 1. test-and-build
- Node.js 20環境のセットアップ
- 依存関係のインストール (`npm ci`)
- Prisma クライアント生成
- ESLint実行 (`npm run lint`)
- TypeScript型チェック (`npx tsc --noEmit`)
- テスト実行（設定されている場合のみ）
- ビルド実行 (`npm run build`)

#### 2. deploy
- Deploy Hook経由でのデプロイ（メイン）
- Render API経由でのデプロイ（フォールバック）
- 成功・失敗通知

## GitHub Secrets設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください：

### 必須シークレット

1. **RENDER_DEPLOY_HOOK_URL**
   ```
   https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=xxxxxxxxxxxxxxxx
   ```
   - Renderダッシュボード > Your Service > Settings > Deploy Hook で取得

2. **RENDER_SERVICE_ID**
   ```
   srv-xxxxxxxxxxxxx
   ```
   - RenderサービスのID（URLまたはダッシュボードで確認）

3. **RENDER_API_KEY**
   ```
   rnd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - Render Account Settings > API Keys で生成

### 設定手順

1. GitHubリポジトリにアクセス
2. **Settings** タブをクリック
3. 左サイドバーの **Secrets and variables** > **Actions** をクリック
4. **New repository secret** をクリック
5. 上記の各シークレットを名前と値で設定

## Render側の設定

### Web Service設定
```yaml
Name: doctor-direct-nextjs
Environment: Node
Region: 任意のリージョン
Branch: main
Root Directory: doctor-direct-nextjs
```

### ビルド設定
```bash
Build Command: npm install && npx prisma generate && npm run build
Start Command: npm start
```

### 環境変数
以下の環境変数をRenderダッシュボードで設定：

```
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-app.onrender.com
```

追加のAPI Keysがある場合は適宜設定してください。

## トラブルシューティング

### よくある問題と解決方法

#### 1. ビルドエラー
**問題**: TypeScript型エラーまたはESLintエラー
**解決策**: 
- ローカルで `npm run lint` と `npx tsc --noEmit` を実行
- エラーを修正してからpush

#### 2. Prisma関連エラー
**問題**: Prisma クライアントが見つからない
**解決策**:
- `DATABASE_URL` が正しく設定されているか確認
- Prismaスキーマファイルが正しいか確認

#### 3. デプロイフック失敗
**問題**: Deploy Hook URLが無効
**解決策**:
- Renderダッシュボードで新しいDeploy Hookを生成
- `RENDER_DEPLOY_HOOK_URL` シークレットを更新

#### 4. API デプロイ失敗
**問題**: 認証エラーまたはサービスID不正
**解決策**:
- `RENDER_API_KEY` が有効か確認
- `RENDER_SERVICE_ID` が正しいか確認

#### 5. タイムアウトエラー
**問題**: 10分以内にビルドが完了しない
**解決策**:
- 依存関係を見直し
- ビルドプロセスを最適化
- 必要に応じてタイムアウト時間を延長

### ログの確認方法

1. GitHubリポジトリの **Actions** タブ
2. 失敗したワークフローをクリック
3. 各ステップの詳細ログを確認

### デバッグのヒント

- ローカルで同じコマンドを実行してテスト
- 環境変数が正しく設定されているか確認
- Renderサービスのログも合わせて確認

## セキュリティ注意事項

- API KeyやDeploy Hook URLを直接コードに含めない
- GitHub Secretsを使用して機密情報を管理
- 定期的にAPI Keyをローテーション
- プルリクエストでのデプロイは無効化済み（mainブランチのみ）

## カスタマイズ

### テストの追加
package.jsonにテストスクリプトを追加する場合：
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### 追加の環境変数
新しい環境変数が必要な場合：
1. Renderダッシュボードで環境変数を追加
2. 必要に応じてGitHub Secretsにも追加

### 他のブランチでのデプロイ
developブランチなどでもデプロイしたい場合：
```yaml
on:
  push:
    branches: [main, develop]
```

## サポート

問題が解決しない場合：
1. GitHub Actionsのログをチェック
2. Renderサービスのログをチェック
3. Render公式ドキュメントを参照
4. 必要に応じてRenderサポートに問い合わせ