<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/CertificateManager.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $auth = new Auth($database);
    $certManager = new CertificateManager($database);

    $admin = requireAdmin();
    $input = json_decode(file_get_contents('php://input'), true);

    $result = $certManager->create($input);
    http_response_code($result['success'] ? 201 : 400);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Create Certificate Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
