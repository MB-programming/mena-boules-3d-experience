<?php
/**
 * About Content Admin API
 * GET /api/admin/about - Get about content
 * PUT /api/admin/about - Update about content
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/AboutContent.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $db = $database->getConnection();
    $about = new AboutContent($database);
    
    $admin = requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $result = $about->get();
        echo json_encode($result);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $about->update($data);
        
        http_response_code($result['success'] ? 200 : 400);
        echo json_encode($result);
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    error_log("About API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
