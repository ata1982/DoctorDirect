<?php
// Database configuration - SQLite for development
define('DB_TYPE', $_ENV['DB_TYPE'] ?? 'sqlite');
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'doctor_direct');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
define('DB_PATH', __DIR__ . '/../../database/doctor_direct.db');

// JWT settings
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'your-secret-key');
define('JWT_ALGORITHM', 'HS256');

// API settings
define('API_VERSION', 'v1');
define('GEMINI_API_KEY', $_ENV['GEMINI_API_KEY'] ?? '');

// CORS settings
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://yourdomain.com'
]);

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Asia/Tokyo');

// Application settings
define('APP_URL', $_ENV['APP_URL'] ?? 'http://localhost:8000');
define('FRONTEND_URL', $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173');

// Session settings
define('SESSION_NAME', 'doctor_direct_session');
define('SESSION_LIFETIME', 86400); // 24 hours

// JWT expiry
define('JWT_EXPIRY', 3600); // 1 hour

// Google OAuth settings
// 開発環境テスト用 - 本番環境では環境変数を使用すること
define('GOOGLE_CLIENT_ID', $_ENV['GOOGLE_CLIENT_ID'] ?? '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', $_ENV['GOOGLE_CLIENT_SECRET'] ?? 'GOCSPX-abcdefghijklmnopqrstuvwxyz12345');
?>