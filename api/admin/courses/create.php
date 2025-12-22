<?php
/**
 * Create Course (Admin)
 * POST /api/admin/courses/create
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Course.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    // Create course
    $result = $courseHelper->create($input, $admin['id']);

    if ($result['success']) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    echo json_encode($result);

} catch (Exception $e) {
    error_log("Create Course Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
