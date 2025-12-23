<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Project.php';
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
    $projectHelper = new Project($database);

    $admin = requireAdmin();

    if (!isset($_GET['id']) || empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف المشروع مطلوب']);
        exit();
    }

    $project = $projectHelper->getById(intval($_GET['id']));

    if (!$project) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'المشروع غير موجود']);
        exit();
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'project' => $project]);

} catch (Exception $e) {
    error_log("Get Project Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
