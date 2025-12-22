<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Project.php';
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
    $projectHelper = new Project($database);

    if (isset($_GET['slug'])) {
        $project = $projectHelper->getBySlug($_GET['slug']);
    } elseif (isset($_GET['id'])) {
        $project = $projectHelper->getById(intval($_GET['id']));
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف أو slug المشروع مطلوب']);
        exit();
    }

    if (!$project || $project['is_published'] != 1) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'المشروع غير موجود']);
        exit();
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'project' => $project]);

} catch (Exception $e) {
    error_log("Get Public Project Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
