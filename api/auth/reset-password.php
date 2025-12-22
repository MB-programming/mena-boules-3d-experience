<?php
/**
 * Reset Password Endpoint
 * POST /api/auth/reset-password
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
    $requiredFields = ['token', 'password'];
    $missingFields = [];

    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            $missingFields[] = $field;
        }
    }

    if (!empty($missingFields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'جميع الحقول مطلوبة',
            'missing_fields' => $missingFields
        ]);
        exit();
    }

    // Validate password length
    if (strlen($input['password']) < 6) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        ]);
        exit();
    }

    // Validate password confirmation if provided
    if (isset($input['password_confirmation']) && $input['password'] !== $input['password_confirmation']) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'كلمة المرور وتأكيد كلمة المرور غير متطابقين'
        ]);
        exit();
    }

    // Initialize database and auth
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);

    // Reset password
    $result = $auth->resetPassword($input['token'], $input['password']);

    if ($result['success']) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }

} catch (Exception $e) {
    error_log("Reset Password Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
