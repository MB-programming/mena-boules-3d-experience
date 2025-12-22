<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
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
    $user = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['course_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف الدورة مطلوب']);
        exit();
    }

    $query = "INSERT INTO wishlist (user_id, course_id) VALUES (?, ?)";
    $database->execute($query, [$user['id'], $input['course_id']]);

    echo json_encode(['success' => true, 'message' => 'تمت الإضافة إلى المفضلة']);
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate') !== false) {
        echo json_encode(['success' => false, 'message' => 'الدورة موجودة بالفعل في المفضلة']);
    } else {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ']);
    }
}
