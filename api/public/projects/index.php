<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Project.php';
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
    $project = new Project($database);

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(50, intval($_GET['limit']))) : 12;

    $filters = ['is_published' => 1]; // Only published
    if (isset($_GET['featured'])) $filters['featured'] = intval($_GET['featured']);
    if (isset($_GET['project_type']) && !empty($_GET['project_type'])) $filters['project_type'] = $_GET['project_type'];
    if (isset($_GET['category']) && !empty($_GET['category'])) $filters['category'] = $_GET['category'];
    if (isset($_GET['search']) && !empty($_GET['search'])) $filters['search'] = $_GET['search'];

    $result = $project->getAll($page, $limit, $filters);
    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Public Projects Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
