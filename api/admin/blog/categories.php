<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/BlogCategory.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);
    $blogCategory = new BlogCategory($database);
    $admin = requireAdmin();
    $input = json_decode(file_get_contents('php://input'), true);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $result = $blogCategory->getAll();
        echo json_encode($result);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($input['id'])) {
        $result = $blogCategory->create($input);
        echo json_encode($result);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' || (isset($input['id']) && isset($input['_method']) && $input['_method'] === 'PUT')) {
        $result = $blogCategory->update($input['id'], $input);
        echo json_encode($result);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' || (isset($input['_method']) && $input['_method'] === 'DELETE')) {
        $result = $blogCategory->delete($input['id']);
        echo json_encode($result);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    error_log("Category Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
