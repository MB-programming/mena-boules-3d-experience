<?php
/**
 * Authentication Helper Class
 * Handles user authentication and session management
 */

class Auth {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    /**
     * Register a new user
     */
    public function register($name, $email, $password, $phone = null) {
        // Check if email already exists
        $sql = "SELECT id FROM users WHERE email = ?";
        $user = $this->db->querySingle($sql, [$email]);

        if ($user) {
            return [
                'success' => false,
                'message' => 'البريد الإلكتروني مستخدم بالفعل'
            ];
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user
        $sql = "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)";

        try {
            $this->db->execute($sql, [$name, $email, $hashedPassword, $phone]);
            $userId = $this->db->lastInsertId();

            // Create session
            $token = $this->createSession($userId);

            return [
                'success' => true,
                'message' => 'تم التسجيل بنجاح',
                'user' => [
                    'id' => $userId,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone
                ],
                'token' => $token
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء التسجيل'
            ];
        }
    }

    /**
     * Login user
     */
    public function login($email, $password) {
        $sql = "SELECT * FROM users WHERE email = ? AND status = 'active'";
        $user = $this->db->querySingle($sql, [$email]);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ];
        }

        // Verify password
        if (!password_verify($password, $user['password'])) {
            return [
                'success' => false,
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ];
        }

        // Create session
        $token = $this->createSession($user['id']);

        // Remove password from response
        unset($user['password']);

        return [
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Logout user
     */
    public function logout($token) {
        $sql = "DELETE FROM sessions WHERE token = ?";

        try {
            $this->db->execute($sql, [$token]);
            return [
                'success' => true,
                'message' => 'تم تسجيل الخروج بنجاح'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء تسجيل الخروج'
            ];
        }
    }

    /**
     * Create session for user
     */
    private function createSession($userId) {
        // Generate unique token
        $token = bin2hex(random_bytes(32));

        // Get client info
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        // Calculate expiration
        $expiresAt = date('Y-m-d H:i:s', time() + SESSION_LIFETIME);

        // Insert session
        $sql = "INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at)
                VALUES (?, ?, ?, ?, ?)";

        $this->db->execute($sql, [$userId, $token, $ipAddress, $userAgent, $expiresAt]);

        return $token;
    }

    /**
     * Verify session token
     */
    public function verifyToken($token) {
        $sql = "SELECT s.*, u.id, u.name, u.email, u.phone, u.avatar, u.status
                FROM sessions s
                INNER JOIN users u ON s.user_id = u.id
                WHERE s.token = ? AND s.expires_at > NOW() AND u.status = 'active'";

        $session = $this->db->querySingle($sql, [$token]);

        if (!$session) {
            return null;
        }

        return [
            'id' => $session['id'],
            'name' => $session['name'],
            'email' => $session['email'],
            'phone' => $session['phone'],
            'avatar' => $session['avatar'],
            'status' => $session['status']
        ];
    }

    /**
     * Get user by ID
     */
    public function getUserById($userId) {
        $sql = "SELECT id, name, email, phone, avatar, email_verified, status, created_at
                FROM users WHERE id = ?";

        return $this->db->querySingle($sql, [$userId]);
    }

    /**
     * Create password reset token
     */
    public function createPasswordResetToken($email) {
        // Check if user exists
        $sql = "SELECT id FROM users WHERE email = ?";
        $user = $this->db->querySingle($sql, [$email]);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'البريد الإلكتروني غير مسجل'
            ];
        }

        // Generate token
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + PASSWORD_RESET_EXPIRE);

        // Insert reset token
        $sql = "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)";

        try {
            $this->db->execute($sql, [$user['id'], $token, $expiresAt]);

            return [
                'success' => true,
                'message' => 'تم إرسال رابط إعادة تعيين كلمة المرور',
                'token' => $token,
                'email' => $email
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء رمز إعادة التعيين'
            ];
        }
    }

    /**
     * Reset password using token
     */
    public function resetPassword($token, $newPassword) {
        // Verify token
        $sql = "SELECT pr.*, u.email
                FROM password_resets pr
                INNER JOIN users u ON pr.user_id = u.id
                WHERE pr.token = ? AND pr.expires_at > NOW() AND pr.used = 0";

        $reset = $this->db->querySingle($sql, [$token]);

        if (!$reset) {
            return [
                'success' => false,
                'message' => 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية'
            ];
        }

        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        try {
            // Update password
            $sql = "UPDATE users SET password = ? WHERE id = ?";
            $this->db->execute($sql, [$hashedPassword, $reset['user_id']]);

            // Mark token as used
            $sql = "UPDATE password_resets SET used = 1 WHERE id = ?";
            $this->db->execute($sql, [$reset['id']]);

            // Delete all user sessions
            $sql = "DELETE FROM sessions WHERE user_id = ?";
            $this->db->execute($sql, [$reset['user_id']]);

            return [
                'success' => true,
                'message' => 'تم تغيير كلمة المرور بنجاح'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء إعادة تعيين كلمة المرور'
            ];
        }
    }

    /**
     * Clean expired sessions and reset tokens
     */
    public function cleanExpired() {
        // Delete expired sessions
        $sql = "DELETE FROM sessions WHERE expires_at < NOW()";
        $this->db->execute($sql);

        // Delete expired reset tokens
        $sql = "DELETE FROM password_resets WHERE expires_at < NOW()";
        $this->db->execute($sql);
    }
}
