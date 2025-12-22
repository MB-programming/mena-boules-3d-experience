<?php
/**
 * Get Admin Dashboard Statistics
 * GET /api/admin/stats
 */

require_once '../config/database.php';
require_once '../helpers/Database.php';
require_once '../helpers/Auth.php';
require_once '../helpers/Course.php';
require_once '../middleware/cors.php';
require_once '../middleware/admin.php';

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
    $courseHelper = new Course($database);

    // Require admin authentication
    $admin = requireAdmin();

    // Get user statistics
    $userStats = $database->querySingle("
        SELECT
            COUNT(*) as total_users,
            SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users,
            SUM(CASE WHEN role = 'super_admin' THEN 1 ELSE 0 END) as super_admin_users,
            SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as regular_users,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
            SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users,
            SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_users,
            SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as new_users_today,
            SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_users_week,
            SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_users_month
        FROM users
    ");

    // Get course statistics
    $courseStats = $courseHelper->getStats();

    // Get enrollment statistics
    $enrollmentStats = $database->querySingle("
        SELECT
            COUNT(*) as total_enrollments,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_enrollments,
            AVG(progress) as average_progress,
            SUM(CASE WHEN DATE(enrolled_at) = CURDATE() THEN 1 ELSE 0 END) as enrollments_today,
            SUM(CASE WHEN DATE(enrolled_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as enrollments_week,
            SUM(CASE WHEN DATE(enrolled_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as enrollments_month
        FROM course_enrollments
    ");

    // Get recent users
    $recentUsers = $database->query("
        SELECT id, name, email, role, status, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
    ");

    // Get recent courses
    $recentCourses = $database->query("
        SELECT c.id, c.title, c.slug, c.is_published, c.students_count, c.created_at, u.name as creator_name
        FROM courses c
        LEFT JOIN users u ON c.created_by = u.id
        ORDER BY c.created_at DESC
        LIMIT 5
    ");

    // Get popular courses
    $popularCourses = $database->query("
        SELECT c.id, c.title, c.slug, c.students_count, c.rating, c.is_published
        FROM courses c
        WHERE c.is_published = 1
        ORDER BY c.students_count DESC, c.rating DESC
        LIMIT 5
    ");

    // Get course categories distribution
    $categoryStats = $database->query("
        SELECT
            category,
            COUNT(*) as count,
            SUM(students_count) as total_students
        FROM courses
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY count DESC
        LIMIT 10
    ");

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'stats' => [
            'users' => $userStats,
            'courses' => $courseStats,
            'enrollments' => $enrollmentStats,
            'categories' => $categoryStats
        ],
        'recent' => [
            'users' => $recentUsers,
            'courses' => $recentCourses
        ],
        'popular_courses' => $popularCourses
    ]);

} catch (Exception $e) {
    error_log("Get Stats Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
