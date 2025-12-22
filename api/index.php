<?php
/**
 * API Index - Welcome Page
 */

require_once 'config/database.php';

header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    'success' => true,
    'message' => 'مرحباً بك في Mena Boules 3D Experience API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => [
            'register' => [
                'method' => 'POST',
                'url' => API_URL . '/auth/register',
                'description' => 'تسجيل مستخدم جديد'
            ],
            'login' => [
                'method' => 'POST',
                'url' => API_URL . '/auth/login',
                'description' => 'تسجيل الدخول'
            ],
            'logout' => [
                'method' => 'POST',
                'url' => API_URL . '/auth/logout',
                'description' => 'تسجيل الخروج'
            ],
            'me' => [
                'method' => 'GET',
                'url' => API_URL . '/auth/me',
                'description' => 'الحصول على بيانات المستخدم الحالي'
            ],
            'forgot-password' => [
                'method' => 'POST',
                'url' => API_URL . '/auth/forgot-password',
                'description' => 'نسيان كلمة المرور'
            ],
            'reset-password' => [
                'method' => 'POST',
                'url' => API_URL . '/auth/reset-password',
                'description' => 'إعادة تعيين كلمة المرور'
            ]
        ]
    ],
    'documentation' => API_URL . '/README.md'
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
