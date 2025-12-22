<?php
/**
 * Service Helper Class
 * Handles service management operations
 */

class Service {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    /**
     * Create slug from title
     */
    private function createSlug($title) {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        return trim($slug, '-');
    }

    /**
     * Check if slug exists
     */
    private function slugExists($slug, $excludeId = null) {
        $sql = "SELECT id FROM services WHERE slug = ?";
        $params = [$slug];

        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->db->querySingle($sql, $params);
        return $result ? true : false;
    }

    /**
     * Generate unique slug
     */
    private function generateUniqueSlug($title, $excludeId = null) {
        $slug = $this->createSlug($title);
        $originalSlug = $slug;
        $counter = 1;

        while ($this->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Create new service
     */
    public function create($data, $createdBy) {
        if (!isset($data['title']) || empty(trim($data['title']))) {
            return [
                'success' => false,
                'message' => 'عنوان الخدمة مطلوب'
            ];
        }

        $slug = $this->generateUniqueSlug($data['title']);

        $title = trim($data['title']);
        $shortDescription = isset($data['short_description']) ? trim($data['short_description']) : null;
        $description = isset($data['description']) ? trim($data['description']) : null;
        $content = isset($data['content']) ? $data['content'] : null;
        $icon = isset($data['icon']) ? trim($data['icon']) : null;
        $image = isset($data['image']) ? trim($data['image']) : null;
        $priceStarting = isset($data['price_starting']) ? floatval($data['price_starting']) : 0.00;
        $priceType = isset($data['price_type']) ? $data['price_type'] : 'custom';
        $features = isset($data['features']) ? json_encode($data['features']) : null;
        $category = isset($data['category']) ? trim($data['category']) : null;
        $isPublished = isset($data['is_published']) ? intval($data['is_published']) : 0;
        $featured = isset($data['featured']) ? intval($data['featured']) : 0;
        $orderIndex = isset($data['order_index']) ? intval($data['order_index']) : 0;

        $sql = "INSERT INTO services
                (title, slug, short_description, description, content, icon, image, price_starting,
                price_type, features, category, is_published, featured, order_index, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            $this->db->execute($sql, [
                $title, $slug, $shortDescription, $description, $content, $icon, $image, $priceStarting,
                $priceType, $features, $category, $isPublished, $featured, $orderIndex, $createdBy
            ]);

            $serviceId = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إنشاء الخدمة بنجاح',
                'service' => $this->getById($serviceId)
            ];
        } catch (Exception $e) {
            error_log("Service Create Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء الخدمة'
            ];
        }
    }

    /**
     * Get all services with pagination and filters
     */
    public function getAll($page = 1, $limit = 10, $filters = []) {
        $offset = ($page - 1) * $limit;

        $where = [];
        $params = [];

        if (isset($filters['is_published'])) {
            $where[] = "is_published = ?";
            $params[] = $filters['is_published'];
        }

        if (isset($filters['featured'])) {
            $where[] = "featured = ?";
            $params[] = $filters['featured'];
        }

        if (isset($filters['category']) && !empty($filters['category'])) {
            $where[] = "category = ?";
            $params[] = $filters['category'];
        }

        if (isset($filters['price_type']) && !empty($filters['price_type'])) {
            $where[] = "price_type = ?";
            $params[] = $filters['price_type'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(title LIKE ? OR short_description LIKE ? OR description LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        $countSql = "SELECT COUNT(*) as total FROM services $whereClause";
        $countResult = $this->db->querySingle($countSql, $params);
        $total = $countResult['total'];

        $sql = "SELECT s.*, u.name as creator_name
                FROM services s
                LEFT JOIN users u ON s.created_by = u.id
                $whereClause
                ORDER BY s.order_index ASC, s.created_at DESC
                LIMIT ? OFFSET ?";

        $params[] = $limit;
        $params[] = $offset;

        $services = $this->db->query($sql, $params);

        // Decode JSON fields
        foreach ($services as &$service) {
            $service['features'] = json_decode($service['features'] ?? '[]', true);
        }

        return [
            'success' => true,
            'services' => $services,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Get service by ID
     */
    public function getById($id) {
        $sql = "SELECT s.*, u.name as creator_name
                FROM services s
                LEFT JOIN users u ON s.created_by = u.id
                WHERE s.id = ?";

        $service = $this->db->querySingle($sql, [$id]);

        if ($service) {
            $service['features'] = json_decode($service['features'] ?? '[]', true);
        }

        return $service;
    }

    /**
     * Get service by slug
     */
    public function getBySlug($slug) {
        $sql = "SELECT s.*, u.name as creator_name
                FROM services s
                LEFT JOIN users u ON s.created_by = u.id
                WHERE s.slug = ?";

        $service = $this->db->querySingle($sql, [$slug]);

        if ($service) {
            $service['features'] = json_decode($service['features'] ?? '[]', true);
        }

        return $service;
    }

    /**
     * Update service
     */
    public function update($id, $data) {
        $service = $this->getById($id);
        if (!$service) {
            return [
                'success' => false,
                'message' => 'الخدمة غير موجودة'
            ];
        }

        $fields = [];
        $params = [];

        if (isset($data['title']) && !empty(trim($data['title']))) {
            $fields[] = "title = ?";
            $params[] = trim($data['title']);

            if ($data['title'] !== $service['title']) {
                $slug = $this->generateUniqueSlug($data['title'], $id);
                $fields[] = "slug = ?";
                $params[] = $slug;
            }
        }

        if (isset($data['short_description'])) {
            $fields[] = "short_description = ?";
            $params[] = trim($data['short_description']);
        }

        if (isset($data['description'])) {
            $fields[] = "description = ?";
            $params[] = trim($data['description']);
        }

        if (isset($data['content'])) {
            $fields[] = "content = ?";
            $params[] = $data['content'];
        }

        if (isset($data['icon'])) {
            $fields[] = "icon = ?";
            $params[] = trim($data['icon']);
        }

        if (isset($data['image'])) {
            $fields[] = "image = ?";
            $params[] = trim($data['image']);
        }

        if (isset($data['price_starting'])) {
            $fields[] = "price_starting = ?";
            $params[] = floatval($data['price_starting']);
        }

        if (isset($data['price_type'])) {
            $fields[] = "price_type = ?";
            $params[] = $data['price_type'];
        }

        if (isset($data['features'])) {
            $fields[] = "features = ?";
            $params[] = json_encode($data['features']);
        }

        if (isset($data['category'])) {
            $fields[] = "category = ?";
            $params[] = trim($data['category']);
        }

        if (isset($data['is_published'])) {
            $fields[] = "is_published = ?";
            $params[] = intval($data['is_published']);
        }

        if (isset($data['featured'])) {
            $fields[] = "featured = ?";
            $params[] = intval($data['featured']);
        }

        if (isset($data['order_index'])) {
            $fields[] = "order_index = ?";
            $params[] = intval($data['order_index']);
        }

        if (empty($fields)) {
            return [
                'success' => false,
                'message' => 'لا توجد بيانات للتحديث'
            ];
        }

        $params[] = $id;
        $sql = "UPDATE services SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);

            return [
                'success' => true,
                'message' => 'تم تحديث الخدمة بنجاح',
                'service' => $this->getById($id)
            ];
        } catch (Exception $e) {
            error_log("Service Update Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الخدمة'
            ];
        }
    }

    /**
     * Delete service
     */
    public function delete($id) {
        $service = $this->getById($id);
        if (!$service) {
            return [
                'success' => false,
                'message' => 'الخدمة غير موجودة'
            ];
        }

        $sql = "DELETE FROM services WHERE id = ?";

        try {
            $this->db->execute($sql, [$id]);

            return [
                'success' => true,
                'message' => 'تم حذف الخدمة بنجاح'
            ];
        } catch (Exception $e) {
            error_log("Service Delete Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الخدمة'
            ];
        }
    }

    /**
     * Get service statistics
     */
    public function getStats() {
        $sql = "SELECT
                COUNT(*) as total_services,
                SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published_services,
                SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured_services
                FROM services";

        return $this->db->querySingle($sql);
    }
}
