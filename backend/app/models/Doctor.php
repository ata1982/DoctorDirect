<?php
require_once __DIR__ . '/../db/database.php';
require_once __DIR__ . '/BaseModel.php';

/**
 * 医師モデルクラス
 */
class Doctor extends BaseModel {
    /**
     * コンストラクタ
     */
    public function __construct() {
        parent::__construct();
        $this->table = 'doctors';
        $this->searchableFields = [
            'specialty' => 'd.specialty LIKE ?',
            'hospital_id' => 'd.hospital_id = ?',
            'name' => 'u.name LIKE ?'
        ];
    }
    
    /**
     * 全医師データを取得（関連データも含む）
     * @param int $limit 1ページあたりの取得件数
     * @param int $offset 開始位置
     * @param bool $featured おすすめフラグ
     * @return array 検索結果と合計件数
     */
    public function findAll($limit = 20, $offset = 0, $featured = false) {
        $sql = "
            SELECT d.*, u.name, u.email, u.phone, h.name as hospital_name 
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN hospitals h ON d.hospital_id = h.id
        ";
        
        if ($featured) {
            $sql .= " WHERE d.is_featured = 1";
        }
        
        $sql .= " ORDER BY d.rating DESC LIMIT ? OFFSET ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$limit, $offset]);
        
        $doctors = $stmt->fetchAll();
        $total = $this->countAll($featured);
        
        return [
            'doctors' => $doctors,
            'total' => $total,
            'page' => floor($offset / $limit) + 1,
            'hasMore' => ($offset + $limit) < $total
        ];
    }
    
    /**
     * IDによる医師データ取得（関連データも含む）
     * @param int $id 医師ID
     * @return array|false 医師データ
     */
    public function findById($id) {
        $stmt = $this->db->prepare("
            SELECT d.*, u.name, u.email, u.phone, h.name as hospital_name 
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN hospitals h ON d.hospital_id = h.id
            WHERE d.id = ?
        ");
        
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    /**
     * ユーザーIDによる医師データ取得
     * @param int $userId ユーザーID
     * @return array|false 医師データ
     */
    public function findByUserId($userId) {
        $stmt = $this->db->prepare("
            SELECT d.*, u.name, u.email, u.phone, h.name as hospital_name 
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN hospitals h ON d.hospital_id = h.id
            WHERE d.user_id = ?
        ");
        
        $stmt->execute([$userId]);
        return $stmt->fetch();
    }
    
    /**
     * 条件による医師データ検索
     * @param array $params 検索条件
     * @param int $limit 1ページあたりの取得件数
     * @param int $offset 開始位置
     * @return array 検索結果と合計件数
     */
    public function search($params, $limit = 20, $offset = 0) {
        $sql = "
            SELECT d.*, u.name, u.email, u.phone, h.name as hospital_name 
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN hospitals h ON d.hospital_id = h.id
            WHERE 1=1
        ";
        
        $queryParams = [];
        
        if (isset($params['specialty']) && $params['specialty']) {
            $sql .= " AND d.specialty LIKE ?";
            $queryParams[] = '%' . $params['specialty'] . '%';
        }
        
        if (isset($params['hospital_id']) && $params['hospital_id']) {
            $sql .= " AND d.hospital_id = ?";
            $queryParams[] = $params['hospital_id'];
        }
        
        if (isset($params['name']) && $params['name']) {
            $sql .= " AND u.name LIKE ?";
            $queryParams[] = '%' . $params['name'] . '%';
        }
        
        $sql .= " ORDER BY d.rating DESC LIMIT ? OFFSET ?";
        $queryParams[] = $limit;
        $queryParams[] = $offset;
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($queryParams);
        
        $doctors = $stmt->fetchAll();
        
        $countSql = "
            SELECT COUNT(*) as count 
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            WHERE 1=1
        ";
        
        $countParams = [];
        
        if (isset($params['specialty']) && $params['specialty']) {
            $countSql .= " AND d.specialty LIKE ?";
            $countParams[] = '%' . $params['specialty'] . '%';
        }
        
        if (isset($params['hospital_id']) && $params['hospital_id']) {
            $countSql .= " AND d.hospital_id = ?";
            $countParams[] = $params['hospital_id'];
        }
        
        if (isset($params['name']) && $params['name']) {
            $countSql .= " AND u.name LIKE ?";
            $countParams[] = '%' . $params['name'] . '%';
        }
        
        $countStmt = $this->db->prepare($countSql);
        $countStmt->execute($countParams);
        
        $total = $countStmt->fetch()['count'];
        
        return [
            'doctors' => $doctors,
            'total' => $total,
            'page' => floor($offset / $limit) + 1,
            'hasMore' => ($offset + $limit) < $total
        ];
    }
    
    /**
     * LIKE検索を使用するか判定
     * @param string $field フィールド名
     * @return bool LIKE検索を使用する場合true
     */
    protected function isLikeSearch($field) {
        return in_array($field, ['name', 'specialty']);
    }
}
?>