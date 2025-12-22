<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/CoursePlayer.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);
    $player = new CoursePlayer($database);

    $user = requireAuth();

    if (!isset($_GET['course_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف الكورس مطلوب']);
        exit();
    }

    $result = $player->getCourseContent($user['id'], intval($_GET['course_id']));
    http_response_code($result['success'] ? 200 : 403);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Course Content Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
