<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
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
    $wallet = new Wallet($database);

    $user = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['amount']) || $input['amount'] <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'المبلغ غير صحيح']);
        exit();
    }

    $paymentMethod = $input['payment_method'] ?? 'bank_transfer';
    $description = $input['description'] ?? 'إضافة رصيد';

    $result = $wallet->addFunds($user['id'], floatval($input['amount']), $paymentMethod, $description);
    
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Add Funds Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
