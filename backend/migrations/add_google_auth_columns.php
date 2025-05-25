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
    
    // usersテーブルにGoogle認証用のカラムを追加
    $db->exec("ALTER TABLE users 
        ADD COLUMN google_id VARCHAR(255) NULL DEFAULT NULL COMMENT 'Google認証ID',
        ADD COLUMN profile_image VARCHAR(255) NULL DEFAULT NULL COMMENT 'プロフィール画像URL'");
    
    echo "Google認証用のカラムが正常に追加されました。\n";
    
} catch (PDOException $e) {
    die("データベースエラー: " . $e->getMessage() . "\n");
}