<?php
/**
 * Skill Helper Class
 * Handles skill management operations
 */

class Skill {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    /**
     * Get all skills
     */
    public function getAll($filters = []) {
        $where = [];
        $params = [];

        if (isset($filters['is_active'])) {
            $where[] = "is_active = ?";
            $params[] = $filters['is_active'];
        }

        if (isset($filters['category']) && !empty($filters['category'])) {
            $where[] = "category = ?";
            $params[] = $filters['category'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(name LIKE ? OR name_ar LIKE ? OR category LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $sql = "SELECT * FROM skills $whereClause ORDER BY order_index ASC, id ASC";
        $skills = $this->db->query($sql, $params);

        return [
            'success' => true,
            'skills' => $skills,
            'total' => count($skills)
        ];
    }

    /**
     * Get skill by ID
     */
    public function getById($id) {
        $sql = "SELECT * FROM skills WHERE id = ?";
        $skill = $this->db->querySingle($sql, [$id]);

        if (!$skill) {
            return ['success' => false, 'message' => 'المهارة غير موجودة'];
        }

        return ['success' => true, 'skill' => $skill];
    }

    /**
     * Create skill
     */
    public function create($data) {
        if (!isset($data['name']) || empty(trim($data['name']))) {
            return ['success' => false, 'message' => 'اسم المهارة مطلوب'];
        }

        $sql = "INSERT INTO skills (name, name_ar, category, icon, proficiency, order_index, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        $params = [
            trim($data['name']),
            isset($data['name_ar']) ? trim($data['name_ar']) : null,
            isset($data['category']) ? trim($data['category']) : null,
            isset($data['icon']) ? trim($data['icon']) : null,
            isset($data['proficiency']) ? intval($data['proficiency']) : 0,
            isset($data['order_index']) ? intval($data['order_index']) : 0,
            isset($data['is_active']) ? intval($data['is_active']) : 1
        ];

        try {
            $this->db->execute($sql, $params);
            $id = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إضافة المهارة بنجاح',
                'skill' => $this->getById($id)['skill']
            ];
        } catch (Exception $e) {
            error_log("Skill Create Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل إضافة المهارة'];
        }
    }

    /**
     * Update skill
     */
    public function update($id, $data) {
        $existing = $this->getById($id);
        if (!$existing['success']) {
            return $existing;
        }

        $fields = [];
        $params = [];

        if (isset($data['name'])) {
            $fields[] = "name = ?";
            $params[] = trim($data['name']);
        }
        if (isset($data['name_ar'])) {
            $fields[] = "name_ar = ?";
            $params[] = trim($data['name_ar']);
        }
        if (isset($data['category'])) {
            $fields[] = "category = ?";
            $params[] = trim($data['category']);
        }
        if (isset($data['icon'])) {
            $fields[] = "icon = ?";
            $params[] = trim($data['icon']);
        }
        if (isset($data['proficiency'])) {
            $fields[] = "proficiency = ?";
            $params[] = intval($data['proficiency']);
        }
        if (isset($data['order_index'])) {
            $fields[] = "order_index = ?";
            $params[] = intval($data['order_index']);
        }
        if (isset($data['is_active'])) {
            $fields[] = "is_active = ?";
            $params[] = intval($data['is_active']);
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'لا توجد بيانات للتحديث'];
        }

        $fields[] = "updated_at = datetime('now')";
        $params[] = $id;

        $sql = "UPDATE skills SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);
            return [
                'success' => true,
                'message' => 'تم تحديث المهارة بنجاح',
                'skill' => $this->getById($id)['skill']
            ];
        } catch (Exception $e) {
            error_log("Skill Update Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل تحديث المهارة'];
        }
    }

    /**
     * Delete skill
     */
    public function delete($id) {
        $sql = "DELETE FROM skills WHERE id = ?";
        
        try {
            $this->db->execute($sql, [$id]);
            return ['success' => true, 'message' => 'تم حذف المهارة بنجاح'];
        } catch (Exception $e) {
            error_log("Skill Delete Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل حذف المهارة'];
        }
    }

    /**
     * Get categories
     */
    public function getCategories() {
        $sql = "SELECT DISTINCT category FROM skills WHERE category IS NOT NULL AND category != '' ORDER BY category";
        $result = $this->db->query($sql);
        return array_column($result, 'category');
    }
}
