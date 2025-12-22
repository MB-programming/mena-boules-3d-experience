<?php
class Certificate {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    private function generateCertificateCode() {
        return 'CERT-' . strtoupper(bin2hex(random_bytes(8))) . '-' . date('Y');
    }

    public function createCertificate($userId, $courseId) {
        // Check if certificate already exists
        $sql = "SELECT id FROM certificates WHERE user_id = ? AND course_id = ?";
        $existing = $this->db->querySingle($sql, [$userId, $courseId]);
        
        if ($existing) {
            return ['success' => false, 'message' => 'الشهادة موجودة بالفعل'];
        }

        // Get user and course info
        $user = $this->db->querySingle("SELECT name FROM users WHERE id = ?", [$userId]);
        $course = $this->db->querySingle("SELECT title FROM courses WHERE id = ?", [$courseId]);
        
        if (!$user || !$course) {
            return ['success' => false, 'message' => 'بيانات غير صحيحة'];
        }

        $certificateCode = $this->generateCertificateCode();
        
        $sql = "INSERT INTO certificates (certificate_code, user_id, course_id, student_name, course_title, completion_date)
                VALUES (?, ?, ?, ?, ?, CURDATE())";
        
        try {
            $this->db->execute($sql, [$certificateCode, $userId, $courseId, $user['name'], $course['title']]);
            
            return [
                'success' => true,
                'message' => 'تم إصدار الشهادة بنجاح',
                'certificate' => $this->getByCode($certificateCode)
            ];
        } catch (Exception $e) {
            error_log("Certificate Create Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ أثناء إصدار الشهادة'];
        }
    }

    public function verifyCertificate($code) {
        $sql = "SELECT c.*, u.email as user_email 
                FROM certificates c
                LEFT JOIN users u ON c.user_id = u.id
                WHERE c.certificate_code = ?";
        
        $certificate = $this->db->querySingle($sql, [$code]);
        
        if (!$certificate) {
            return ['success' => false, 'message' => 'الشهادة غير موجودة'];
        }

        return [
            'success' => true,
            'message' => 'الشهادة صالحة',
            'certificate' => $certificate
        ];
    }

    public function getByCode($code) {
        $sql = "SELECT * FROM certificates WHERE certificate_code = ?";
        return $this->db->querySingle($sql, [$code]);
    }

    public function getUserCertificates($userId) {
        $sql = "SELECT c.*, co.slug as course_slug 
                FROM certificates c
                LEFT JOIN courses co ON c.course_id = co.id
                WHERE c.user_id = ?
                ORDER BY c.issued_at DESC";
        
        return $this->db->query($sql, [$userId]);
    }
}
