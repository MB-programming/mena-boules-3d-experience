<?php
/**
 * Database Setup Script
 * Run this file once to initialize the SQLite database
 */

// Allow execution from CLI or web
$isCli = php_sapi_name() === 'cli';

if (!$isCli) {
    header('Content-Type: text/html; charset=utf-8');
}

echo $isCli ? "\n=== SQLite Database Setup ===\n\n" : "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Database Setup</title><style>body{font-family:Arial,sans-serif;padding:40px;background:#f5f5f5}.container{max-width:600px;margin:0 auto;background:white;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}h1{color:#333}p{margin:10px 0}.success{color:#28a745}.error{color:#dc3545}.warning{color:#ffc107}.info{color:#17a2b8}pre{background:#f8f9fa;padding:15px;border-radius:5px;overflow-x:auto}</style></head><body><div class='container'><h1>🗄️ SQLite Database Setup</h1>";

try {
    // Include database configuration
    require_once __DIR__ . '/database.php';
    require_once __DIR__ . '/../helpers/Database.php';
    
    echo $isCli ? "✓ Configuration loaded\n" : "<p class='success'>✓ Configuration loaded</p>";
    
    // Create database instance
    $db = new Database();
    
    // Get connection (this will create the database and tables)
    $conn = $db->getConnection();
    
    echo $isCli ? "✓ Database connection established\n" : "<p class='success'>✓ Database connection established</p>";
    echo $isCli ? "✓ Database path: " . DB_PATH . "\n" : "<p class='info'>📁 Database path: " . DB_PATH . "</p>";
    
    // Check if tables were created
    $tables = $db->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    $tableNames = array_column($tables, 'name');
    
    echo $isCli ? "\n✓ Tables created:\n" : "<p class='success'>✓ Tables created:</p><ul>";
    foreach ($tableNames as $table) {
        if ($table !== 'sqlite_sequence') {
            echo $isCli ? "  - $table\n" : "<li>$table</li>";
        }
    }
    echo $isCli ? "\n" : "</ul>";
    
    // Check for admin user
    $admin = $db->querySingle("SELECT id, email, role FROM users WHERE role = 'super_admin' LIMIT 1");
    
    if ($admin) {
        echo $isCli ? "✓ Admin user exists: {$admin['email']}\n" : "<p class='success'>✓ Admin user exists: {$admin['email']}</p>";
    } else {
        echo $isCli ? "⚠ No admin user found. Creating default admin...\n" : "<p class='warning'>⚠ No admin user found. Creating default admin...</p>";
        
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $db->execute(
            "INSERT INTO users (name, email, password, role, status, email_verified) VALUES (?, ?, ?, ?, ?, ?)",
            ['Admin', 'admin@menaboules.com', $password, 'super_admin', 'active', 1]
        );
        
        echo $isCli ? "✓ Default admin created\n" : "<p class='success'>✓ Default admin created</p>";
    }
    
    echo $isCli ? "\n=== Setup Complete! ===\n" : "<hr><p class='success'><strong>✓ Setup Complete!</strong></p>";
    
    echo $isCli ? "\nDefault Admin Credentials:\n" : "<p><strong>Default Admin Credentials:</strong></p><pre>";
    echo $isCli ? "  Email: admin@menaboules.com\n" : "Email: admin@menaboules.com\n";
    echo $isCli ? "  Password: admin123\n" : "Password: admin123";
    echo $isCli ? "\n⚠ Please change the password after first login!\n" : "</pre><p class='warning'>⚠ Please change the password after first login!</p>";
    
    // Security recommendation
    echo $isCli ? "\n⚠ Security: Delete this setup file after running it!\n" : "<p class='warning'>⚠ <strong>Security:</strong> Delete this setup file (setup.php) after running it!</p>";
    
} catch (Exception $e) {
    $error = "Error: " . $e->getMessage();
    echo $isCli ? "✗ $error\n" : "<p class='error'>✗ $error</p>";
}

echo $isCli ? "\n" : "</div></body></html>";
