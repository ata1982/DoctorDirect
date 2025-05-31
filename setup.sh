#!/bin/bash

# DoctorDirect 自動セットアップスクリプト
# このスクリプトを実行すると、プロジェクトが完全に自動でセットアップされます

set -e

echo "🚀 DoctorDirect セットアップを開始します..."

# Node.jsのバージョンチェック
echo "📋 環境チェック中..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません。Node.js 18以上をインストールしてください。"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18以上が必要です。現在のバージョン: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) が検出されました"

# npmのバージョンチェック
if ! command -v npm &> /dev/null; then
    echo "❌ npmがインストールされていません。"
    exit 1
fi

echo "✅ npm $(npm -v) が検出されました"

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# .envファイルの作成（存在しない場合）
if [ ! -f .env.local ]; then
    echo "⚙️  環境変数ファイルを作成中..."
    cat > .env.local << EOL
# Next.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key

# Database (if using)
DATABASE_URL="file:./dev.db"

# Node Environment
NODE_ENV=development
EOL
    echo "📝 .env.local ファイルを作成しました。必要に応じて API キーを設定してください。"
else
    echo "✅ .env.local ファイルが既に存在します"
fi

# TypeScript型チェック
echo "🔍 TypeScript型チェック中..."
npm run type-check

# ビルドテスト
echo "🔨 ビルドテスト実行中..."
npm run build

# 成功メッセージ
echo ""
echo "🎉 セットアップが完了しました！"
echo ""
echo "📋 次のステップ:"
echo "1. .env.local ファイルで API キーを設定"
echo "2. 開発サーバーを起動: npm run dev"
echo "3. ブラウザで http://localhost:3000 にアクセス"
echo ""
echo "🚀 開発サーバーを今すぐ起動しますか？ (y/n)"
read -p "> " start_dev

if [ "$start_dev" = "y" ] || [ "$start_dev" = "Y" ]; then
    echo "🌟 開発サーバーを起動しています..."
    npm run dev
else
    echo "💡 準備完了！ npm run dev で開発サーバーを起動できます。"
fi