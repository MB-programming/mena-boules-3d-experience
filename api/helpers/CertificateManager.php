<?php
class CertificateManager {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    // Get all certificates
    public function getAll($page = 1, $limit = 50, $filters = []) {
        $offset = ($page - 1) * $limit;
        $where = [];
        $params = [];

        if (isset($filters['is_active'])) {
            $where[] = "is_active = ?";
            $params[] = $filters['is_active'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(certificate_name LIKE ? OR issuer LIKE ? OR year LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM certificates $whereClause";
        $totalResult = $this->db->querySingle($countQuery, $params);
        $total = $totalResult['total'];

        // Get certificates
        $query = "SELECT * FROM certificates $whereClause ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $certificates = $this->db->query($query, $params);

        return [
            'success' => true,
            'certificates' => $certificates,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ];
    }

    // Get certificate by ID
    public function getById($id) {
        $query = "SELECT * FROM certificates WHERE id = ?";
        $certificate = $this->db->querySingle($query, [$id]);

        if (!$certificate) {
            return ['success' => false, 'message' => 'الشهادة غير موجودة'];
        }

        return ['success' => true, 'certificate' => $certificate];
    }

    // Create certificate
    public function create($data) {
        $requiredFields = ['certificate_name', 'issuer', 'year'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return ['success' => false, 'message' => "حقل $field مطلوب"];
            }
        }

        $query = "INSERT INTO certificates (
            certificate_name, issuer, year, description, logo_url,
            logo_bg_color, certificate_url, display_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            $data['certificate_name'],
            $data['issuer'],
            $data['year'],
            $data['description'] ?? null,
            $data['logo_url'] ?? null,
            $data['logo_bg_color'] ?? '#667eea',
            $data['certificate_url'] ?? null,
            $data['display_order'] ?? 0,
            isset($data['is_active']) ? (int)$data['is_active'] : 1
        ];

        $certificateId = $this->db->execute($query, $params);

        if ($certificateId) {
            return [
                'success' => true,
                'message' => 'تم إضافة الشهادة بنجاح',
                'id' => $certificateId
            ];
        }

        return ['success' => false, 'message' => 'فشل إضافة الشهادة'];
    }

    // Update certificate
    public function update($id, $data) {
        // Check if certificate exists
        $existing = $this->getById($id);
        if (!$existing['success']) {
            return $existing;
        }

        $query = "UPDATE certificates SET
            certificate_name = ?,
            issuer = ?,
            year = ?,
            description = ?,
            logo_url = ?,
            logo_bg_color = ?,
            certificate_url = ?,
            display_order = ?,
            is_active = ?
        WHERE id = ?";

        $params = [
            $data['certificate_name'] ?? $existing['certificate']['certificate_name'],
            $data['issuer'] ?? $existing['certificate']['issuer'],
            $data['year'] ?? $existing['certificate']['year'],
            $data['description'] ?? $existing['certificate']['description'],
            $data['logo_url'] ?? $existing['certificate']['logo_url'],
            $data['logo_bg_color'] ?? $existing['certificate']['logo_bg_color'],
            $data['certificate_url'] ?? $existing['certificate']['certificate_url'],
            $data['display_order'] ?? $existing['certificate']['display_order'],
            isset($data['is_active']) ? (int)$data['is_active'] : $existing['certificate']['is_active'],
            $id
        ];

        $result = $this->db->execute($query, $params);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم تحديث الشهادة بنجاح'];
        }

        return ['success' => false, 'message' => 'فشل تحديث الشهادة'];
    }

    // Delete certificate
    public function delete($id) {
        $query = "DELETE FROM certificates WHERE id = ?";
        $result = $this->db->execute($query, [$id]);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم حذف الشهادة بنجاح'];
        }

        return ['success' => false, 'message' => 'فشل حذف الشهادة'];
    }

    // Update display order
    public function updateOrder($orders) {
        try {
            $this->db->beginTransaction();

            foreach ($orders as $order) {
                if (!isset($order['id']) || !isset($order['display_order'])) {
                    continue;
                }

                $query = "UPDATE certificates SET display_order = ? WHERE id = ?";
                $this->db->execute($query, [$order['display_order'], $order['id']]);
            }

            $this->db->commit();
            return ['success' => true, 'message' => 'تم تحديث الترتيب بنجاح'];
        } catch (Exception $e) {
            $this->db->rollback();
            return ['success' => false, 'message' => 'فشل تحديث الترتيب'];
        }
    }
}
