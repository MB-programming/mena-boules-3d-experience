<?php
/**
 * Portfolio Certificate Helper Class
 * Handles education/certificates for portfolio display
 */

class PortfolioCertificate {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    /**
     * Get all certificates
     */
    public function getAll($filters = []) {
        $where = [];
        $params = [];

        if (isset($filters['is_active'])) {
            $where[] = "is_active = ?";
            $params[] = $filters['is_active'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(title LIKE ? OR title_ar LIKE ? OR issuer LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $sql = "SELECT * FROM certificates $whereClause ORDER BY order_index ASC, issue_date DESC";
        $certificates = $this->db->query($sql, $params);

        return [
            'success' => true,
            'certificates' => $certificates,
            'total' => count($certificates)
        ];
    }

    /**
     * Get certificate by ID
     */
    public function getById($id) {
        $sql = "SELECT * FROM certificates WHERE id = ?";
        $certificate = $this->db->querySingle($sql, [$id]);

        if (!$certificate) {
            return ['success' => false, 'message' => 'الشهادة غير موجودة'];
        }

        return ['success' => true, 'certificate' => $certificate];
    }

    /**
     * Create certificate
     */
    public function create($data) {
        if (!isset($data['title']) || empty(trim($data['title']))) {
            return ['success' => false, 'message' => 'عنوان الشهادة مطلوب'];
        }

        $sql = "INSERT INTO certificates (title, title_ar, issuer, issuer_ar, issue_date, expiry_date, 
                credential_id, credential_url, image, description, description_ar, order_index, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            trim($data['title']),
            isset($data['title_ar']) ? trim($data['title_ar']) : null,
            isset($data['issuer']) ? trim($data['issuer']) : null,
            isset($data['issuer_ar']) ? trim($data['issuer_ar']) : null,
            isset($data['issue_date']) ? $data['issue_date'] : null,
            isset($data['expiry_date']) ? $data['expiry_date'] : null,
            isset($data['credential_id']) ? trim($data['credential_id']) : null,
            isset($data['credential_url']) ? trim($data['credential_url']) : null,
            isset($data['image']) ? trim($data['image']) : null,
            isset($data['description']) ? trim($data['description']) : null,
            isset($data['description_ar']) ? trim($data['description_ar']) : null,
            isset($data['order_index']) ? intval($data['order_index']) : 0,
            isset($data['is_active']) ? intval($data['is_active']) : 1
        ];

        try {
            $this->db->execute($sql, $params);
            $id = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إضافة الشهادة بنجاح',
                'certificate' => $this->getById($id)['certificate']
            ];
        } catch (Exception $e) {
            error_log("Certificate Create Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل إضافة الشهادة'];
        }
    }

    /**
     * Update certificate
     */
    public function update($id, $data) {
        $existing = $this->getById($id);
        if (!$existing['success']) {
            return $existing;
        }

        $fields = [];
        $params = [];

        $allowedFields = ['title', 'title_ar', 'issuer', 'issuer_ar', 'issue_date', 'expiry_date',
                          'credential_id', 'credential_url', 'image', 'description', 'description_ar', 
                          'order_index', 'is_active'];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                if ($field === 'order_index' || $field === 'is_active') {
                    $params[] = intval($data[$field]);
                } else {
                    $params[] = is_string($data[$field]) ? trim($data[$field]) : $data[$field];
                }
            }
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'لا توجد بيانات للتحديث'];
        }

        $fields[] = "updated_at = datetime('now')";
        $params[] = $id;

        $sql = "UPDATE certificates SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);
            return [
                'success' => true,
                'message' => 'تم تحديث الشهادة بنجاح',
                'certificate' => $this->getById($id)['certificate']
            ];
        } catch (Exception $e) {
            error_log("Certificate Update Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل تحديث الشهادة'];
        }
    }

    /**
     * Delete certificate
     */
    public function delete($id) {
        $sql = "DELETE FROM certificates WHERE id = ?";
        
        try {
            $this->db->execute($sql, [$id]);
            return ['success' => true, 'message' => 'تم حذف الشهادة بنجاح'];
        } catch (Exception $e) {
            error_log("Certificate Delete Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل حذف الشهادة'];
        }
    }
}
