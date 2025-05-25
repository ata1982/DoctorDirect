<?php
require_once __DIR__ . '/../../../models/User.php';
require_once __DIR__ . '/../../../core/auth.php';

class AuthController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    public function login() {
        // POSTデータの取得
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            return [
                'error' => 'Bad Request',
                'message' => 'メールアドレスとパスワードは必須です'
            ];
        }
        
        // ユーザーの検索
        $user = $this->userModel->findByEmail($data['email']);
        
        if (!$user) {
            http_response_code(401);
            return [
                'error' => 'Unauthorized',
                'message' => 'メールアドレスまたはパスワードが正しくありません'
            ];
        }
        
        // パスワードの検証
        if (!$this->userModel->verifyPassword($data['password'], $user['password'])) {
            http_response_code(401);
            return [
                'error' => 'Unauthorized',
                'message' => 'メールアドレスまたはパスワードが正しくありません'
            ];
        }
        
        // ユーザータイプの検証（医師か患者か）
        if (isset($data['user_type']) && $user['user_type'] !== $data['user_type']) {
            http_response_code(401);
            return [
                'error' => 'Unauthorized',
                'message' => 'このアカウントは' . $data['user_type'] . 'として登録されていません'
            ];
        }
        
        // パスワードを除外
        unset($user['password']);
        
        // JWTトークンの生成
        $token = Auth::generateToken($user);
        
        return [
            'message' => 'ログインに成功しました',
            'token' => $token,
            'user' => $user
        ];
    }
    
    public function register() {
        // POSTデータの取得
        $data = json_decode(file_get_contents('php://input'), true);
        
        // 必須項目の検証
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password']) || !isset($data['user_type'])) {
            http_response_code(400);
            return [
                'error' => 'Bad Request',
                'message' => '名前、メールアドレス、パスワード、ユーザータイプは必須です'
            ];
        }
        
        // メールアドレスの重複チェック
        $existingUser = $this->userModel->findByEmail($data['email']);
        
        if ($existingUser) {
            http_response_code(409);
            return [
                'error' => 'Conflict',
                'message' => 'このメールアドレスは既に使用されています'
            ];
        }
        
        // 医師の場合は追加情報の検証
        if ($data['user_type'] === 'doctor') {
            if (!isset($data['specialty']) || !isset($data['licenseNumber'])) {
                http_response_code(400);
                return [
                    'error' => 'Bad Request',
                    'message' => '医師として登録するには、専門分野と免許番号が必要です'
                ];
            }
        }
        
        // ユーザーの作成
        try {
            $newUser = $this->userModel->create($data);
            
            // パスワードを除外
            unset($newUser['password']);
            
            return [
                'message' => '登録に成功しました',
                'user' => $newUser
            ];
            
        } catch (Exception $e) {
            http_response_code(500);
            return [
                'error' => 'Internal Server Error',
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function me() {
        $authUser = Auth::authenticate();
        
        if (!$authUser) {
            http_response_code(401);
            return [
                'error' => 'Unauthorized',
                'message' => '認証が必要です'
            ];
        }
        
        $user = $this->userModel->findById($authUser['user_id']);
        
        if (!$user) {
            http_response_code(404);
            return [
                'error' => 'Not Found',
                'message' => 'ユーザーが見つかりません'
            ];
        }
        
        // パスワードを除外
        unset($user['password']);
        
        // 医師の場合は医師情報も取得
        if ($user['user_type'] === 'doctor') {
            $doctorModel = new Doctor();
            $doctorInfo = $doctorModel->findByUserId($user['id']);
            
            if ($doctorInfo) {
                $user['doctor_info'] = $doctorInfo;
            }
        }
        
        return [
            'user' => $user
        ];
    }
    
    public function logout() {
        return [
            'message' => 'ログアウトに成功しました'
        ];
    }
}
?>