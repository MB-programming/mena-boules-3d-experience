<?php
/**
 * Portfolio Company Helper Class
 * Handles companies/experience for portfolio display
 */

class PortfolioCompany {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    /**
     * Get all companies
     */
    public function getAll($filters = []) {
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
            $where[] = "(name LIKE ? OR name_ar LIKE ? OR role LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $sql = "SELECT * FROM companies $whereClause ORDER BY order_index ASC, start_date DESC";
        $companies = $this->db->query($sql, $params);

        return [
            'success' => true,
            'companies' => $companies,
            'total' => count($companies)
        ];
    }

    /**
     * Get company by ID
     */
    public function getById($id) {
        $sql = "SELECT * FROM companies WHERE id = ?";
        $company = $this->db->querySingle($sql, [$id]);

        if (!$company) {
            return ['success' => false, 'message' => 'الشركة غير موجودة'];
        }

        return ['success' => true, 'company' => $company];
    }

    /**
     * Create company
     */
    public function create($data) {
        if (!isset($data['name']) || empty(trim($data['name']))) {
            return ['success' => false, 'message' => 'اسم الشركة مطلوب'];
        }

        $sql = "INSERT INTO companies (name, name_ar, logo, website, description, description_ar, 
                role, role_ar, start_date, end_date, is_current, order_index, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            trim($data['name']),
            isset($data['name_ar']) ? trim($data['name_ar']) : null,
            isset($data['logo']) ? trim($data['logo']) : null,
            isset($data['website']) ? trim($data['website']) : null,
            isset($data['description']) ? trim($data['description']) : null,
            isset($data['description_ar']) ? trim($data['description_ar']) : null,
            isset($data['role']) ? trim($data['role']) : null,
            isset($data['role_ar']) ? trim($data['role_ar']) : null,
            isset($data['start_date']) ? $data['start_date'] : null,
            isset($data['end_date']) ? $data['end_date'] : null,
            isset($data['is_current']) ? intval($data['is_current']) : 0,
            isset($data['order_index']) ? intval($data['order_index']) : 0,
            isset($data['is_active']) ? intval($data['is_active']) : 1
        ];

        try {
            $this->db->execute($sql, $params);
            $id = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إضافة الشركة بنجاح',
                'company' => $this->getById($id)['company']
            ];
        } catch (Exception $e) {
            error_log("Company Create Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل إضافة الشركة'];
        }
    }

    /**
     * Update company
     */
    public function update($id, $data) {
        $existing = $this->getById($id);
        if (!$existing['success']) {
            return $existing;
        }

        $fields = [];
        $params = [];

        $allowedFields = ['name', 'name_ar', 'logo', 'website', 'description', 'description_ar',
                          'role', 'role_ar', 'start_date', 'end_date', 'is_current', 'order_index', 'is_active'];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                if (in_array($field, ['is_current', 'order_index', 'is_active'])) {
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

        $sql = "UPDATE companies SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);
            return [
                'success' => true,
                'message' => 'تم تحديث الشركة بنجاح',
                'company' => $this->getById($id)['company']
            ];
        } catch (Exception $e) {
            error_log("Company Update Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل تحديث الشركة'];
        }
    }

    /**
     * Delete company
     */
    public function delete($id) {
        $sql = "DELETE FROM companies WHERE id = ?";
        
        try {
            $this->db->execute($sql, [$id]);
            return ['success' => true, 'message' => 'تم حذف الشركة بنجاح'];
        } catch (Exception $e) {
            error_log("Company Delete Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل حذف الشركة'];
        }
    }
}
