<?php
/**
 * Get Current User Endpoint
 * GET /api/auth/me
 */

// Include required files
require_once '../config/database.php';
require_once '../helpers/Database.php';
require_once '../helpers/Auth.php';
require_once '../middleware/cors.php';
require_once '../middleware/auth.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    // Initialize database and auth
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);

    // Require authentication
    $user = requireAuth();

    // Return user data
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);

} catch (Exception $e) {
    error_log("Get User Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
