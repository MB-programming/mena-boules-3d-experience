<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Order.php';
require_once '../../helpers/Wallet.php';
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
    $order = new Order($database);

    $user = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['order_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'معرف الطلب مطلوب']);
        exit();
    }

    $result = $order->processPayment(intval($input['order_id']), $user['id']);
    
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Process Payment Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
