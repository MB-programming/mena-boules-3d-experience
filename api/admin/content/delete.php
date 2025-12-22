<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/ContentManager.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);
    $contentManager = new ContentManager($database);

    $admin = requireAdmin();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['setting_key']) || empty($input['setting_key'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'مفتاح الإعداد مطلوب']);
        exit();
    }

    $result = $contentManager->deleteSetting($input['setting_key']);
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Delete Setting Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
