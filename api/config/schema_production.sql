-- Create database
CREATE DATABASE IF NOT EXISTS u186120816_cv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE u186120816_cv;

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

-- Site settings and page content
CREATE TABLE IF NOT EXISTS site_settings (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT NULL COMMENT 'JSON or text value',
    category ENUM('home', 'about', 'contact', 'general', 'seo', 'social') DEFAULT 'general',
    setting_type ENUM('text', 'textarea', 'json', 'image', 'boolean', 'number') DEFAULT 'text',
    is_public TINYINT(1) DEFAULT 1 COMMENT 'Can be accessed by public API',
    description TEXT NULL,
    updated_by INT(11) UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key),
    INDEX idx_category (category),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default homepage settings
INSERT INTO site_settings (setting_key, setting_value, category, setting_type, description) VALUES
('home_hero', '{
    "title": "مرحباً بك في Mena Boules 3D Experience",
    "subtitle": "تعلم التصميم ثلاثي الأبعاد مع أفضل المدربين",
    "description": "نقدم دورات احترافية في Blender, Unity, Unreal Engine وأكثر",
    "cta_text": "ابدأ التعلم الآن",
    "cta_link": "/courses",
    "background_image": "hero-bg.jpg",
    "video_url": null
}', 'home', 'json', 'محتوى Hero Section في الصفحة الرئيسية'),

('home_features', '{
    "title": "لماذا تختارنا؟",
    "subtitle": "نقدم أفضل تجربة تعليمية",
    "features": [
        {
            "icon": "fa-graduation-cap",
            "title": "دورات احترافية",
            "description": "محتوى تعليمي عالي الجودة"
        },
        {
            "icon": "fa-certificate",
            "title": "شهادات معتمدة",
            "description": "احصل على شهادة عند إتمام الدورة"
        },
        {
            "icon": "fa-users",
            "title": "مجتمع نشط",
            "description": "تواصل مع المتعلمين والمدربين"
        },
        {
            "icon": "fa-clock",
            "title": "تعلم في أي وقت",
            "description": "محتوى متاح 24/7"
        }
    ]
}', 'home', 'json', 'قسم المميزات في الصفحة الرئيسية'),

('home_stats', '{
    "stats": [
        {
            "number": "1000+",
            "label": "طالب",
            "icon": "fa-users"
        },
        {
            "number": "50+",
            "label": "دورة",
            "icon": "fa-book"
        },
        {
            "number": "100+",
            "label": "مشروع",
            "icon": "fa-project-diagram"
        },
        {
            "number": "98%",
            "label": "نسبة الرضا",
            "icon": "fa-star"
        }
    ]
}', 'home', 'json', 'قسم الإحصائيات في الصفحة الرئيسية'),

('home_testimonials', '{
    "title": "ماذا يقول طلابنا",
    "testimonials": [
        {
            "name": "أحمد محمد",
            "role": "مصمم 3D",
            "avatar": "testimonial-1.jpg",
            "rating": 5,
            "comment": "دورات رائعة ومحتوى احترافي. تعلمت الكثير!"
        },
        {
            "name": "سارة أحمد",
            "role": "مطورة ألعاب",
            "avatar": "testimonial-2.jpg",
            "rating": 5,
            "comment": "أفضل منصة تعليمية للتصميم ثلاثي الأبعاد"
        }
    ]
}', 'home', 'json', 'آراء الطلاب في الصفحة الرئيسية'),

('home_cta', '{
    "title": "ابدأ رحلتك التعليمية الآن",
    "description": "انضم إلى آلاف الطلاب وتعلم مهارات جديدة",
    "button_text": "تصفح الدورات",
    "button_link": "/courses",
    "background_image": "cta-bg.jpg"
}', 'home', 'json', 'قسم Call to Action في الصفحة الرئيسية'),

('about_hero', '{
    "title": "من نحن",
    "subtitle": "رحلتنا في عالم التصميم ثلاثي الأبعاد",
    "description": "نحن منصة تعليمية رائدة في مجال التصميم والتطوير ثلاثي الأبعاد",
    "image": "about-hero.jpg"
}', 'about', 'json', 'Hero في صفحة من نحن'),

('about_story', '{
    "title": "قصتنا",
    "content": "بدأنا رحلتنا في عام 2020 بهدف توفير تعليم عالي الجودة في مجال التصميم ثلاثي الأبعاد. اليوم، نفخر بخدمة آلاف الطلاب حول العالم.",
    "image": "our-story.jpg",
    "founded_year": "2020",
    "mission": "مهمتنا هي جعل التعليم في مجال التصميم ثلاثي الأبعاد متاحاً للجميع",
    "vision": "رؤيتنا هي أن نكون المنصة الرائدة عالمياً في تعليم التصميم ثلاثي الأبعاد"
}', 'about', 'json', 'قصتنا في صفحة من نحن'),

('about_values', '{
    "title": "قيمنا",
    "values": [
        {
            "icon": "fa-heart",
            "title": "الشغف",
            "description": "نحن شغوفون بالتصميم والتعليم"
        },
        {
            "icon": "fa-users",
            "title": "المجتمع",
            "description": "نبني مجتمعاً قوياً من المبدعين"
        },
        {
            "icon": "fa-lightbulb",
            "title": "الابتكار",
            "description": "نبتكر طرق تعليم جديدة ومميزة"
        },
        {
            "icon": "fa-star",
            "title": "الجودة",
            "description": "نلتزم بأعلى معايير الجودة"
        }
    ]
}', 'about', 'json', 'القيم في صفحة من نحن'),

('about_team', '{
    "title": "فريقنا",
    "description": "تعرف على الفريق الذي يعمل لتقديم أفضل تجربة تعليمية",
    "members": [
        {
            "name": "مينا بولس",
            "role": "المؤسس والمدير التنفيذي",
            "avatar": "team-1.jpg",
            "bio": "خبير في التصميم ثلاثي الأبعاد مع أكثر من 10 سنوات خبرة",
            "social": {
                "linkedin": "#",
                "twitter": "#",
                "instagram": "#"
            }
        }
    ]
}', 'about', 'json', 'الفريق في صفحة من نحن'),

('site_info', '{
    "site_name": "Mena Boules 3D Experience",
    "tagline": "تعلم التصميم ثلاثي الأبعاد",
    "logo": "logo.png",
    "favicon": "favicon.ico",
    "contact_email": "info@menaboules.com",
    "contact_phone": "+20 123 456 7890",
    "address": "القاهرة، مصر",
    "copyright": "© 2024 Mena Boules 3D Experience. All rights reserved."
}', 'general', 'json', 'معلومات الموقع العامة'),

('social_links', '{
    "facebook": "https://facebook.com/menaboules",
    "twitter": "https://twitter.com/menaboules",
    "instagram": "https://instagram.com/menaboules",
    "youtube": "https://youtube.com/menaboules",
    "linkedin": "https://linkedin.com/company/menaboules"
}', 'social', 'json', 'روابط مواقع التواصل الاجتماعي')

ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    company_handle VARCHAR(100) NULL COMMENT 'e.g. @Wida, @Sunweb',
    start_date VARCHAR(50) NOT NULL COMMENT 'e.g. Jan 2025',
    end_date VARCHAR(50) NULL COMMENT 'e.g. Present, Mar 2025',
    is_current TINYINT(1) DEFAULT 0,
    logo_url VARCHAR(255) NULL,
    logo_bg_color VARCHAR(20) NULL DEFAULT '#667eea' COMMENT 'Background color for logo',
    display_order INT(11) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    certificate_name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL COMMENT 'e.g. @Edraak, @Kingston Business Academy',
    year VARCHAR(50) NOT NULL COMMENT 'e.g. 2019, 2021 - Present',
    description TEXT NULL,
    logo_url VARCHAR(255) NULL,
    logo_bg_color VARCHAR(20) NULL DEFAULT '#667eea' COMMENT 'Background color for logo',
    certificate_url VARCHAR(500) NULL COMMENT 'Link to certificate verification',
    display_order INT(11) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample companies data
INSERT INTO companies (company_name, position, company_handle, start_date, end_date, is_current, logo_bg_color, display_order, is_active) VALUES
('Wida', 'Web Developer', '@Wida', 'Jan 2025', 'Present', 1, '#4a5568', 1, 1),
('Sunweb Solution', 'Team Leader', '@Sunweb Solution', 'Apr 2023', 'Present', 1, '#ef4444', 2, 1),
('Pessarde', 'Senior Web Developer', '@Pessarde', 'Jan 2024', 'Mar 2025', 0, '#10b981', 3, 1),
('SUNGROUP', 'Team Leader', '@SUNGROUP', 'May 2020', 'Present', 1, '#ef4444', 4, 1),
('Winmarket Agency', 'Team Leader', '@Winmarket Agency', 'May 2020', 'Present', 1, '#e5e7eb', 5, 1),
('Entreprenelle', 'Web Developer', '@Entreprenelle', 'May 2020', 'Dec 2025', 0, '#f3f4f6', 6, 1);

-- Insert sample certificates data
INSERT INTO certificates (certificate_name, issuer, year, logo_bg_color, display_order, is_active) VALUES
('ICDL Specto & Edraak', '@Edraak', '2019', '#ec4899', 1, 1),
('Certified Technology Trainer', '@Kingston Business Academy', '2021', '#a855f7', 2, 1),
('Certified Technology Trainer', '@Ministry of Education', '2019 - 2025', '#86efac', 3, 1),
('Commerce, Business, Management', '@Suez Canal University', '2021 - Present', '#fbbf24', 4, 1),
('Microsoft Technology Associate', '@Microsoft', '2022', '#64748b', 5, 1);

-- Blog Categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    color VARCHAR(20) NULL DEFAULT '#667eea',
    display_order INT(11) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Posts table with Advanced SEO
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT NULL,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500) NULL,
    author_id INT(11) UNSIGNED NOT NULL,
    category_id INT(11) UNSIGNED NULL,
    tags TEXT NULL COMMENT 'Comma-separated tags',
    status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    views INT(11) DEFAULT 0,
    reading_time INT(11) NULL COMMENT 'Reading time in minutes',
    
    -- Advanced SEO Fields
    meta_title VARCHAR(255) NULL,
    meta_description TEXT NULL,
    meta_keywords TEXT NULL,
    canonical_url VARCHAR(500) NULL,
    robots VARCHAR(100) NULL DEFAULT 'index, follow',
    
    -- Open Graph (Facebook, LinkedIn)
    og_title VARCHAR(255) NULL,
    og_description TEXT NULL,
    og_image VARCHAR(500) NULL,
    og_type VARCHAR(50) NULL DEFAULT 'article',
    
    -- Twitter Card
    twitter_card VARCHAR(50) NULL DEFAULT 'summary_large_image',
    twitter_title VARCHAR(255) NULL,
    twitter_description TEXT NULL,
    twitter_image VARCHAR(500) NULL,
    
    -- Schema.org JSON-LD
    schema_markup LONGTEXT NULL COMMENT 'JSON-LD structured data',
    
    is_featured TINYINT(1) DEFAULT 0,
    allow_comments TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_category_id (category_id),
    INDEX idx_is_featured (is_featured),
    INDEX idx_views (views)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id INT(11) UNSIGNED NOT NULL,
    user_id INT(11) UNSIGNED NULL,
    author_name VARCHAR(255) NULL,
    author_email VARCHAR(255) NULL,
    comment TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_id (post_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description, color, display_order) VALUES
('3D Modeling', '3d-modeling', 'دروس ومقالات عن التصميم ثلاثي الأبعاد', '#667eea', 1),
('Web Development', 'web-development', 'برمجة وتطوير المواقع', '#10b981', 2),
('Game Development', 'game-development', 'تطوير الألعاب والمحركات', '#f59e0b', 3),
('Tutorials', 'tutorials', 'دروس تعليمية خطوة بخطوة', '#ec4899', 4),
('News', 'news', 'آخر الأخبار والتحديثات', '#3b82f6', 5);

-- Insert sample blog post
INSERT INTO blog_posts (
    title, slug, excerpt, content, author_id, category_id, tags, status, published_at,
    meta_title, meta_description, meta_keywords,
    og_title, og_description, og_type,
    twitter_card, twitter_title, twitter_description,
    reading_time, is_featured
) VALUES (
    'مرحباً بك في مدونة Mena Boules 3D Experience',
    'welcome-to-blog',
    'مقدمة عن المدونة والمحتوى الذي ستجده هنا',
    '<h2>مرحباً بك!</h2><p>هذه أول مقالة في المدونة. ستجد هنا دروس ومقالات عن التصميم ثلاثي الأبعاد، تطوير الويب، وتطوير الألعاب.</p>',
    1,
    1,
    '3D,Blender,Tutorial',
    'published',
    NOW(),
    'مرحباً بك في مدونة Mena Boules | 3D Experience',
    'تعلم التصميم ثلاثي الأبعاد وتطوير الويب مع دروس احترافية',
    '3d modeling, blender, web development, tutorials',
    'مرحباً بك في مدونة Mena Boules',
    'تعلم التصميم ثلاثي الأبعاد وتطوير الويب',
    'article',
    'summary_large_image',
    'مرحباً بك في مدونة Mena Boules',
    'تعلم التصميم ثلاثي الأبعاد وتطوير الويب مع دروس احترافية',
    5,
    1
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, course_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course Access Codes (للكورسات المقفولة برقم سري)
CREATE TABLE IF NOT EXISTS course_access_codes (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id INT(11) UNSIGNED NOT NULL,
    access_code VARCHAR(50) NOT NULL UNIQUE,
    max_uses INT(11) NULL COMMENT 'NULL = unlimited',
    current_uses INT(11) DEFAULT 0,
    expires_at TIMESTAMP NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_by INT(11) UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_course_id (course_id),
    INDEX idx_access_code (access_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course Curriculum Sections
CREATE TABLE IF NOT EXISTS course_sections (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id INT(11) UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    display_order INT(11) DEFAULT 0,
    is_published TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course Lessons (Video Lessons)
CREATE TABLE IF NOT EXISTS course_lessons (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    section_id INT(11) UNSIGNED NOT NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    video_url VARCHAR(500) NULL,
    video_type ENUM('youtube', 'vimeo', 'direct', 'embed') DEFAULT 'youtube',
    video_duration INT(11) NULL COMMENT 'Duration in seconds',
    is_preview TINYINT(1) DEFAULT 0 COMMENT 'Free preview lesson',
    display_order INT(11) DEFAULT 0,
    is_published TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_section_id (section_id),
    INDEX idx_course_id (course_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course Resources (Downloadable files)
CREATE TABLE IF NOT EXISTS course_resources (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT(11) UNSIGNED NULL,
    course_id INT(11) UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NULL COMMENT 'pdf, zip, doc, etc',
    file_size INT(11) NULL COMMENT 'Size in bytes',
    download_count INT(11) DEFAULT 0,
    display_order INT(11) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course Q&A
CREATE TABLE IF NOT EXISTS course_qa (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id INT(11) UNSIGNED NOT NULL,
    lesson_id INT(11) UNSIGNED NULL,
    user_id INT(11) UNSIGNED NOT NULL,
    parent_id INT(11) UNSIGNED NULL COMMENT 'For replies',
    question TEXT NOT NULL,
    answer TEXT NULL,
    answered_by INT(11) UNSIGNED NULL,
    is_pinned TINYINT(1) DEFAULT 0,
    upvotes INT(11) DEFAULT 0,
    status ENUM('pending', 'answered', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES course_qa(id) ON DELETE CASCADE,
    FOREIGN KEY (answered_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_course_id (course_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO course_sections (course_id, title, description, display_order) VALUES
(1, 'Introduction', 'Getting started with the course', 1),
(1, 'Core Concepts', 'Understanding the fundamentals', 2),
(1, 'Advanced Topics', 'Deep dive into advanced features', 3);

INSERT INTO course_lessons (section_id, course_id, title, description, video_url, video_type, video_duration, is_preview, display_order) VALUES
(1, 1, 'Welcome to the Course', 'Introduction and course overview', 'https://youtube.com/watch?v=example1', 'youtube', 300, 1, 1),
(1, 1, 'Course Requirements', 'What you need to get started', 'https://youtube.com/watch?v=example2', 'youtube', 420, 1, 2),
(2, 1, 'Lesson 1: Basics', 'Learn the basics', 'https://youtube.com/watch?v=example3', 'youtube', 1800, 0, 1);

INSERT INTO course_resources (lesson_id, course_id, title, file_url, file_type) VALUES
(1, 1, 'Course Syllabus', 'https://example.com/syllabus.pdf', 'pdf'),
(2, 1, 'Setup Guide', 'https://example.com/setup.pdf', 'pdf'),
(3, 1, 'Project Files', 'https://example.com/files.zip', 'zip');
