#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 関数: メッセージの表示
print_message() {
  echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# 作業ディレクトリの確認
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_message "Doctor Direct プロジェクトのセットアップを開始します"

# 必要なツールの確認
check_command() {
  if ! command -v $1 &> /dev/null; then
    print_error "$1 が見つかりません。インストールしてください。"
    exit 1
  fi
}

print_message "必要なツールの確認"
check_command php
check_command composer
check_command node
check_command npm
print_success "すべてのツールがインストールされています"

# PHPバックエンドのセットアップ
print_message "PHPバックエンドのセットアップ"

cd backend

# composerパッケージのインストール
if [ ! -f "composer.json" ]; then
  print_warning "composer.json が見つかりません。初期化します。"
  composer init --quiet --no-interaction
fi

print_message "Composer依存関係のインストール"
composer install

# データベース設定
print_message "データベースの設定"
if [ ! -f "app/core/config.php" ]; then
  print_warning "設定ファイルがありません。サンプル設定を作成します。"
  
  mkdir -p app/core
  cat > app/core/config.php << 'EOF'
<?php
// データベース設定
define('DB_HOST', 'localhost');
define('DB_NAME', 'doctor_direct');
define('DB_USER', 'root'); // 必要に応じて変更
define('DB_PASS', ''); // 必要に応じて変更

// アプリケーション設定
define('APP_URL', 'http://localhost:8000');
define('API_VERSION', 'v1');

// セッション設定
define('SESSION_NAME', 'doctor_direct_session');
define('SESSION_LIFETIME', 86400); // 24時間

// JWT設定
define('JWT_SECRET', 'your_jwt_secret_key'); // 本番環境では必ず変更してください
define('JWT_EXPIRY', 3600); // 1時間
EOF
  
  print_success "設定ファイルを作成しました"
else
  print_success "設定ファイルが存在します"
fi

# データベースのセットアップ
print_message "データベースのセットアップ"

# MySQL接続情報を設定ファイルから取得
DB_HOST=$(grep -oP "define\('DB_HOST', '\K[^']+" app/core/config.php)
DB_NAME=$(grep -oP "define\('DB_NAME', '\K[^']+" app/core/config.php)
DB_USER=$(grep -oP "define\('DB_USER', '\K[^']+" app/core/config.php)
DB_PASS=$(grep -oP "define\('DB_PASS', '\K[^']+" app/core/config.php)

# MySQLが利用可能か確認
if command -v mysql &> /dev/null; then
  # データベースを作成
  print_message "データベース '$DB_NAME' を作成しています..."
  mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASS:+-p$DB_PASS} -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
  
  if [ $? -eq 0 ]; then
    print_success "データベース '$DB_NAME' を作成しました"
    
    # テーブル作成
    print_message "テーブルを作成しています..."
    php migrations/create_tables.php
    
    if [ $? -eq 0 ]; then
      print_success "テーブルを作成しました"
      
      # テストデータ挿入
      print_message "テストデータを挿入しています..."
      php migrations/seed_data.php
      
      if [ $? -eq 0 ]; then
        print_success "テストデータを挿入しました"
      else
        print_error "テストデータの挿入に失敗しました"
      fi
    else
      print_error "テーブルの作成に失敗しました"
    fi
  else
    print_error "データベースの作成に失敗しました。MySQL接続情報を確認してください。"
  fi
else
  print_warning "MySQLが見つかりません。手動でデータベースをセットアップしてください。"
  print_warning "以下のファイルを実行してください:"
  print_warning "1. php migrations/create_tables.php"
  print_warning "2. php migrations/seed_data.php"
fi

# 口コミ機能用のテーブル追加
print_message "口コミ機能用のテーブルを追加しています..."

# 新しいテーブル作成用のSQLを生成
cat > migrations/create_review_tables.php << 'EOF'
<?php
require_once __DIR__ . '/../app/core/config.php';
require_once __DIR__ . '/../app/db/database.php';

try {
    // データベース接続
    $db = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // バッジテーブル
    $db->exec("CREATE TABLE IF NOT EXISTS badges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    // ユーザーポイントテーブル
    $db->exec("CREATE TABLE IF NOT EXISTS user_points (
        user_id INT PRIMARY KEY,
        points INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    // ユーザーバッジテーブル
    $db->exec("CREATE TABLE IF NOT EXISTS user_badges (
        user_id INT NOT NULL,
        badge_id INT NOT NULL,
        acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, badge_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    // レビュータグテーブル
    $db->exec("CREATE TABLE IF NOT EXISTS review_tags (
        review_id INT NOT NULL,
        tag VARCHAR(100) NOT NULL,
        PRIMARY KEY (review_id, tag)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    // レビューいいねテーブル
    $db->exec("CREATE TABLE IF NOT EXISTS review_likes (
        user_id INT NOT NULL,
        review_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, review_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    // 初期バッジデータ
    $db->exec("INSERT INTO badges (id, name, description, icon) VALUES
        (1, 'レビューデビュー', '初めての口コミを投稿しました', 'fa-edit'),
        (2, '信頼レビュアー', '10件の口コミを投稿しました', 'fa-certificate'),
        (3, 'いいねコレクター', '口コミが10件の「いいね」を集めました', 'fa-thumbs-up')
    ");
    
    echo "口コミ機能用のテーブルが正常に作成されました。\n";
    
} catch (PDOException $e) {
    die("データベースエラー: " . $e->getMessage() . "\n");
}
EOF

# 口コミ機能用の新しいテーブルを作成
php migrations/create_review_tables.php

if [ $? -eq 0 ]; then
  print_success "口コミ機能用のテーブルを追加しました"
else
  print_error "口コミ機能用のテーブルの追加に失敗しました"
fi

# バックエンド開発サーバーの起動準備
print_message "バックエンド開発サーバーの準備"

# scriptsディレクトリがなければ作成 (backendディレクトリからの相対パス)
mkdir -p ../scripts

# PHPビルトインサーバー起動スクリプト (scripts/run_backend.sh に出力)
# run_backend.sh は scripts ディレクトリから backend ディレクトリ内のサーバーを起動する
cat > ../scripts/run_backend.sh << \'EOF\'
#!/bin/bash
# このスクリプトは scripts ディレクトリに配置されます。
# backend ディレクトリに移動してから PHP サーバーを起動する必要があります。
SCRIPT_DIR_RUN_BACKEND="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR_RUN_BACKEND/../backend" || exit
php -S localhost:8000 -t .
EOF

chmod +x ../scripts/run_backend.sh

print_success "バックエンドの準備が完了しました"

# backendディレクトリから抜けてプロジェクトルートに戻る
cd ..

# Next.jsフロントエンドのセットアップ
print_message "Next.jsフロントエンドのセットアップ"

cd doctor-direct-nextjs

# Next.js依存関係のインストール
print_message "Next.js依存関係のインストール"
npm install

# Prisma Client生成
print_message "Prisma Clientの生成"
npx prisma generate

print_success "Next.jsフロントエンドの準備が完了しました"

# プロジェクトルートに戻る
cd ..

# ルートのpackage.jsonの依存関係をインストール
print_message "プロジェクトルートの依存関係インストール"
npm install

# 全体セットアップ完了
print_message "セットアップが完了しました"
print_message "以下のコマンドでサービスを開始できます:"
echo -e "${YELLOW}統合起動: npm run dev (バックエンド+フロントエンド同時起動)${NC}"
echo -e "${YELLOW}バックエンドのみ: npm run backend${NC}"
echo -e "${YELLOW}フロントエンドのみ: npm run frontend${NC}"
echo ""
print_message "ブラウザで以下のURLにアクセスしてください:"
echo -e "${GREEN}フロントエンド: http://localhost:3000${NC}"
echo -e "${GREEN}バックエンドAPI: http://localhost:8000/api/v1/${NC}"
echo ""
print_success "Doctor Direct のセットアップが完了しました！"