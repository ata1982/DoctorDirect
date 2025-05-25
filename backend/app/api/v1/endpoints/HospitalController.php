<?php
require_once __DIR__ . '/../../../models/Hospital.php';
require_once __DIR__ . '/../../../core/auth.php';

class HospitalController {
    private $hospitalModel;
    
    public function __construct() {
        $this->hospitalModel = new Hospital();
    }
    
    public function index() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $offset = ($page - 1) * $limit;
        $featured = isset($_GET['featured']) && $_GET['featured'] === 'true';
        
        return $this->hospitalModel->findAll($limit, $offset, $featured);
    }
    
    public function show($id) {
        $hospital = $this->hospitalModel->findById($id);
        
        if (!$hospital) {
            http_response_code(404);
            return [
                'error' => 'Not Found',
                'message' => '病院が見つかりません'
            ];
        }
        
        return $hospital;
    }
    
    public function search() {
        $params = $_GET;
        $limit = isset($params['limit']) ? (int)$params['limit'] : 20;
        $page = isset($params['page']) ? (int)$params['page'] : 1;
        $offset = ($page - 1) * $limit;
        
        return $this->hospitalModel->search($params, $limit, $offset);
    }
}
?>