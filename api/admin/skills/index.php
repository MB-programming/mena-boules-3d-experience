<?php
/**
 * Skills Admin API
 * GET /api/admin/skills - Get all skills
 * POST /api/admin/skills - Create skill
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Skill.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $db = $database->getConnection();
    $skill = new Skill($database);
    
    $admin = requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $filters = [];
        if (isset($_GET['is_active'])) $filters['is_active'] = intval($_GET['is_active']);
        if (isset($_GET['category']) && !empty($_GET['category'])) $filters['category'] = $_GET['category'];
        if (isset($_GET['search']) && !empty($_GET['search'])) $filters['search'] = $_GET['search'];

        $result = $skill->getAll($filters);
        echo json_encode($result);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $skill->create($data);
        
        http_response_code($result['success'] ? 201 : 400);
        echo json_encode($result);
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    error_log("Skills API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
