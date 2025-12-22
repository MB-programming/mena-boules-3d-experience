<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/CertificateManager.php';
require_once '../../middleware/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $certManager = new CertificateManager($database);

    // Get only active certificates
    $result = $certManager->getAll(1, 100, ['is_active' => 1]);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $result['certificates']
    ]);

} catch (Exception $e) {
    error_log("Get Certificates Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
