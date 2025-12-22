<?php
/**
 * Forgot Password Endpoint
 * POST /api/auth/forgot-password
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

    // Validate email
    if (!isset($input['email']) || empty(trim($input['email']))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'البريد الإلكتروني مطلوب'
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
    $email = new Email();

    // Create password reset token
    $result = $auth->createPasswordResetToken(trim(strtolower($input['email'])));

    if ($result['success']) {
        // Send reset email
        try {
            $emailResult = $email->sendPasswordResetEmail($result['email'], $result['token']);

            if ($emailResult['success']) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'فشل إرسال البريد الإلكتروني'
                ]);
            }
        } catch (Exception $e) {
            error_log("Email Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال البريد الإلكتروني'
            ]);
        }
    } else {
        // Don't reveal if email exists or not for security
        // Return success message anyway
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط إعادة تعيين كلمة المرور'
        ]);
    }

} catch (Exception $e) {
    error_log("Forgot Password Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
