<?php
/**
 * User Registration Endpoint
 * POST /api/auth/register
 */

// Include required files
require_once '../config/database.php';
require_once '../helpers/Database.php';
require_once '../helpers/Auth.php';
require_once '../helpers/Email.php';
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
    $requiredFields = ['name', 'email', 'password'];
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

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'البريد الإلكتروني غير صالح'
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
    $email = new Email();

    // Register user
    $result = $auth->register(
        trim($input['name']),
        trim(strtolower($input['email'])),
        $input['password'],
        isset($input['phone']) ? trim($input['phone']) : null
    );

    if ($result['success']) {
        // Send welcome email (optional - don't fail registration if email fails)
        try {
            $email->sendWelcomeEmail($input['email'], $input['name']);
        } catch (Exception $e) {
            error_log("Welcome email failed: " . $e->getMessage());
        }

        http_response_code(201);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }

} catch (Exception $e) {
    error_log("Registration Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
