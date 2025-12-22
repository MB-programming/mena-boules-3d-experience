<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/auth.php';

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
    $user = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);

    $query = "DELETE FROM wishlist WHERE user_id = ? AND course_id = ?";
    $database->execute($query, [$user['id'], $input['course_id']]);

    echo json_encode(['success' => true, 'message' => 'تم الحذف من المفضلة']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'حدث خطأ']);
}
