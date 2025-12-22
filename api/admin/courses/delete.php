<?php
/**
 * Delete Course (Admin)
 * DELETE /api/admin/courses/delete
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Course.php';
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
    $courseHelper = new Course($database);

    // Require admin authentication
    $admin = requireAdmin();

    // Get input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id']) || empty($input['id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'معرف الكورس مطلوب'
        ]);
        exit();
    }

    $courseId = intval($input['id']);

    // Delete course
    $result = $courseHelper->delete($courseId);

    if ($result['success']) {
        http_response_code(200);
    } else {
        http_response_code(404);
    }

    echo json_encode($result);

} catch (Exception $e) {
    error_log("Delete Course Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
