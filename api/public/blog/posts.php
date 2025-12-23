<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Blog.php';
require_once '../../middleware/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $blog = new Blog($database);

    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    
    $filters = ['status' => 'published'];
    if (isset($_GET['category'])) $filters['category_id'] = $_GET['category'];
    if (isset($_GET['featured'])) $filters['is_featured'] = 1;
    if (isset($_GET['search'])) $filters['search'] = $_GET['search'];

    $result = $blog->getAll($page, $limit, $filters);
    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Blog Posts Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
