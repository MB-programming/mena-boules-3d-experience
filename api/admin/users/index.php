<?php
/**
 * Get All Users (Admin)
 * GET /api/admin/users
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);

    // Require admin authentication
    $admin = requireAdmin();

    // Get query parameters
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;
    $offset = ($page - 1) * $limit;

    // Build filters
    $where = [];
    $params = [];

    if (isset($_GET['role']) && !empty($_GET['role'])) {
        $where[] = "role = ?";
        $params[] = $_GET['role'];
    }

    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $where[] = "status = ?";
        $params[] = $_GET['status'];
    }

    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $where[] = "(name LIKE ? OR email LIKE ? OR phone LIKE ?)";
        $searchTerm = '%' . $_GET['search'] . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM users $whereClause";
    $countResult = $database->querySingle($countSql, $params);
    $total = $countResult['total'];

    // Get users
    $sql = "SELECT id, name, email, phone, avatar, role, email_verified, status, created_at, updated_at
            FROM users
            $whereClause
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?";

    $params[] = $limit;
    $params[] = $offset;

    $users = $database->query($sql, $params);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'users' => $users,
        'pagination' => [
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ]
    ]);

} catch (Exception $e) {
    error_log("Get Users Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
