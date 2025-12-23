<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Company.php';
require_once '../../middleware/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $company = new Company($database);

    // Get only active companies
    $result = $company->getAll(1, 100, ['is_active' => 1]);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $result['companies']
    ]);

} catch (Exception $e) {
    error_log("Get Companies Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
