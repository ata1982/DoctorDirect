# Doctor Direct プロジェクト

このプロジェクトは、Next.js製のフロントエンドアプリケーションとTailwind CSSで構成されたモダンな医療相談プラットフォームです。

## 技術スタック

### フロントエンド
- Next.js 15.x (App Router)
- TypeScript
- Tailwind CSS
- React 19.x

### インフラ・デプロイ
- Vercel (ホスティング)
- GitHub Actions (CI/CD)

## セットアップ

プロジェクトのセットアップ手順：

```bash
# 依存関係のインストール
npm install

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

## Vercelデプロイ

このプロジェクトはVercelに最適化されており、GitHubリポジトリを接続するだけで自動デプロイが可能です。

### デプロイ手順

1. [Vercel](https://vercel.com)にアカウント作成/ログイン
2. GitHubリポジトリをインポート
3. プロジェクト設定で以下を確認：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. デプロイボタンをクリック

### 環境変数（必要に応じて）

Vercelの環境変数設定で以下を追加できます：

```
NEXT_PUBLIC_API_URL     # APIのベースURL（将来的な拡張用）
```

## 開発フロー

1. **ローカル開発**: `npm run dev` でローカル環境を起動
2. **コード変更**: 各機能の開発・修正
3. **テスト**: `npm run lint` でコード品質チェック
4. **Git Push**: `git push origin main` でVercelに自動デプロイ
5. **本番確認**: VercelでデプロイされたアプリケーションをURLで確認

## プロジェクト構成

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Tailwind CSS設定
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   ├── Header.tsx         # ヘッダーコンポーネント
│   ├── Hero.tsx           # ヒーローセクション
│   ├── Features.tsx       # 機能セクション
│   ├── CTA.tsx            # CTAセクション
│   └── Footer.tsx         # フッターコンポーネント
├── public/                # 静的ファイル
├── next.config.js         # Next.js設定
├── tailwind.config.js     # Tailwind CSS設定
└── tsconfig.json          # TypeScript設定
```

## 主な機能

- **レスポンシブデザイン**: 全デバイス対応
- **AI症状診断**: 症状入力による分析機能
- **医師検索**: 専門医師の検索・予約
- **病院検索**: 近隣病院の検索機能
- **オンライン相談**: リアルタイム医療相談
- **セキュリティ**: 医療情報の暗号化保護

## 今後の拡張予定

- バックエンドAPI統合
- 認証システム（NextAuth.js）
- データベース連携（Prisma）
- リアルタイム通信（Socket.io）