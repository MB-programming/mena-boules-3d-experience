-- Create database
CREATE DATABASE IF NOT EXISTS mena_boules_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mena_boules_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    avatar VARCHAR(255) NULL,
    role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
    email_verified TINYINT(1) DEFAULT 0,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email verification table
CREATE TABLE IF NOT EXISTS email_verifications (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    content LONGTEXT NULL,
    image VARCHAR(255) NULL,
    video_url VARCHAR(255) NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    duration INT(11) NULL COMMENT 'Duration in minutes',
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    category VARCHAR(100) NULL,
    is_published TINYINT(1) DEFAULT 0,
    featured TINYINT(1) DEFAULT 0,
    students_count INT(11) DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_by INT(11) UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_is_published (is_published),
    INDEX idx_featured (featured),
    INDEX idx_category (category),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    progress INT(11) DEFAULT 0 COMMENT 'Progress percentage 0-100',
    completed TINYINT(1) DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course lessons table (optional - for structured courses)
CREATE TABLE IF NOT EXISTS course_lessons (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id INT(11) UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    content LONGTEXT NULL,
    video_url VARCHAR(255) NULL,
    duration INT(11) NULL COMMENT 'Duration in minutes',
    order_index INT(11) DEFAULT 0,
    is_free TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
INSERT INTO users (name, email, password, role, status, email_verified)
VALUES (
    'Admin',
    'admin@menaboules.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'super_admin',
    'active',
    1
) ON DUPLICATE KEY UPDATE email=email;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    content LONGTEXT NULL,
    client_name VARCHAR(255) NULL,
    project_type VARCHAR(100) NULL COMMENT 'e.g., 3D Design, Animation, VFX',
    category VARCHAR(100) NULL,
    images TEXT NULL COMMENT 'JSON array of image URLs',
    video_url VARCHAR(255) NULL,
    completion_date DATE NULL,
    duration INT(11) NULL COMMENT 'Project duration in days',
    technologies TEXT NULL COMMENT 'JSON array of technologies used',
    is_published TINYINT(1) DEFAULT 0,
    featured TINYINT(1) DEFAULT 0,
    views_count INT(11) DEFAULT 0,
    order_index INT(11) DEFAULT 0,
    created_by INT(11) UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_is_published (is_published),
    INDEX idx_featured (featured),
    INDEX idx_category (category),
    INDEX idx_project_type (project_type),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description VARCHAR(500) NULL,
    description TEXT NULL,
    content LONGTEXT NULL,
    icon VARCHAR(255) NULL COMMENT 'Icon name or URL',
    image VARCHAR(255) NULL,
    price_starting DECIMAL(10, 2) DEFAULT 0.00,
    price_type ENUM('fixed', 'hourly', 'project', 'custom') DEFAULT 'custom',
    features TEXT NULL COMMENT 'JSON array of service features',
    category VARCHAR(100) NULL,
    is_published TINYINT(1) DEFAULT 0,
    featured TINYINT(1) DEFAULT 0,
    order_index INT(11) DEFAULT 0,
    created_by INT(11) UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_is_published (is_published),
    INDEX idx_featured (featured),
    INDEX idx_category (category),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quotations table
CREATE TABLE IF NOT EXISTS quotations (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    company VARCHAR(255) NULL,
    service_id INT(11) UNSIGNED NULL,
    project_type VARCHAR(100) NULL,
    budget_range VARCHAR(100) NULL,
    timeline VARCHAR(100) NULL,
    description TEXT NULL,
    attachments TEXT NULL COMMENT 'JSON array of file URLs',
    status ENUM('pending', 'reviewing', 'quoted', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    admin_notes TEXT NULL,
    quoted_price DECIMAL(10, 2) NULL,
    response_message TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    certificate_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    completion_date DATE NOT NULL,
    grade VARCHAR(20) NULL,
    instructor_name VARCHAR(255) NULL,
    certificate_url VARCHAR(255) NULL COMMENT 'PDF URL if generated',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_certificate_code (certificate_code),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course progress tracking
CREATE TABLE IF NOT EXISTS course_progress (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    lesson_id INT(11) UNSIGNED NULL,
    progress_percentage INT(11) DEFAULT 0,
    last_watched_lesson INT(11) UNSIGNED NULL,
    watch_time INT(11) DEFAULT 0 COMMENT 'Total watch time in seconds',
    completed TINYINT(1) DEFAULT 0,
    completed_at TIMESTAMP NULL,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_course (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lesson progress tracking
CREATE TABLE IF NOT EXISTS lesson_progress (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    lesson_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    watched TINYINT(1) DEFAULT 0,
    watch_duration INT(11) DEFAULT 0 COMMENT 'Watched duration in seconds',
    completed TINYINT(1) DEFAULT 0,
    completed_at TIMESTAMP NULL,
    last_position INT(11) DEFAULT 0 COMMENT 'Last position in seconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shopping cart
CREATE TABLE IF NOT EXISTS cart (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders/Transactions
CREATE TABLE IF NOT EXISTS orders (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT(11) UNSIGNED NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('wallet', 'credit_card', 'paypal', 'bank_transfer', 'cash') DEFAULT 'wallet',
    payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255) NULL COMMENT 'External payment gateway transaction ID',
    notes TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User wallet
CREATE TABLE IF NOT EXISTS wallet (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL UNIQUE,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    total_deposited DECIMAL(10, 2) DEFAULT 0.00,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wallet transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal', 'purchase', 'refund', 'bonus') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    description TEXT NULL,
    reference_type VARCHAR(50) NULL COMMENT 'order, course, etc',
    reference_id INT(11) UNSIGNED NULL,
    payment_method VARCHAR(50) NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
