<?php
/**
 * Get Skill by ID (Admin)
 * GET /api/admin/skills/get?id=xxx
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/Skill.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID is required']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $skill = new Skill($database);
    
    $admin = requireAdmin();

    $result = $skill->getById(intval($_GET['id']));
    
    http_response_code($result['success'] ? 200 : 404);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Skill Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
