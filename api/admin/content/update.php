<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/ContentManager.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    if (!isset($input['setting_value'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'قيمة الإعداد مطلوبة']);
        exit();
    }

    $key = $input['setting_key'];
    $value = $input['setting_value'];

    // If value is array or object, encode as JSON
    if (is_array($value) || is_object($value)) {
        $value = json_encode($value, JSON_UNESCAPED_UNICODE);
    }

    $category = isset($input['category']) ? $input['category'] : null;
    $type = isset($input['setting_type']) ? $input['setting_type'] : null;
    $isPublic = isset($input['is_public']) ? $input['is_public'] : null;
    $description = isset($input['description']) ? $input['description'] : null;

    $result = $contentManager->updateSetting(
        $key,
        $value,
        $admin['id'],
        $category,
        $type,
        $isPublic,
        $description
    );

    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Update Setting Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
