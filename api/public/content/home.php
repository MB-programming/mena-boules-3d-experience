<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/ContentManager.php';
require_once '../../middleware/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $contentManager = new ContentManager($database);

    $content = $contentManager->getHomeContent();

    http_response_code(200);
    echo json_encode(['success' => true, 'content' => $content]);

} catch (Exception $e) {
    error_log("Get Home Content Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
