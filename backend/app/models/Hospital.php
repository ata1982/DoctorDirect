<?php
require_once __DIR__ . '/../db/database.php';
require_once __DIR__ . '/BaseModel.php';

/**
 * 病院モデルクラス
 */
class Hospital extends BaseModel {
    /**
     * コンストラクタ
     */
    public function __construct() {
        parent::__construct();
        $this->table = 'hospitals';
        $this->searchableFields = [
            'name' => 'h.name LIKE ?',
            'city' => 'h.city LIKE ?',
            'department_id' => 'hd.department_id = ?'
        ];
    }
    
    /**
     * IDによる病院データ取得（関連データも含む）
     * @param int $id 病院ID
     * @return array|false 病院データ
     */
    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM hospitals WHERE id = ?");
        $stmt->execute([$id]);
        $hospital = $stmt->fetch();
        
        if ($hospital) {
            // 病院の診療科を取得
            $deptStmt = $this->db->prepare("
                SELECT d.* FROM departments d
                JOIN hospital_departments hd ON d.id = hd.department_id
                WHERE hd.hospital_id = ?
            ");
            
            $deptStmt->execute([$id]);
            $hospital['departments'] = $deptStmt->fetchAll();
            
            // 病院の医師を取得
            $doctorStmt = $this->db->prepare("
                SELECT d.*, u.name, u.email FROM doctors d
                JOIN users u ON d.user_id = u.id
                WHERE d.hospital_id = ?
                ORDER BY d.rating DESC
                LIMIT 10
            ");
            
            $doctorStmt->execute([$id]);
            $hospital['doctors'] = $doctorStmt->fetchAll();
        }
        
        return $hospital;
    }
    
    /**
     * 条件による病院データ検索
     * @param array $params 検索条件
     * @param int $limit 1ページあたりの取得件数
     * @param int $offset 開始位置
     * @return array 検索結果と合計件数
     */
    public function search($params, $limit = 20, $offset = 0) {
        $sql = "
            SELECT h.* FROM hospitals h
            LEFT JOIN hospital_departments hd ON h.id = hd.hospital_id
            LEFT JOIN departments d ON hd.department_id = d.id
            WHERE 1=1
        ";
        
        $queryParams = [];
        
        if (isset($params['name']) && $params['name']) {
            $sql .= " AND h.name LIKE ?";
            $queryParams[] = '%' . $params['name'] . '%';
        }
        
        if (isset($params['city']) && $params['city']) {
            $sql .= " AND h.city LIKE ?";
            $queryParams[] = '%' . $params['city'] . '%';
        }
        
        if (isset($params['department_id']) && $params['department_id']) {
            $sql .= " AND hd.department_id = ?";
            $queryParams[] = $params['department_id'];
        }
        
        $sql .= " GROUP BY h.id ORDER BY h.rating DESC LIMIT ? OFFSET ?";
        $queryParams[] = $limit;
        $queryParams[] = $offset;
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($queryParams);
        
        $hospitals = $stmt->fetchAll();
        
        // 検索条件に合う総件数を取得
        $countSql = "
            SELECT COUNT(DISTINCT h.id) as count
            FROM hospitals h
            LEFT JOIN hospital_departments hd ON h.id = hd.hospital_id
            LEFT JOIN departments d ON hd.department_id = d.id
            WHERE 1=1
        ";
        
        $countParams = [];
        
        if (isset($params['name']) && $params['name']) {
            $countSql .= " AND h.name LIKE ?";
            $countParams[] = '%' . $params['name'] . '%';
        }
        
        if (isset($params['city']) && $params['city']) {
            $countSql .= " AND h.city LIKE ?";
            $countParams[] = '%' . $params['city'] . '%';
        }
        
        if (isset($params['department_id']) && $params['department_id']) {
            $countSql .= " AND hd.department_id = ?";
            $countParams[] = $params['department_id'];
        }
        
        $countStmt = $this->db->prepare($countSql);
        $countStmt->execute($countParams);
        
        $total = $countStmt->fetch()['count'];
        
        return [
            'hospitals' => $hospitals,
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
        return in_array($field, ['name', 'city']);
    }
}
?>