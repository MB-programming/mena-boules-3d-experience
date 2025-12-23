<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Quotations.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $auth = new Auth($database);
    $helper = new Quotations($database);
    
    $admin = requireAdmin();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف مطلوب']);
        exit();
    }
    
    $result = $helper->delete(intval($input['id']));
    http_response_code($result['success'] ? 200 : 404);
    echo json_encode($result);
    
} catch (Exception $e) {
    error_log("Delete Quotations Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
