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
    $database->conn = $db;
    $blog = new Blog($database);

    if (!isset($_GET['slug']) && !isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف المقالة أو الرابط مطلوب']);
        exit();
    }

    $identifier = $_GET['slug'] ?? $_GET['id'];
    $result = $blog->get($identifier);

    if ($result['success']) {
        // Increment views
        $blog->incrementViews($result['post']['id']);
        
        // Only return published posts to public
        if ($result['post']['status'] !== 'published') {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'المقالة غير موجودة']);
            exit();
        }
    }

    http_response_code($result['success'] ? 200 : 404);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Blog Post Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
