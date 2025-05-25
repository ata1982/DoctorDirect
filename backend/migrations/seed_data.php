<?php
require_once __DIR__ . '/../app/db/database.php';

// データベース接続の取得
$db = Database::getInstance()->getConnection();

// トランザクション開始
$db->beginTransaction();

try {
    // サンプル病院データの挿入
    $hospitals = [
        [
            'name' => '東京総合病院',
            'address' => '東京都新宿区西新宿6-7-1',
            'city' => '新宿区',
            'prefecture' => '東京都',
            'phone' => '03-1234-5678',
            'email' => 'info@tokyo-general.example.com',
            'website' => 'https://tokyo-general.example.com',
            'description' => '東京都心にある総合病院です。24時間救急対応しており、多くの診療科を備えています。',
            'is_featured' => true,
            'rating' => 4.5
        ],
        [
            'name' => '大阪メディカルセンター',
            'address' => '大阪府大阪市中央区大手前1-2-3',
            'city' => '大阪市',
            'prefecture' => '大阪府',
            'phone' => '06-1234-5678',
            'email' => 'info@osaka-medical.example.com',
            'website' => 'https://osaka-medical.example.com',
            'description' => '関西地方最大級の総合医療施設。最新の医療設備と専門医を多数取り揃えています。',
            'is_featured' => true,
            'rating' => 4.3
        ],
        [
            'name' => '横浜記念病院',
            'address' => '神奈川県横浜市西区みなとみらい2-3-4',
            'city' => '横浜市',
            'prefecture' => '神奈川県',
            'phone' => '045-123-4567',
            'email' => 'info@yokohama-memorial.example.com',
            'website' => 'https://yokohama-memorial.example.com',
            'description' => 'みなとみらいに位置する近代的な医療施設。特に循環器科と脳神経外科に強みがあります。',
            'is_featured' => false,
            'rating' => 4.0
        ]
    ];

    foreach ($hospitals as $hospital) {
        $stmt = $db->prepare("
            INSERT INTO hospitals (name, address, city, prefecture, phone, email, website, description, is_featured, rating, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $hospital['name'],
            $hospital['address'],
            $hospital['city'],
            $hospital['prefecture'],
            $hospital['phone'],
            $hospital['email'],
            $hospital['website'],
            $hospital['description'],
            $hospital['is_featured'],
            $hospital['rating']
        ]);
        
        $hospitalId = $db->lastInsertId();
        
        // 診療科の関連付け
        $departmentIds = range(1, 5); // 1〜5の診療科を各病院に割り当て
        shuffle($departmentIds);
        $selectedDepts = array_slice($departmentIds, 0, 3); // 各病院に3つの診療科を割り当て
        
        foreach ($selectedDepts as $deptId) {
            $db->exec("
                INSERT INTO hospital_departments (hospital_id, department_id, created_at, updated_at)
                VALUES ($hospitalId, $deptId, NOW(), NOW())
            ");
        }
    }

    // サンプルユーザーとサンプル医師の作成
    $users = [
        [
            'name' => '山田太郎',
            'email' => 'yamada@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'user_type' => 'doctor',
            'phone' => '090-1234-5678'
        ],
        [
            'name' => '佐藤花子',
            'email' => 'sato@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'user_type' => 'doctor',
            'phone' => '090-8765-4321'
        ],
        [
            'name' => '田中健太',
            'email' => 'tanaka@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'user_type' => 'patient',
            'phone' => '090-2222-3333'
        ]
    ];

    $specialties = ['内科', '外科', '小児科', '産婦人科', '眼科', '耳鼻咽喉科', '皮膚科', '整形外科'];

    foreach ($users as $user) {
        $stmt = $db->prepare("
            INSERT INTO users (name, email, password, user_type, phone, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $user['name'],
            $user['email'],
            $user['password'],
            $user['user_type'],
            $user['phone']
        ]);
        
        $userId = $db->lastInsertId();
        
        // 医師ユーザーの場合、doctors テーブルにも追加
        if ($user['user_type'] === 'doctor') {
            $specialty = $specialties[array_rand($specialties)];
            $hospitalId = rand(1, count($hospitals));
            $licenseNumber = 'DOC' . str_pad(rand(1, 999), 6, '0', STR_PAD_LEFT);
            $isFeatured = rand(0, 1) === 1;
            $rating = round(rand(35, 50) / 10, 1); // 3.5〜5.0の評価
            
            $stmt = $db->prepare("
                INSERT INTO doctors (user_id, specialty, license_number, hospital_id, is_featured, rating, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");
            
            $stmt->execute([
                $userId,
                $specialty,
                $licenseNumber,
                $hospitalId,
                $isFeatured,
                $rating
            ]);
        }
    }

    // サンプル疾病データの挿入
    $diseases = [
        [
            'name' => '高血圧',
            'description' => '血圧が正常値より高い状態が続く疾患です。',
            'symptoms' => '頭痛、めまい、動悸など（多くの場合は無症状）',
            'treatments' => '生活習慣の改善、薬物療法'
        ],
        [
            'name' => '糖尿病',
            'description' => '血液中の糖分（血糖値）が高い状態が続く疾患です。',
            'symptoms' => '喉の渇き、頻尿、体重減少、疲労感',
            'treatments' => '食事療法、運動療法、薬物療法'
        ],
        [
            'name' => '気管支喘息',
            'description' => '気道が炎症を起こして狭くなり、呼吸が困難になる疾患です。',
            'symptoms' => '呼吸困難、咳、喘鳴（ゼーゼーする呼吸音）',
            'treatments' => '吸入ステロイド薬、気管支拡張薬'
        ]
    ];

    foreach ($diseases as $disease) {
        $stmt = $db->prepare("
            INSERT INTO diseases (name, description, symptoms, treatments, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $disease['name'],
            $disease['description'],
            $disease['symptoms'],
            $disease['treatments']
        ]);
    }

    // コミット
    $db->commit();
    
    echo "サンプルデータの挿入が完了しました。\n";
    
} catch (PDOException $e) {
    // エラー時はロールバック
    $db->rollBack();
    echo "エラー: " . $e->getMessage() . "\n";
}
?>