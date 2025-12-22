<?php
/**
 * User Login Endpoint
 * POST /api/auth/login
 */

// Include required files
require_once '../config/database.php';
require_once '../helpers/Database.php';
require_once '../helpers/Auth.php';
require_once '../middleware/cors.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (!isset($input['email']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان'
        ]);
        exit();
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'البريد الإلكتروني غير صالح'
        ]);
        exit();
    }

    // Initialize database and auth
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);

    // Login user
    $result = $auth->login(
        trim(strtolower($input['email'])),
        $input['password']
    );

    if ($result['success']) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(401);
        echo json_encode($result);
    }

} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
