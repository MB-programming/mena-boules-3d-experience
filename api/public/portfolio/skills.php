<?php
/**
 * Get All Skills (Public)
 * GET /api/public/skills
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Skill.php';
require_once '../../middleware/cors.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $skill = new Skill($database);

    $filters = ['is_active' => 1];
    
    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $filters['category'] = $_GET['category'];
    }

    $result = $skill->getAll($filters);
    
    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Get Skills Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
