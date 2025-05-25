<?php

class GoogleAuthController {
    private $client;
    private $db;
    
    public function __construct() {
        global $db;
        $this->db = $db;
        
        // Googleクライアントの初期化
        $this->client = new Google_Client();
        $this->client->setClientId(GOOGLE_CLIENT_ID);
        $this->client->setClientSecret(GOOGLE_CLIENT_SECRET);
        $this->client->setRedirectUri(APP_URL . '/api/' . API_VERSION . '/auth/google/callback');
        $this->client->addScope('email');
        $this->client->addScope('profile');
        
        // デバッグログ
        error_log("Google Auth Client initialized with ID: " . substr(GOOGLE_CLIENT_ID, 0, 8) . "...");
        error_log("Redirect URI set to: " . APP_URL . '/api/' . API_VERSION . '/auth/google/callback');
    }
    
    /**
     * Google認証URLを取得
     */
    public function getAuthUrl() {
        try {
            if (empty(GOOGLE_CLIENT_ID) || GOOGLE_CLIENT_ID === '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com') {
                error_log("Warning: Using test Google Client ID. This will not work for actual authentication.");
            }
            
            $authUrl = $this->client->createAuthUrl();
            error_log("Generated auth URL: " . substr($authUrl, 0, 50) . "...");
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'authUrl' => $authUrl,
                'message' => '認証URLを生成しました'
            ]);
        } catch (Exception $e) {
            error_log("Error in getAuthUrl: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                'message' => '認証URLの生成に失敗しました'
            ]);
        }
    }
    
    /**
     * Googleコールバック処理
     */
    public function callback() {
        try {
            error_log("Received Google callback. Params: " . json_encode($_GET));
            
            if (!isset($_GET['code'])) {
                error_log("No auth code provided in callback");
                throw new Exception('認証コードがありません');
            }
            
            error_log("Fetching access token with auth code");
            $token = $this->client->fetchAccessTokenWithAuthCode($_GET['code']);
            
            if (isset($token['error'])) {
                error_log("Token error: " . json_encode($token));
                throw new Exception('アクセストークンの取得に失敗しました: ' . $token['error']);
            }
            
            $this->client->setAccessToken($token);
            
            // Googleユーザー情報の取得
            $google_oauth = new Google_Service_Oauth2($this->client);
            $google_account_info = $google_oauth->userinfo->get();
            
            $google_id = $google_account_info->getId();
            $email = $google_account_info->getEmail();
            $name = $google_account_info->getName();
            $picture = $google_account_info->getPicture();
            
            error_log("Retrieved Google account info - Email: $email, Name: $name");
            
            // ユーザーがすでに存在するか確認
            $user = $this->getUserByGoogleId($google_id);
            
            if (!$user) {
                error_log("User not found by Google ID, checking by email");
                // メールアドレスでもチェック
                $userByEmail = $this->getUserByEmail($email);
                
                if ($userByEmail) {
                    error_log("User found by email, linking Google account");
                    // 既存ユーザーのGoogleアカウントを紐付け
                    $this->linkGoogleAccount($userByEmail['id'], $google_id);
                    $user = $userByEmail;
                } else {
                    error_log("Creating new user account for Google auth user");
                    // 新しいユーザーを登録
                    $user = $this->registerUser($google_id, $email, $name, $picture);
                }
            } else {
                error_log("User found by Google ID");
            }
            
            // JWTトークンの作成
            $auth = new Auth();
            $jwt = $auth->generateJWT([
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name']
            ]);
            
            error_log("JWT generated, redirecting to frontend callback");
            
            // フロントエンドへリダイレクト
            $frontendCallback = FRONTEND_URL . '/auth/callback?token=' . $jwt;
            error_log("Redirecting to: " . $frontendCallback);
            
            header('Location: ' . $frontendCallback);
            exit;
            
        } catch (Exception $e) {
            error_log("Error in Google callback: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            
            // エラーをフロントエンドに通知
            $errorMessage = urlencode($e->getMessage());
            $errorRedirect = FRONTEND_URL . '/login?error=' . $errorMessage;
            
            header('Location: ' . $errorRedirect);
            exit;
        }
    }
    
    /**
     * Google IDでユーザーを取得
     */
    private function getUserByGoogleId($googleId) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE google_id = ?");
            $stmt->execute([$googleId]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Database error in getUserByGoogleId: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * メールアドレスでユーザーを取得
     */
    private function getUserByEmail($email) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Database error in getUserByEmail: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * 既存ユーザーにGoogleアカウントを紐付け
     */
    private function linkGoogleAccount($userId, $googleId) {
        try {
            $stmt = $this->db->prepare("UPDATE users SET google_id = ? WHERE id = ?");
            $stmt->execute([$googleId, $userId]);
            return true;
        } catch (PDOException $e) {
            error_log("Database error in linkGoogleAccount: " . $e->getMessage());
            throw new Exception('Googleアカウントの紐付けに失敗しました: ' . $e->getMessage());
        }
    }
    
    /**
     * 新規ユーザー登録
     */
    private function registerUser($googleId, $email, $name, $picture) {
        try {
            // ランダムなパスワードを生成（通常のログインには使用されない）
            $password = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
            
            $stmt = $this->db->prepare("INSERT INTO users (name, email, password, google_id, profile_image, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
            $stmt->execute([$name, $email, $password, $googleId, $picture]);
            
            $userId = $this->db->lastInsertId();
            error_log("New user registered with ID: $userId");
            
            return [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'profile_image' => $picture
            ];
        } catch (PDOException $e) {
            error_log("Database error in registerUser: " . $e->getMessage());
            throw new Exception('ユーザー登録に失敗しました: ' . $e->getMessage());
        }
    }
}