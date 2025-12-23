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

    if (!isset($_GET['key']) || empty($_GET['key'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'مفتاح الإعداد مطلوب']);
        exit();
    }

    $setting = $contentManager->getSetting($_GET['key']);

    if (!$setting) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'الإعداد غير موجود']);
        exit();
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'setting' => $setting]);

} catch (Exception $e) {
    error_log("Get Setting Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
