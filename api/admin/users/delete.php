<?php
/**
 * Delete User (Admin)
 * DELETE /api/admin/users/delete
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    // Prevent deleting yourself
    if ($userId === $admin['id']) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'لا يمكنك حذف حسابك الخاص'
        ]);
        exit();
    }

    // Prevent deleting super_admin by regular admin
    if ($user['role'] === 'super_admin' && $admin['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'لا يمكنك حذف مسؤول رئيسي'
        ]);
        exit();
    }

    // Delete user
    $sql = "DELETE FROM users WHERE id = ?";
    $database->execute($sql, [$userId]);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'تم حذف المستخدم بنجاح'
    ]);

} catch (Exception $e) {
    error_log("Delete User Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
