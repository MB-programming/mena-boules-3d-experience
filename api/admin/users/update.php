<?php
/**
 * Update User (Admin)
 * PUT /api/admin/users/update
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);

    // Require admin authentication
    $admin = requireAdmin();

    // Get input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id']) || empty($input['id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'معرف المستخدم مطلوب'
        ]);
        exit();
    }

    $userId = intval($input['id']);

    // Check if user exists
    $user = $auth->getUserById($userId);
    if (!$user) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'المستخدم غير موجود'
        ]);
        exit();
    }

    // Prevent super_admin from being modified by regular admin
    if ($user['role'] === 'super_admin' && $admin['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'لا يمكنك تعديل مسؤول رئيسي'
        ]);
        exit();
    }

    // Build update query
    $fields = [];
    $params = [];

    if (isset($input['name']) && !empty(trim($input['name']))) {
        $fields[] = "name = ?";
        $params[] = trim($input['name']);
    }

    if (isset($input['email']) && !empty(trim($input['email']))) {
        // Check if email is already used by another user
        $checkEmail = $database->querySingle(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [trim($input['email']), $userId]
        );

        if ($checkEmail) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'البريد الإلكتروني مستخدم بالفعل'
            ]);
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

    if (isset($input['role']) && in_array($input['role'], ['user', 'admin', 'super_admin'])) {
        // Only super_admin can change roles to super_admin
        if ($input['role'] === 'super_admin' && $admin['role'] !== 'super_admin') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'لا يمكنك تعيين صلاحية مسؤول رئيسي'
            ]);
            exit();
        }

        $fields[] = "role = ?";
        $params[] = $input['role'];
    }

    if (isset($input['status']) && in_array($input['status'], ['active', 'inactive', 'suspended'])) {
        $fields[] = "status = ?";
        $params[] = $input['status'];
    }

    if (isset($input['email_verified'])) {
        $fields[] = "email_verified = ?";
        $params[] = intval($input['email_verified']);
    }

    // Update password if provided
    if (isset($input['password']) && !empty($input['password'])) {
        if (strlen($input['password']) < 6) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
            ]);
            exit();
        }

        $fields[] = "password = ?";
        $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
    }

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'لا توجد بيانات للتحديث'
        ]);
        exit();
    }

    $params[] = $userId;
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";

    $database->execute($sql, $params);

    // Get updated user
    $updatedUser = $auth->getUserById($userId);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'تم تحديث المستخدم بنجاح',
        'user' => $updatedUser
    ]);

} catch (Exception $e) {
    error_log("Update User Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
