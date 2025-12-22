<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
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
    $user = requireAuth();

    $query = "SELECT c.*, ce.enrolled_at, ce.progress, ce.completed_at,
              (SELECT COUNT(*) FROM course_lessons WHERE course_id = c.id) as total_lessons,
              (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ? AND lesson_id IN (SELECT id FROM course_lessons WHERE course_id = c.id) AND is_completed = 1) as completed_lessons
              FROM course_enrollments ce 
              JOIN courses c ON ce.course_id = c.id 
              WHERE ce.user_id = ? 
              ORDER BY ce.enrolled_at DESC";
    
    $courses = $database->query($query, [$user['id'], $user['id']]);

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode(['success' => false, 'message' => 'حدث خطأ']);
}
