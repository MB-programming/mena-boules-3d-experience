<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/CoursePlayer.php';
require_once '../../helpers/Certificate.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['lesson_id']) || !isset($input['course_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'بيانات غير كاملة']);
        exit();
    }

    $result = $player->updateLessonProgress(
        $user['id'], 
        intval($input['lesson_id']),
        intval($input['course_id']),
        $input
    );
    
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Update Progress Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
