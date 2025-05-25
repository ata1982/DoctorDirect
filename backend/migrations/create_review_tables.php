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
