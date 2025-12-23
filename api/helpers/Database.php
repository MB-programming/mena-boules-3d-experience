<?php
/**
 * Database Helper Class
 * Handles database connection and queries using PDO with SQLite
 */

class Database {
    private $db_path;
    private $conn;

    public function __construct() {
        $this->db_path = defined('DB_PATH') ? DB_PATH : __DIR__ . '/../data/database.sqlite';
    }

    /**
     * Get database connection
     */
    public function getConnection() {
        $this->conn = null;

        try {
            // Ensure the data directory exists
            $dataDir = dirname($this->db_path);
            if (!is_dir($dataDir)) {
                mkdir($dataDir, 0755, true);
            }

            $dsn = "sqlite:" . $this->db_path;
            $this->conn = new PDO($dsn);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
            // Enable foreign keys in SQLite
            $this->conn->exec("PRAGMA foreign_keys = ON");
            
            // Initialize database if empty
            $this->initializeDatabase();
            
        } catch(PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }

        return $this->conn;
    }

    /**
     * Initialize database with tables if they don't exist
     */
    private function initializeDatabase() {
        // Check if tables exist
        $result = $this->conn->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
        if ($result->fetch()) {
            return; // Tables already exist
        }

        // Create tables
        $this->createTables();
    }

    /**
     * Create all database tables
     */
    private function createTables() {
        $sql = "
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            phone TEXT,
            avatar TEXT,
            role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'super_admin')),
            email_verified INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Sessions table
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL UNIQUE,
            ip_address TEXT,
            user_agent TEXT,
            last_activity TEXT DEFAULT (datetime('now')),
            expires_at TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Projects table
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            title_ar TEXT,
            slug TEXT UNIQUE,
            description TEXT,
            description_ar TEXT,
            content TEXT,
            client_name TEXT,
            project_type TEXT,
            category TEXT,
            images TEXT,
            video_url TEXT,
            completion_date TEXT,
            duration INTEGER,
            technologies TEXT,
            is_published INTEGER DEFAULT 1,
            featured INTEGER DEFAULT 0,
            views_count INTEGER DEFAULT 0,
            order_index INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Skills table
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_ar TEXT,
            category TEXT,
            icon TEXT,
            proficiency INTEGER DEFAULT 0,
            order_index INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Companies table
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_ar TEXT,
            logo TEXT,
            website TEXT,
            description TEXT,
            description_ar TEXT,
            role TEXT,
            role_ar TEXT,
            start_date TEXT,
            end_date TEXT,
            is_current INTEGER DEFAULT 0,
            order_index INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Certificates table
        CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            title_ar TEXT,
            issuer TEXT,
            issuer_ar TEXT,
            issue_date TEXT,
            expiry_date TEXT,
            credential_id TEXT,
            credential_url TEXT,
            image TEXT,
            description TEXT,
            description_ar TEXT,
            order_index INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Blog posts table
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            title_ar TEXT,
            slug TEXT UNIQUE,
            excerpt TEXT,
            excerpt_ar TEXT,
            content TEXT,
            content_ar TEXT,
            featured_image TEXT,
            category TEXT,
            tags TEXT,
            author_id INTEGER,
            status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
            views_count INTEGER DEFAULT 0,
            is_featured INTEGER DEFAULT 0,
            published_at TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- Blog categories table
        CREATE TABLE IF NOT EXISTS blog_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_ar TEXT,
            slug TEXT UNIQUE,
            description TEXT,
            order_index INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        );

        -- Site content/settings table
        CREATE TABLE IF NOT EXISTS site_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section TEXT NOT NULL,
            key_name TEXT NOT NULL,
            value TEXT,
            value_ar TEXT,
            content_type TEXT DEFAULT 'text',
            updated_at TEXT DEFAULT (datetime('now')),
            UNIQUE(section, key_name)
        );

        -- About section table
        CREATE TABLE IF NOT EXISTS about_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            title_ar TEXT,
            subtitle TEXT,
            subtitle_ar TEXT,
            description TEXT,
            description_ar TEXT,
            image TEXT,
            resume_url TEXT,
            stats TEXT,
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Services table
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            title_ar TEXT,
            slug TEXT UNIQUE,
            short_description TEXT,
            short_description_ar TEXT,
            description TEXT,
            description_ar TEXT,
            icon TEXT,
            image TEXT,
            price_starting REAL DEFAULT 0,
            price_type TEXT DEFAULT 'custom',
            features TEXT,
            category TEXT,
            is_published INTEGER DEFAULT 1,
            featured INTEGER DEFAULT 0,
            order_index INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Courses table
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE,
            description TEXT,
            content TEXT,
            image TEXT,
            video_url TEXT,
            price REAL DEFAULT 0,
            duration INTEGER,
            level TEXT DEFAULT 'beginner',
            category TEXT,
            is_published INTEGER DEFAULT 0,
            featured INTEGER DEFAULT 0,
            students_count INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Quotations table
        CREATE TABLE IF NOT EXISTS quotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            service_id INTEGER,
            project_type TEXT,
            budget_range TEXT,
            timeline TEXT,
            description TEXT,
            attachments TEXT,
            status TEXT DEFAULT 'pending',
            admin_notes TEXT,
            quoted_price REAL,
            response_message TEXT,
            ip_address TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
        );

        -- Create default admin user (password: admin123)
        INSERT OR IGNORE INTO users (name, email, password, role, status, email_verified) 
        VALUES ('Admin', 'admin@menaboules.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'active', 1);

        -- Create default about content
        INSERT OR IGNORE INTO about_content (id, title, title_ar, subtitle, subtitle_ar, description, description_ar)
        VALUES (1, 'About Me', 'عني', 'Creative 3D Artist', 'فنان ثلاثي الأبعاد مبدع', 'Welcome to my portfolio', 'مرحباً بكم في معرض أعمالي');
        ";

        $statements = array_filter(array_map('trim', explode(';', $sql)));
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                $this->conn->exec($statement);
            }
        }
    }

    /**
     * Execute a query and return all results
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch(PDOException $e) {
            error_log("Query Error: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }

    /**
     * Execute a query and return single row
     */
    public function querySingle($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetch();
        } catch(PDOException $e) {
            error_log("Query Error: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }

    /**
     * Execute an insert/update/delete query
     */
    public function execute($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute($params);
        } catch(PDOException $e) {
            error_log("Execute Error: " . $e->getMessage());
            throw new Exception("Database execute failed");
        }
    }

    /**
     * Get last inserted ID
     */
    public function lastInsertId() {
        return $this->conn->lastInsertId();
    }

    /**
     * Begin transaction
     */
    public function beginTransaction() {
        return $this->conn->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit() {
        return $this->conn->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback() {
        return $this->conn->rollback();
    }

    /**
     * Check if connection is active
     */
    public function isConnected() {
        return $this->conn !== null;
    }

    /**
     * Get the raw PDO connection
     */
    public function getPdo() {
        return $this->conn;
    }
}
