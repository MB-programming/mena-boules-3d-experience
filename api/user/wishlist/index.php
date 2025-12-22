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

    $query = "SELECT c.*, w.created_at as added_at 
              FROM wishlist w 
              JOIN courses c ON w.course_id = c.id 
              WHERE w.user_id = ? 
              ORDER BY w.created_at DESC";
    
    $courses = $database->query($query, [$user['id']]);

    echo json_encode(['success' => true, 'wishlist' => $courses]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'حدث خطأ']);
}
