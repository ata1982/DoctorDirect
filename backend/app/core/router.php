<?php
class Router {
    private $routes = [];

    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }

    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }

    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $this->getUri();
        
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }
            
            $pattern = $this->buildPatternFromPath($route['path']);
            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches); // Remove the full match
                
                // Extract the controller and method
                list($controller, $action) = explode('@', $route['handler']);
                
                // Instantiate the controller
                $controllerInstance = new $controller();
                
                // Call the method with the parameters
                echo json_encode($controllerInstance->$action(...$matches));
                return;
            }
        }
        
        // Route not found
        http_response_code(404);
        echo json_encode([
            'error' => 'Not Found',
            'message' => 'The requested resource was not found'
        ]);
    }
    
    private function getUri() {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return $uri;
    }
    
    private function buildPatternFromPath($path) {
        // Convert path parameters to regex patterns
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $path);
        $pattern = '#^' . $pattern . '$#';
        return $pattern;
    }
}

// シンプルなAPIルーター

// リクエストURIの取得
$requestUri = $_SERVER['REQUEST_URI'];
$baseUrl = '/api/' . API_VERSION;

// APIのベースURLで始まらない場合は処理しない
if (strpos($requestUri, $baseUrl) !== 0) {
    return false;
}

// CORSヘッダーの設定
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, ALLOWED_ORIGINS)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}

// OPTIONSリクエストの場合はここで終了
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// リクエストURIからパスを取得
$path = substr($requestUri, strlen($baseUrl));
$path = trim($path, '/');
$pathParts = explode('/', $path);

// HTTPメソッドの取得
$method = $_SERVER['REQUEST_METHOD'];

// レスポンスのContent-Typeをデフォルトでapplication/jsonに設定
header('Content-Type: application/json');

// リクエストボディの取得（JSON）
$requestBody = file_get_contents('php://input');
$requestData = json_decode($requestBody, true) ?? [];

// クエリパラメータのマージ
$requestData = array_merge($requestData, $_GET);

// ===== APIエンドポイントの定義 =====

// 認証エンドポイント
if ($path === 'auth/login' && $method === 'POST') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/AuthController.php';
    $controller = new AuthController();
    $controller->login();
    exit;
}

if ($path === 'auth/register' && $method === 'POST') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/AuthController.php';
    $controller = new AuthController();
    $controller->register();
    exit;
}

// Google認証エンドポイント
if ($path === 'auth/google' && $method === 'GET') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/GoogleAuthController.php';
    $controller = new GoogleAuthController();
    $controller->getAuthUrl();
    exit;
}

if ($path === 'auth/google/callback' && $method === 'GET') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/GoogleAuthController.php';
    $controller = new GoogleAuthController();
    $controller->callback();
    exit;
}

// ユーザー情報エンドポイント
if ($path === 'user' && $method === 'GET') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/UserController.php';
    $controller = new UserController();
    $controller->getCurrentUser();
    exit;
}

// 医師一覧エンドポイント
if ($path === 'doctors' && $method === 'GET') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/DoctorController.php';
    $controller = new DoctorController();
    $controller->getAllDoctors();
    exit;
}

// 医師詳細エンドポイント
if (preg_match('/^doctors\/(\d+)$/', $path, $matches) && $method === 'GET') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/DoctorController.php';
    $controller = new DoctorController();
    $controller->getDoctorById($matches[1]);
    exit;
}

// 病院一覧エンドポイント
if ($path === 'hospitals' && $method === 'GET') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/HospitalController.php';
    $controller = new HospitalController();
    $controller->getAllHospitals();
    exit;
}

// 病院詳細エンドポイント
if (preg_match('/^hospitals\/(\d+)$/', $path, $matches) && $method === 'GET') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/HospitalController.php';
    $controller = new HospitalController();
    $controller->getHospitalById($matches[1]);
    exit;
}

// 口コミ関連エンドポイント
if (preg_match('/^reviews$/', $path) && $method === 'POST') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/ReviewController.php';
    $controller = new ReviewController();
    $controller->createReview();
    exit;
}

if (preg_match('/^reviews\/like\/(\d+)$/', $path, $matches) && $method === 'POST') {
    require_once __DIR__ . '/../api/' . API_VERSION . '/endpoints/ReviewController.php';
    $controller = new ReviewController();
    $controller->likeReview($matches[1]);
    exit;
}

// 404エラー
http_response_code(404);
echo json_encode(['error' => 'リクエストされたAPIエンドポイントが見つかりません']);
exit;
?>