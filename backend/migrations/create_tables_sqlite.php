<?php
require_once __DIR__ . '/../app/db/database.php';

// データベース接続の取得
$db = Database::getInstance()->getConnection();

// トランザクション開始
$db->beginTransaction();

try {
    // users テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            user_type VARCHAR(20) NOT NULL DEFAULT 'patient' CHECK (user_type IN ('patient', 'doctor', 'admin')),
            phone VARCHAR(20),
            avatar VARCHAR(255),
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // hospitals テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS hospitals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            city VARCHAR(50) NOT NULL,
            prefecture VARCHAR(50) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(100),
            website VARCHAR(255),
            description TEXT,
            image VARCHAR(255),
            latitude REAL,
            longitude REAL,
            is_featured BOOLEAN DEFAULT 0,
            rating REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // departments テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // doctors テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            hospital_id INTEGER NOT NULL,
            department_id INTEGER NOT NULL,
            specialization VARCHAR(100),
            experience_years INTEGER DEFAULT 0,
            license_number VARCHAR(50),
            bio TEXT,
            consultation_fee REAL DEFAULT 0,
            is_available BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
            FOREIGN KEY (department_id) REFERENCES departments(id)
        );
    ");

    // appointments テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            doctor_id INTEGER NOT NULL,
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES users(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        );
    ");

    // user_rewards テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS user_rewards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            points INTEGER DEFAULT 0,
            total_earned INTEGER DEFAULT 0,
            total_spent INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ");

    // reward_transactions テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS reward_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'spent')),
            points INTEGER NOT NULL,
            description TEXT,
            reference_type VARCHAR(50),
            reference_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ");

    // コミット
    $db->commit();
    echo "✅ SQLite用テーブルが正常に作成されました。\n";

} catch (Exception $e) {
    // ロールバック
    $db->rollBack();
    echo "❌ エラー: " . $e->getMessage() . "\n";
    exit(1);
}
?>