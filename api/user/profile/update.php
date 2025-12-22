<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    $fields = [];
    $params = [];

    if (isset($input['name']) && !empty(trim($input['name']))) {
        $fields[] = "name = ?";
        $params[] = trim($input['name']);
    }

    if (isset($input['email']) && !empty(trim($input['email']))) {
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني غير صالح']);
            exit();
        }

        $checkEmail = $database->querySingle(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [trim($input['email']), $user['id']]
        );

        if ($checkEmail) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مستخدم بالفعل']);
            exit();
        }

        $fields[] = "email = ?";
        $params[] = trim(strtolower($input['email']));
    }

    if (isset($input['phone'])) {
        $fields[] = "phone = ?";
        $params[] = trim($input['phone']);
    }

    if (isset($input['avatar'])) {
        $fields[] = "avatar = ?";
        $params[] = trim($input['avatar']);
    }

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'لا توجد بيانات للتحديث']);
        exit();
    }

    $params[] = $user['id'];
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";

    $database->execute($sql, $params);

    $updatedUser = $auth->getUserById($user['id']);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'تم تحديث الملف الشخصي بنجاح',
        'user' => $updatedUser
    ]);

} catch (Exception $e) {
    error_log("Update Profile Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
