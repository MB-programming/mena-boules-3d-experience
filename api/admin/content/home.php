<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/ContentManager.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $auth = new Auth($database);
    $contentManager = new ContentManager($database);

    $admin = requireAdmin();

    $settings = $contentManager->getByCategory('home', false);

    http_response_code(200);
    echo json_encode(['success' => true, 'settings' => $settings]);

} catch (Exception $e) {
    error_log("Get Home Settings Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
