<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Service.php';
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
    $serviceHelper = new Service($database);

    if (isset($_GET['slug'])) {
        $service = $serviceHelper->getBySlug($_GET['slug']);
    } elseif (isset($_GET['id'])) {
        $service = $serviceHelper->getById(intval($_GET['id']));
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف أو slug الخدمة مطلوب']);
        exit();
    }

    if (!$service || $service['is_published'] != 1) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'الخدمة غير موجودة']);
        exit();
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'service' => $service]);

} catch (Exception $e) {
    error_log("Get Public Service Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
