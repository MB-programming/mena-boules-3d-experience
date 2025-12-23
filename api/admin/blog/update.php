<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Blog.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $auth = new Auth($database);
    $blog = new Blog($database);
    $admin = requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && 'update' === 'index') {
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
        $filters = [];
        if (isset($_GET['status'])) $filters['status'] = $_GET['status'];
        if (isset($_GET['category_id'])) $filters['category_id'] = $_GET['category_id'];
        if (isset($_GET['search'])) $filters['search'] = $_GET['search'];
        $result = $blog->getAll($page, $limit, $filters);
        http_response_code(200);
        echo json_encode($result);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && 'update' === 'get') {
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'معرف المقالة مطلوب']);
            exit();
        }
        $result = $blog->get($_GET['id']);
        http_response_code($result['success'] ? 200 : 404);
        echo json_encode($result);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && 'update' === 'create') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $blog->create($input, $admin['id']);
        http_response_code($result['success'] ? 201 : 400);
        echo json_encode($result);
    } elseif (($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') && 'update' === 'update') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'معرف المقالة مطلوب']);
            exit();
        }
        $result = $blog->update($input['id'], $input);
        http_response_code($result['success'] ? 200 : 400);
        echo json_encode($result);
    } elseif (($_SERVER['REQUEST_METHOD'] === 'DELETE' || $_SERVER['REQUEST_METHOD'] === 'POST') && 'update' === 'delete') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'معرف المقالة مطلوب']);
            exit();
        }
        $result = $blog->delete($input['id']);
        http_response_code($result['success'] ? 200 : 400);
        echo json_encode($result);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    error_log("Blog Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
