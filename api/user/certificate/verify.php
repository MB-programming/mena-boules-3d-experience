<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Certificate.php';
require_once '../../middleware/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $certificate = new Certificate($database);

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['code']) || empty($input['code'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'كود الشهادة مطلوب']);
        exit();
    }

    $result = $certificate->verifyCertificate($input['code']);
    http_response_code($result['success'] ? 200 : 404);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Verify Certificate Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
