<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Quotations.php';
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
    $database->conn = $db;
    $auth = new Auth($database);
    $helper = new Quotations($database);
    
    $admin = requireAdmin();
    
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف مطلوب']);
        exit();
    }
    
    $item = $helper->getById(intval($_GET['id']));
    
    if (!$item) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'غير موجود']);
        exit();
    }
    
    http_response_code(200);
    echo json_encode(['success' => true, 'quotation' => $item]);
    
} catch (Exception $e) {
    error_log("Get Quotations Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
