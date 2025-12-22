<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Certificate.php';
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
    $certificate = new Certificate($database);

    $user = requireAuth();
    $certificates = $certificate->getUserCertificates($user['id']);

    http_response_code(200);
    echo json_encode(['success' => true, 'certificates' => $certificates]);

} catch (Exception $e) {
    error_log("Get Certificates Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
