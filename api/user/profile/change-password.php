<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);

    $user = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['current_password']) || !isset($input['new_password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'كلمة المرور الحالية والجديدة مطلوبة']);
        exit();
    }

    // Get user with password
    $sql = "SELECT password FROM users WHERE id = ?";
    $userData = $database->querySingle($sql, [$user['id']]);

    if (!password_verify($input['current_password'], $userData['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'كلمة المرور الحالية غير صحيحة']);
        exit();
    }

    if (strlen($input['new_password']) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل']);
        exit();
    }

    if (isset($input['new_password_confirmation']) && $input['new_password'] !== $input['new_password_confirmation']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'كلمة المرور الجديدة غير متطابقة']);
        exit();
    }

    $hashedPassword = password_hash($input['new_password'], PASSWORD_DEFAULT);
    
    $sql = "UPDATE users SET password = ? WHERE id = ?";
    $database->execute($sql, [$hashedPassword, $user['id']]);

    // Logout all other sessions
    $sql = "DELETE FROM sessions WHERE user_id = ?";
    $database->execute($sql, [$user['id']]);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول مرة أخرى'
    ]);

} catch (Exception $e) {
    error_log("Change Password Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
