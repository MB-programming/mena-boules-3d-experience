<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/BlogCategory.php';
require_once '../../middleware/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $blogCategory = new BlogCategory($database);

    $result = $blogCategory->getAll(['is_active' => 1]);
    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Blog Categories Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
