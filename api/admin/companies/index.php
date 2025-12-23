<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Company.php';
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
    $company = new Company($database);

    $admin = requireAdmin();

    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

    $filters = [];
    if (isset($_GET['is_active'])) {
        $filters['is_active'] = $_GET['is_active'];
    }
    if (isset($_GET['search'])) {
        $filters['search'] = $_GET['search'];
    }

    $result = $company->getAll($page, $limit, $filters);
    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Companies Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
