<?php
/**
 * Setup Admin Account
 * Run this file ONCE to create the super admin account
 * Access: http://yoursite.com/api/config/setup_admin.php
 */

require_once 'database.php';
require_once '../helpers/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Admin details
    $email = 'minaboules@minaboules.com';
    $password = 'mina2002306';
    $full_name = 'Mena Boules';
    
    // Check if admin already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Admin account already exists!'
        ]);
        exit();
    }
    
    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert admin user
    $stmt = $db->prepare("
        INSERT INTO users (full_name, email, password, role, email_verified, status, created_at)
        VALUES (?, ?, ?, 'super_admin', 1, 'active', NOW())
    ");
    
    $result = $stmt->execute([$full_name, $email, $passwordHash]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Super Admin account created successfully!',
            'credentials' => [
                'email' => $email,
                'password' => $password,
                'login_url' => 'https://academy.karizmatek.com/admin/login.html'
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create admin account'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
