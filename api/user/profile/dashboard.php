<?php
require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Auth.php';
require_once '../../helpers/CoursePlayer.php';
require_once '../../helpers/Wallet.php';
require_once '../../helpers/Certificate.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $database->conn = $db;
    $auth = new Auth($database);
    $player = new CoursePlayer($database);
    $wallet = new Wallet($database);
    $certificate = new Certificate($database);

    $user = requireAuth();

    // Get enrolled courses count
    $sql = "SELECT COUNT(*) as total FROM course_enrollments WHERE user_id = ?";
    $enrolledResult = $database->querySingle($sql, [$user['id']]);

    // Get completed courses count
    $sql = "SELECT COUNT(*) as total FROM course_enrollments WHERE user_id = ? AND completed = 1";
    $completedResult = $database->querySingle($sql, [$user['id']]);

    // Get certificates count
    $sql = "SELECT COUNT(*) as total FROM certificates WHERE user_id = ?";
    $certResult = $database->querySingle($sql, [$user['id']]);

    // Get wallet balance
    $walletInfo = $wallet->getWalletInfo($user['id']);

    // Get recent courses
    $recentCourses = $database->query(
        "SELECT c.*, ce.progress, ce.enrolled_at 
         FROM course_enrollments ce
         INNER JOIN courses c ON ce.course_id = c.id
         WHERE ce.user_id = ?
         ORDER BY ce.enrolled_at DESC
         LIMIT 5",
        [$user['id']]
    );

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'dashboard' => [
            'user' => $user,
            'stats' => [
                'enrolled_courses' => $enrolledResult['total'],
                'completed_courses' => $completedResult['total'],
                'certificates' => $certResult['total'],
                'wallet_balance' => $walletInfo['balance'] ?? 0
            ],
            'recent_courses' => $recentCourses
        ]
    ]);

} catch (Exception $e) {
    error_log("Dashboard Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
