<?php
require_once __DIR__ . '/../../../models/Doctor.php';
require_once __DIR__ . '/../../../core/auth.php';

class DoctorController {
    private $doctorModel;
    
    public function __construct() {
        $this->doctorModel = new Doctor();
    }
    
    public function index() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $offset = ($page - 1) * $limit;
        $featured = isset($_GET['featured']) && $_GET['featured'] === 'true';
        
        return $this->doctorModel->findAll($limit, $offset, $featured);
    }
    
    public function show($id) {
        $doctor = $this->doctorModel->findById($id);
        
        if (!$doctor) {
            http_response_code(404);
            return [
                'error' => 'Not Found',
                'message' => '医師が見つかりません'
            ];
        }
        
        return $doctor;
    }
    
    public function search() {
        $params = $_GET;
        $limit = isset($params['limit']) ? (int)$params['limit'] : 20;
        $page = isset($params['page']) ? (int)$params['page'] : 1;
        $offset = ($page - 1) * $limit;
        
        return $this->doctorModel->search($params, $limit, $offset);
    }
}
?>