<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Quotation.php';
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
    $auth = new Auth($database);
    $quotation = new Quotation($database);

    $admin = requireAdmin();

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;

    $filters = [];
    if (isset($_GET['status']) && !empty($_GET['status'])) $filters['status'] = $_GET['status'];
    if (isset($_GET['service_id']) && !empty($_GET['service_id'])) $filters['service_id'] = $_GET['service_id'];
    if (isset($_GET['search']) && !empty($_GET['search'])) $filters['search'] = $_GET['search'];

    $result = $quotation->getAll($page, $limit, $filters);
    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Quotations Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
