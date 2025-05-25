<?php
require_once __DIR__ . '/../db/database.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }
    
    public function create($data) {
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt = $this->db->prepare("
            INSERT INTO users (name, email, password, user_type, phone, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $data['name'],
            $data['email'],
            $hashedPassword,
            $data['user_type'],
            $data['phone'] ?? null
        ]);
        
        $userId = $this->db->lastInsertId();
        
        // 医師の場合は医師情報も作成
        if ($data['user_type'] === 'doctor' && isset($data['specialty']) && isset($data['licenseNumber'])) {
            $stmtDoctor = $this->db->prepare("
                INSERT INTO doctors (user_id, specialty, license_number, hospital_id, created_at, updated_at) 
                VALUES (?, ?, ?, ?, NOW(), NOW())
            ");
            
            $stmtDoctor->execute([
                $userId,
                $data['specialty'],
                $data['licenseNumber'],
                $data['hospitalId'] ?? null
            ]);
        }
        
        return $this->findById($userId);
    }
    
    public function update($id, $data) {
        $fields = [];
        $values = [];
        
        foreach ($data as $key => $value) {
            if ($key === 'password') {
                $fields[] = "$key = ?";
                $values[] = password_hash($value, PASSWORD_DEFAULT);
            } else if ($key !== 'id' && $key !== 'user_type') {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }
        
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        
        $stmt = $this->db->prepare("
            UPDATE users 
            SET " . implode(', ', $fields) . " 
            WHERE id = ?
        ");
        
        $stmt->execute($values);
        
        return $this->findById($id);
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function verifyPassword($password, $hashedPassword) {
        return password_verify($password, $hashedPassword);
    }
}
?>