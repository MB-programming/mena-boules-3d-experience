<?php
/**
 * Authentication Middleware
 * Verifies user authentication token
 */

function requireAuth() {
    // Initialize auth if not already done
    if (!isset($GLOBALS['auth'])) {
        require_once __DIR__ . '/../config/database.php';
        require_once __DIR__ . '/../helpers/Database.php';
        require_once __DIR__ . '/../helpers/Auth.php';

        $database = new Database();
        $GLOBALS['auth'] = new Auth($database);
    }

    $auth = $GLOBALS['auth'];

    // Get token from header
    $headers = getallheaders();
    $token = null;

    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        // Extract token from "Bearer TOKEN" format
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }

    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'غير مصرح - يجب تسجيل الدخول'
        ]);
        exit();
    }

    // Verify token
    $user = $auth->verifyToken($token);

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'جلسة غير صالحة - يرجى تسجيل الدخول مرة أخرى'
        ]);
        exit();
    }

    return $user;
}

/**
 * Get current authenticated user (optional auth)
 */
function getCurrentUser() {
    // Initialize auth if not already done
    if (!isset($GLOBALS['auth'])) {
        require_once __DIR__ . '/../config/database.php';
        require_once __DIR__ . '/../helpers/Database.php';
        require_once __DIR__ . '/../helpers/Auth.php';

        $database = new Database();
        $GLOBALS['auth'] = new Auth($database);
    }

    $auth = $GLOBALS['auth'];

    $headers = getallheaders();
    $token = null;

    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }

    if (!$token) {
        return null;
    }

    return $auth->verifyToken($token);
}
