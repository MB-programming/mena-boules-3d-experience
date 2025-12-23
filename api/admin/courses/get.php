<?php
/**
 * Get Course by ID (Admin)
 * GET /api/admin/courses/get?id=1
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Course.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
    $auth = new Auth($database);
    $courseHelper = new Course($database);

    // Require admin authentication
    $admin = requireAdmin();

    // Get course ID
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'معرف الكورس مطلوب'
        ]);
        exit();
    }

    $courseId = intval($_GET['id']);
    $course = $courseHelper->getById($courseId);

    if (!$course) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'الكورس غير موجود'
        ]);
        exit();
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'course' => $course
    ]);

} catch (Exception $e) {
    error_log("Get Course Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
