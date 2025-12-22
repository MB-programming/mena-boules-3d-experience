<?php
class Company {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    // Get all companies
    public function getAll($page = 1, $limit = 50, $filters = []) {
        $offset = ($page - 1) * $limit;
        $where = [];
        $params = [];

        if (isset($filters['is_active'])) {
            $where[] = "is_active = ?";
            $params[] = $filters['is_active'];
        }

        if (isset($filters['is_current'])) {
            $where[] = "is_current = ?";
            $params[] = $filters['is_current'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(company_name LIKE ? OR position LIKE ? OR company_handle LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM companies $whereClause";
        $totalResult = $this->db->querySingle($countQuery, $params);
        $total = $totalResult['total'];

        // Get companies
        $query = "SELECT * FROM companies $whereClause ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $companies = $this->db->query($query, $params);

        return [
            'success' => true,
            'companies' => $companies,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ];
    }

    // Get company by ID
    public function getById($id) {
        $query = "SELECT * FROM companies WHERE id = ?";
        $company = $this->db->querySingle($query, [$id]);

        if (!$company) {
            return ['success' => false, 'message' => 'الشركة غير موجودة'];
        }

        return ['success' => true, 'company' => $company];
    }

    // Create company
    public function create($data) {
        $requiredFields = ['company_name', 'position', 'start_date'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return ['success' => false, 'message' => "حقل $field مطلوب"];
            }
        }

        $query = "INSERT INTO companies (
            company_name, position, company_handle, start_date, end_date,
            is_current, logo_url, logo_bg_color, display_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            $data['company_name'],
            $data['position'],
            $data['company_handle'] ?? null,
            $data['start_date'],
            $data['end_date'] ?? null,
            isset($data['is_current']) ? (int)$data['is_current'] : 0,
            $data['logo_url'] ?? null,
            $data['logo_bg_color'] ?? '#667eea',
            $data['display_order'] ?? 0,
            isset($data['is_active']) ? (int)$data['is_active'] : 1
        ];

        $companyId = $this->db->execute($query, $params);

        if ($companyId) {
            return [
                'success' => true,
                'message' => 'تم إضافة الشركة بنجاح',
                'id' => $companyId
            ];
        }

        return ['success' => false, 'message' => 'فشل إضافة الشركة'];
    }

    // Update company
    public function update($id, $data) {
        // Check if company exists
        $existing = $this->getById($id);
        if (!$existing['success']) {
            return $existing;
        }

        $query = "UPDATE companies SET
            company_name = ?,
            position = ?,
            company_handle = ?,
            start_date = ?,
            end_date = ?,
            is_current = ?,
            logo_url = ?,
            logo_bg_color = ?,
            display_order = ?,
            is_active = ?
        WHERE id = ?";

        $params = [
            $data['company_name'] ?? $existing['company']['company_name'],
            $data['position'] ?? $existing['company']['position'],
            $data['company_handle'] ?? $existing['company']['company_handle'],
            $data['start_date'] ?? $existing['company']['start_date'],
            $data['end_date'] ?? $existing['company']['end_date'],
            isset($data['is_current']) ? (int)$data['is_current'] : $existing['company']['is_current'],
            $data['logo_url'] ?? $existing['company']['logo_url'],
            $data['logo_bg_color'] ?? $existing['company']['logo_bg_color'],
            $data['display_order'] ?? $existing['company']['display_order'],
            isset($data['is_active']) ? (int)$data['is_active'] : $existing['company']['is_active'],
            $id
        ];

        $result = $this->db->execute($query, $params);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم تحديث الشركة بنجاح'];
        }

        return ['success' => false, 'message' => 'فشل تحديث الشركة'];
    }

    // Delete company
    public function delete($id) {
        $query = "DELETE FROM companies WHERE id = ?";
        $result = $this->db->execute($query, [$id]);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم حذف الشركة بنجاح'];
        }

        return ['success' => false, 'message' => 'فشل حذف الشركة'];
    }

    // Update display order
    public function updateOrder($orders) {
        try {
            $this->db->beginTransaction();

            foreach ($orders as $order) {
                if (!isset($order['id']) || !isset($order['display_order'])) {
                    continue;
                }

                $query = "UPDATE companies SET display_order = ? WHERE id = ?";
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
