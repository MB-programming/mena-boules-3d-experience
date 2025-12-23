<?php
/**
 * Database Configuration for SQLite
 */

// SQLite Database Path
define('DB_PATH', __DIR__ . '/../data/database.sqlite');

// Application Settings
define('APP_NAME', 'Mena Boules 3D Experience');
define('APP_URL', 'https://minaboules.com');
define('API_URL', 'https://academy.karizmatek.com/api');

// Email Settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('SMTP_FROM', 'noreply@menaboules.com');
define('SMTP_FROM_NAME', APP_NAME);

// Security Settings
define('JWT_SECRET', 'your-secret-key-change-this-in-production');
define('PASSWORD_RESET_EXPIRE', 3600); // 1 hour in seconds
define('SESSION_LIFETIME', 86400); // 24 hours

// CORS Settings
define('ALLOWED_ORIGINS', [
    'https://minaboules.com',
    'https://academy.karizmatek.com',
    'http://localhost:5173',
    'http://localhost:3000',
]);
