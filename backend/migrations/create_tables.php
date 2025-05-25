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
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            user_type ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient',
            phone VARCHAR(20),
            avatar VARCHAR(255),
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME,
            updated_at DATETIME
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // hospitals テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS hospitals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            city VARCHAR(50) NOT NULL,
            prefecture VARCHAR(50) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(100),
            website VARCHAR(255),
            description TEXT,
            image VARCHAR(255),
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            is_featured BOOLEAN DEFAULT FALSE,
            rating DECIMAL(3, 2) DEFAULT 0,
            created_at DATETIME,
            updated_at DATETIME
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // departments テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            created_at DATETIME,
            updated_at DATETIME
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // hospital_departments テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS hospital_departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hospital_id INT NOT NULL,
            department_id INT NOT NULL,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // doctors テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS doctors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            specialty VARCHAR(100) NOT NULL,
            license_number VARCHAR(50) NOT NULL,
            hospital_id INT,
            education TEXT,
            experience TEXT,
            consultation_fee DECIMAL(10, 2),
            is_featured BOOLEAN DEFAULT FALSE,
            rating DECIMAL(3, 2) DEFAULT 0,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // diseases テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS diseases (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            symptoms TEXT,
            treatments TEXT,
            created_at DATETIME,
            updated_at DATETIME
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // doctor_diseases テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS doctor_diseases (
            id INT AUTO_INCREMENT PRIMARY KEY,
            doctor_id INT NOT NULL,
            disease_id INT NOT NULL,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
            FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // consultations テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS consultations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT NOT NULL,
            doctor_id INT NOT NULL,
            status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
            title VARCHAR(255) NOT NULL,
            description TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // consultation_messages テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS consultation_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            consultation_id INT NOT NULL,
            sender_id INT NOT NULL,
            message TEXT NOT NULL,
            attachment VARCHAR(255),
            is_read BOOLEAN DEFAULT FALSE,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // prescriptions テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS prescriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            consultation_id INT NOT NULL,
            details TEXT NOT NULL,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // appointments テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT NOT NULL,
            doctor_id INT NOT NULL,
            appointment_date DATETIME NOT NULL,
            status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
            reason TEXT,
            notes TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // reviews テーブル
    $db->exec("
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            doctor_id INT,
            hospital_id INT,
            rating INT NOT NULL,
            comment TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // サンプルデータの挿入
    // departments
    $departments = ['内科', '外科', '小児科', '産婦人科', '眼科', '耳鼻咽喉科', '皮膚科', '整形外科', '精神科', '歯科'];
    foreach ($departments as $department) {
        $db->exec("INSERT INTO departments (name, created_at, updated_at) VALUES ('$department', NOW(), NOW())");
    }

    // コミット
    $db->commit();
    
    echo "データベース構造の作成が完了しました。\n";
    echo "サンプルデータを挿入しました。\n";
    
} catch (PDOException $e) {
    // エラー時はロールバック
    $db->rollBack();
    echo "エラー: " . $e->getMessage() . "\n";
}
?>