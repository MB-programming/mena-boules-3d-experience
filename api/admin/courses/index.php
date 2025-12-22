<?php
/**
 * Get All Courses (Admin)
 * GET /api/admin/courses
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
    $database->conn = $db;
    $auth = new Auth($database);
    $course = new Course($database);

    // Require admin authentication
    $admin = requireAdmin();

    // Get query parameters
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;

    // Build filters
    $filters = [];

    if (isset($_GET['is_published'])) {
        $filters['is_published'] = intval($_GET['is_published']);
    }

    if (isset($_GET['featured'])) {
        $filters['featured'] = intval($_GET['featured']);
    }

    if (isset($_GET['level']) && !empty($_GET['level'])) {
        $filters['level'] = $_GET['level'];
    }

    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $filters['category'] = $_GET['category'];
    }

    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $filters['search'] = $_GET['search'];
    }

    // Get courses
    $result = $course->getAll($page, $limit, $filters);

    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Courses Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
