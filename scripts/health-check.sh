#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 設定
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:8000/api/v1"
PRODUCTION_URL="https://your-app.onrender.com" # 実際のRender URLに変更してください

print_status() {
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

# ヘルスチェック関数
check_endpoint() {
  local url=$1
  local name=$2
  
  echo "Checking $name..."
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
  
  if [ "$response" = "200" ]; then
    print_success "$name is responding (HTTP $response)"
    return 0
  else
    print_error "$name is not responding (HTTP $response)"
    return 1
  fi
}

# メイン監視処理
print_status "Doctor Direct ヘルスチェック開始"

# ローカル環境チェック
print_status "ローカル環境チェック"
check_endpoint "$FRONTEND_URL" "ローカルフロントエンド"
check_endpoint "$BACKEND_URL" "ローカルバックエンド"

echo ""

# 本番環境チェック（URLが設定されている場合）
if [ "$PRODUCTION_URL" != "https://your-app.onrender.com" ]; then
  print_status "本番環境チェック"
  check_endpoint "$PRODUCTION_URL" "本番フロントエンド"
  check_endpoint "$PRODUCTION_URL/api/v1" "本番バックエンド"
else
  print_warning "本番URLが設定されていません。scripts/health-check.sh内のPRODUCTION_URLを更新してください。"
fi

echo ""
print_status "ヘルスチェック完了"