<?php
/**
 * Admin Middleware
 * Verifies user has admin or super_admin role
 */

require_once __DIR__ . '/auth.php';

/**
 * Require admin role (admin or super_admin)
 */
function requireAdmin() {
    // First check if user is authenticated
    $user = requireAuth();

    // Check if user has admin role
    if (!in_array($user['role'] ?? 'user', ['admin', 'super_admin'])) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'غير مصرح - يجب أن تكون مسؤولاً للوصول إلى هذا المورد'
        ]);
        exit();
    }

    return $user;
}

/**
 * Require super admin role only
 */
function requireSuperAdmin() {
    // First check if user is authenticated
    $user = requireAuth();

    // Check if user has super_admin role
    if (($user['role'] ?? 'user') !== 'super_admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'غير مصرح - يجب أن تكون مسؤولاً رئيسياً للوصول إلى هذا المورد'
        ]);
        exit();
    }

    return $user;
}

/**
 * Check if user is admin (doesn't exit, just returns boolean)
 */
function isAdmin($user) {
    return in_array($user['role'] ?? 'user', ['admin', 'super_admin']);
}

/**
 * Check if user is super admin (doesn't exit, just returns boolean)
 */
function isSuperAdmin($user) {
    return ($user['role'] ?? 'user') === 'super_admin';
}
