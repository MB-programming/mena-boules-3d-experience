<?php
/**
 * Quotation Helper Class
 * Handles quotation/quote requests management
 */

class Quotation {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    /**
     * Create new quotation request
     */
    public function create($data, $userId = null) {
        // Validate required fields
        $requiredFields = ['name', 'email'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            return [
                'success' => false,
                'message' => 'جميع الحقول المطلوبة يجب ملؤها',
                'missing_fields' => $missingFields
            ];
        }

        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false,
                'message' => 'البريد الإلكتروني غير صالح'
            ];
        }

        $name = trim($data['name']);
        $email = trim(strtolower($data['email']));
        $phone = isset($data['phone']) ? trim($data['phone']) : null;
        $company = isset($data['company']) ? trim($data['company']) : null;
        $serviceId = isset($data['service_id']) ? intval($data['service_id']) : null;
        $projectType = isset($data['project_type']) ? trim($data['project_type']) : null;
        $budgetRange = isset($data['budget_range']) ? trim($data['budget_range']) : null;
        $timeline = isset($data['timeline']) ? trim($data['timeline']) : null;
        $description = isset($data['description']) ? trim($data['description']) : null;
        $attachments = isset($data['attachments']) ? json_encode($data['attachments']) : null;
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $sql = "INSERT INTO quotations
                (user_id, name, email, phone, company, service_id, project_type, budget_range,
                timeline, description, attachments, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            $this->db->execute($sql, [
                $userId, $name, $email, $phone, $company, $serviceId, $projectType, $budgetRange,
                $timeline, $description, $attachments, $ipAddress, $userAgent
            ]);

            $quotationId = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إرسال طلب العرض بنجاح. سنتواصل معك قريباً',
                'quotation' => $this->getById($quotationId)
            ];
        } catch (Exception $e) {
            error_log("Quotation Create Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الطلب'
            ];
        }
    }

    /**
     * Get all quotations with pagination and filters
     */
    public function getAll($page = 1, $limit = 10, $filters = []) {
        $offset = ($page - 1) * $limit;

        $where = [];
        $params = [];

        if (isset($filters['status']) && !empty($filters['status'])) {
            $where[] = "status = ?";
            $params[] = $filters['status'];
        }

        if (isset($filters['service_id']) && !empty($filters['service_id'])) {
            $where[] = "service_id = ?";
            $params[] = intval($filters['service_id']);
        }

        if (isset($filters['user_id']) && !empty($filters['user_id'])) {
            $where[] = "user_id = ?";
            $params[] = intval($filters['user_id']);
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(name LIKE ? OR email LIKE ? OR company LIKE ? OR description LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        $countSql = "SELECT COUNT(*) as total FROM quotations $whereClause";
        $countResult = $this->db->querySingle($countSql, $params);
        $total = $countResult['total'];

        $sql = "SELECT q.*, s.title as service_title, u.name as user_name
                FROM quotations q
                LEFT JOIN services s ON q.service_id = s.id
                LEFT JOIN users u ON q.user_id = u.id
                $whereClause
                ORDER BY q.created_at DESC
                LIMIT ? OFFSET ?";

        $params[] = $limit;
        $params[] = $offset;

        $quotations = $this->db->query($sql, $params);

        // Decode JSON fields
        foreach ($quotations as &$quotation) {
            $quotation['attachments'] = json_decode($quotation['attachments'] ?? '[]', true);
        }

        return [
            'success' => true,
            'quotations' => $quotations,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Get quotation by ID
     */
    public function getById($id) {
        $sql = "SELECT q.*, s.title as service_title, s.slug as service_slug, u.name as user_name, u.email as user_email
                FROM quotations q
                LEFT JOIN services s ON q.service_id = s.id
                LEFT JOIN users u ON q.user_id = u.id
                WHERE q.id = ?";

        $quotation = $this->db->querySingle($sql, [$id]);

        if ($quotation) {
            $quotation['attachments'] = json_decode($quotation['attachments'] ?? '[]', true);
        }

        return $quotation;
    }

    /**
     * Update quotation status and response (Admin)
     */
    public function updateStatus($id, $data) {
        $quotation = $this->getById($id);
        if (!$quotation) {
            return [
                'success' => false,
                'message' => 'طلب العرض غير موجود'
            ];
        }

        $fields = [];
        $params = [];

        if (isset($data['status']) && in_array($data['status'], ['pending', 'reviewing', 'quoted', 'approved', 'rejected', 'completed'])) {
            $fields[] = "status = ?";
            $params[] = $data['status'];
        }

        if (isset($data['admin_notes'])) {
            $fields[] = "admin_notes = ?";
            $params[] = trim($data['admin_notes']);
        }

        if (isset($data['quoted_price'])) {
            $fields[] = "quoted_price = ?";
            $params[] = floatval($data['quoted_price']);
        }

        if (isset($data['response_message'])) {
            $fields[] = "response_message = ?";
            $params[] = trim($data['response_message']);
            $fields[] = "responded_at = datetime('now')";
        }

        if (empty($fields)) {
            return [
                'success' => false,
                'message' => 'لا توجد بيانات للتحديث'
            ];
        }

        $params[] = $id;
        $sql = "UPDATE quotations SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);

            return [
                'success' => true,
                'message' => 'تم تحديث طلب العرض بنجاح',
                'quotation' => $this->getById($id)
            ];
        } catch (Exception $e) {
            error_log("Quotation Update Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الطلب'
            ];
        }
    }

    /**
     * Delete quotation
     */
    public function delete($id) {
        $quotation = $this->getById($id);
        if (!$quotation) {
            return [
                'success' => false,
                'message' => 'طلب العرض غير موجود'
            ];
        }

        $sql = "DELETE FROM quotations WHERE id = ?";

        try {
            $this->db->execute($sql, [$id]);

            return [
                'success' => true,
                'message' => 'تم حذف طلب العرض بنجاح'
            ];
        } catch (Exception $e) {
            error_log("Quotation Delete Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الطلب'
            ];
        }
    }

    /**
     * Get quotation statistics
     */
    public function getStats() {
        $sql = "SELECT
                COUNT(*) as total_quotations,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_quotations,
                SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing_quotations,
                SUM(CASE WHEN status = 'quoted' THEN 1 ELSE 0 END) as quoted_quotations,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_quotations,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_quotations,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_quotations,
                SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_quotations,
                SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as week_quotations,
                SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as month_quotations,
                AVG(quoted_price) as average_quoted_price,
                SUM(quoted_price) as total_quoted_value
                FROM quotations";

        return $this->db->querySingle($sql);
    }

    /**
     * Get user quotations (for logged-in users)
     */
    public function getByUserId($userId, $page = 1, $limit = 10) {
        return $this->getAll($page, $limit, ['user_id' => $userId]);
    }
}
