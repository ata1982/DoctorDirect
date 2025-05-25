<?php
require_once __DIR__ . '/config.php';

class Auth {
    public static function generateToken($user) {
        $issuedAt = time();
        $expirationTime = $issuedAt + 60 * 60 * 24; // 24時間有効
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'user_id' => $user['id'],
            'user_type' => $user['user_type']
        ];
        
        return self::encodeJWT($payload);
    }
    
    public static function authenticate() {
        $headers = getallheaders();
        
        if (!isset($headers['Authorization'])) {
            return null;
        }
        
        $authHeader = $headers['Authorization'];
        $tokenParts = explode(' ', $authHeader);
        
        if (count($tokenParts) !== 2 || $tokenParts[0] !== 'Bearer') {
            return null;
        }
        
        $token = $tokenParts[1];
        
        try {
            $payload = self::decodeJWT($token);
            
            if ($payload === null || $payload['exp'] < time()) {
                return null;
            }
            
            return [
                'user_id' => $payload['user_id'],
                'user_type' => $payload['user_type']
            ];
            
        } catch (Exception $e) {
            return null;
        }
    }
    
    public static function encodeJWT($payload) {
        $header = ['alg' => JWT_ALGORITHM, 'typ' => 'JWT'];
        
        $base64UrlHeader = self::base64UrlEncode(json_encode($header));
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }
    
    public static function decodeJWT($token) {
        $tokenParts = explode('.', $token);
        
        if (count($tokenParts) !== 3) {
            return null;
        }
        
        $header = json_decode(self::base64UrlDecode($tokenParts[0]), true);
        $payload = json_decode(self::base64UrlDecode($tokenParts[1]), true);
        $signature = self::base64UrlDecode($tokenParts[2]);
        
        // Verify signature
        $expectedSignature = hash_hmac('sha256', $tokenParts[0] . '.' . $tokenParts[1], JWT_SECRET, true);
        
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }
        
        return $payload;
    }
    
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
?>