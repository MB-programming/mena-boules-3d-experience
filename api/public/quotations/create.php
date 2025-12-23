<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Quotation.php';
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
    $auth = new Auth($database);
    $quotation = new Quotation($database);

    $input = json_decode(file_get_contents('php://input'), true);
    
    // Optional: Get current user if logged in
    $user = getCurrentUser();
    $userId = $user ? $user['id'] : null;

    $result = $quotation->create($input, $userId);
    http_response_code($result['success'] ? 201 : 400);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Create Quotation Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
