<?php
require_once __DIR__ . '/../db/database.php';

/**
 * 基本モデルクラス - CRUD操作と共通機能を提供
 */
abstract class BaseModel {
    protected $db;
    protected $table;
    protected $primaryKey = 'id';
    protected $searchableFields = [];
    protected $relations = [];
    
    /**
     * コンストラクタ
     */
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * 全レコードを取得
     * @param int $limit 1ページあたりの取得件数
     * @param int $offset 開始位置
     * @param bool $featured おすすめフラグ
     * @return array 検索結果と合計件数
     */
    public function findAll($limit = 20, $offset = 0, $featured = false) {
        $sql = "SELECT * FROM {$this->table}";
        
        if ($featured) {
            $sql .= " WHERE is_featured = 1";
        }
        
        $sql .= " ORDER BY rating DESC LIMIT ? OFFSET ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$limit, $offset]);
        
        $items = $stmt->fetchAll();
        $total = $this->countAll($featured);
        
        return [
            $this->getResultsKey() => $items,
            'total' => $total,
            'page' => floor($offset / $limit) + 1,
            'hasMore' => ($offset + $limit) < $total
        ];
    }
    
    /**
     * 全レコード数を取得
     * @param bool $featured おすすめフラグ
     * @return int レコード数
     */
    public function countAll($featured = false) {
        $sql = "SELECT COUNT(*) as count FROM {$this->table}";
        
        if ($featured) {
            $sql .= " WHERE is_featured = 1";
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $result = $stmt->fetch();
        return $result['count'];
    }
    
    /**
     * IDによる検索
     * @param int $id プライマリーキー
     * @return array|false レコードデータ
     */
    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    /**
     * 検索条件によるレコード取得
     * @param array $params 検索パラメータ
     * @param int $limit 1ページあたりの取得件数
     * @param int $offset 開始位置
     * @return array 検索結果と合計件数
     */
    public function search($params, $limit = 20, $offset = 0) {
        $sql = "SELECT * FROM {$this->table} WHERE 1=1";
        $queryParams = [];
        
        foreach ($this->searchableFields as $field => $condition) {
            if (isset($params[$field]) && $params[$field]) {
                $sql .= " AND {$condition}";
                $queryParams[] = $this->formatSearchParam($field, $params[$field]);
            }
        }
        
        $sql .= " ORDER BY rating DESC LIMIT ? OFFSET ?";
        $queryParams[] = $limit;
        $queryParams[] = $offset;
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($queryParams);
        
        $items = $stmt->fetchAll();
        
        return [
            $this->getResultsKey() => $items,
            'total' => $this->getSearchCount($params),
            'page' => floor($offset / $limit) + 1,
            'hasMore' => ($offset + $limit) < $this->getSearchCount($params)
        ];
    }
    
    /**
     * 検索条件に合う総件数を取得
     * @param array $params 検索パラメータ
     * @return int レコード数
     */
    public function getSearchCount($params) {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE 1=1";
        $queryParams = [];
        
        foreach ($this->searchableFields as $field => $condition) {
            if (isset($params[$field]) && $params[$field]) {
                $sql .= " AND {$condition}";
                $queryParams[] = $this->formatSearchParam($field, $params[$field]);
            }
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($queryParams);
        
        $result = $stmt->fetch();
        return $result['count'];
    }
    
    /**
     * レコードの更新
     * @param int $id プライマリーキー
     * @param array $data 更新データ
     * @return array|false 更新後のレコードデータ
     */
    public function update($id, $data) {
        $fields = [];
        $values = [];
        
        foreach ($data as $key => $value) {
            if ($key !== $this->primaryKey) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }
        
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        
        $stmt = $this->db->prepare("
            UPDATE {$this->table} 
            SET " . implode(', ', $fields) . " 
            WHERE {$this->primaryKey} = ?
        ");
        
        $result = $stmt->execute($values);
        
        if ($result) {
            return $this->findById($id);
        }
        
        return false;
    }
    
    /**
     * レコードの作成
     * @param array $data 作成データ
     * @return array|false 作成したレコードデータ
     */
    public function create($data) {
        $fields = array_keys($data);
        $placeholders = array_fill(0, count($fields), '?');
        
        $sql = "INSERT INTO {$this->table} (" . implode(', ', $fields) . ") 
                VALUES (" . implode(', ', $placeholders) . ")";
                
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute(array_values($data));
        
        if ($result) {
            $id = $this->db->lastInsertId();
            return $this->findById($id);
        }
        
        return false;
    }
    
    /**
     * レコードの削除
     * @param int $id プライマリーキー
     * @return bool 成功した場合true
     */
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?");
        return $stmt->execute([$id]);
    }
    
    /**
     * 結果配列のキー名を取得
     * @return string 結果キー名
     */
    protected function getResultsKey() {
        return strtolower(str_replace('Model', '', get_class($this))) . 's';
    }
    
    /**
     * 検索パラメータの書式設定
     * @param string $field フィールド名
     * @param mixed $value パラメータ値
     * @return mixed 書式設定済みの値
     */
    protected function formatSearchParam($field, $value) {
        return $this->isLikeSearch($field) ? "%{$value}%" : $value;
    }
    
    /**
     * LIKE検索を使用するか判定
     * @param string $field フィールド名
     * @return bool LIKE検索を使用する場合true
     */
    abstract protected function isLikeSearch($field);
}
?>