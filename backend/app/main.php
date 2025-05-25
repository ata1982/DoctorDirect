<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/core/config.php';
require_once __DIR__ . '/db/database.php';
require_once __DIR__ . '/core/router.php';
require_once __DIR__ . '/core/auth.php';

// Load implemented models only
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Doctor.php';
require_once __DIR__ . '/models/Hospital.php';

// Load implemented controllers only
require_once __DIR__ . '/api/v1/endpoints/AuthController.php';
require_once __DIR__ . '/api/v1/endpoints/DoctorController.php';
require_once __DIR__ . '/api/v1/endpoints/HospitalController.php';

try {
    $router = new Router();
    
    // Authentication routes
    $router->post('/api/auth/login', 'AuthController@login');
    $router->post('/api/auth/register', 'AuthController@register');
    $router->post('/api/auth/logout', 'AuthController@logout');
    $router->get('/api/auth/me', 'AuthController@me');
    
    // Doctor routes
    $router->get('/api/doctors', 'DoctorController@index');
    $router->get('/api/doctors/{id}', 'DoctorController@show');
    $router->get('/api/search/doctors', 'DoctorController@search');
    
    // Hospital routes
    $router->get('/api/hospitals', 'HospitalController@index');
    $router->get('/api/hospitals/{id}', 'HospitalController@show');
    $router->get('/api/search/hospitals', 'HospitalController@search');
    
    /* 
    // Disease routes - 実装時にコメント解除
    $router->get('/api/diseases', 'DiseaseController@index');
    $router->get('/api/diseases/{id}', 'DiseaseController@show');
    
    // Consultation routes (protected) - 実装時にコメント解除
    $router->get('/api/consultations', 'ConsultationController@index');
    $router->post('/api/consultations', 'ConsultationController@create');
    $router->get('/api/consultations/{id}', 'ConsultationController@show');
    $router->post('/api/consultations/{id}/messages', 'ConsultationController@sendMessage');
    
    // Appointment routes (protected) - 実装時にコメント解除
    $router->get('/api/appointments', 'AppointmentController@index');
    $router->post('/api/appointments', 'AppointmentController@create');
    $router->delete('/api/appointments/{id}', 'AppointmentController@cancel');
    */
    
    $router->dispatch();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => $e->getMessage()
    ]);
}
?>