<?php
class BlogCategory {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    private function generateSlug($name, $id = null) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        
        $query = "SELECT id FROM blog_categories WHERE slug = ?";
        $params = [$slug];
        
        if ($id) {
            $query .= " AND id != ?";
            $params[] = $id;
        }
        
        $existing = $this->db->querySingle($query, $params);
        
        if ($existing) {
            $counter = 1;
            $newSlug = $slug . '-' . $counter;
            
            while ($this->db->querySingle("SELECT id FROM blog_categories WHERE slug = ?", [$newSlug])) {
                $counter++;
                $newSlug = $slug . '-' . $counter;
            }
            
            return $newSlug;
        }
        
        return $slug;
    }

    public function getAll($filters = []) {
        $where = [];
        $params = [];

        if (isset($filters['is_active'])) {
            $where[] = "is_active = ?";
            $params[] = $filters['is_active'];
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $query = "SELECT bc.*, 
                  (SELECT COUNT(*) FROM blog_posts WHERE category_id = bc.id AND status = 'published') as post_count
                  FROM blog_categories bc
                  $whereClause 
                  ORDER BY display_order ASC, name ASC";

        $categories = $this->db->query($query, $params);

        return ['success' => true, 'categories' => $categories];
    }

    public function getById($id) {
        $query = "SELECT * FROM blog_categories WHERE id = ?";
        $category = $this->db->querySingle($query, [$id]);

        if (!$category) {
            return ['success' => false, 'message' => 'التصنيف غير موجود'];
        }

        return ['success' => true, 'category' => $category];
    }

    public function create($data) {
        if (!isset($data['name']) || empty($data['name'])) {
            return ['success' => false, 'message' => 'اسم التصنيف مطلوب'];
        }

        $slug = isset($data['slug']) && !empty($data['slug'])
            ? $this->generateSlug($data['slug'])
            : $this->generateSlug($data['name']);

        $query = "INSERT INTO blog_categories (name, slug, description, color, display_order, is_active) 
                  VALUES (?, ?, ?, ?, ?, ?)";

        $params = [
            $data['name'],
            $slug,
            $data['description'] ?? null,
            $data['color'] ?? '#667eea',
            $data['display_order'] ?? 0,
            isset($data['is_active']) ? (int)$data['is_active'] : 1
        ];

        $categoryId = $this->db->execute($query, $params);

        if ($categoryId) {
            return ['success' => true, 'message' => 'تم إضافة التصنيف بنجاح', 'id' => $categoryId];
        }

        return ['success' => false, 'message' => 'فشل إضافة التصنيف'];
    }

    public function update($id, $data) {
        $existing = $this->getById($id);
        if (!$existing['success']) {
            return $existing;
        }

        $category = $existing['category'];
        
        $slug = isset($data['slug']) && !empty($data['slug'])
            ? $this->generateSlug($data['slug'], $id)
            : (isset($data['name']) ? $this->generateSlug($data['name'], $id) : $category['slug']);

        $query = "UPDATE blog_categories SET name = ?, slug = ?, description = ?, color = ?, 
                  display_order = ?, is_active = ? WHERE id = ?";

        $params = [
            $data['name'] ?? $category['name'],
            $slug,
            $data['description'] ?? $category['description'],
            $data['color'] ?? $category['color'],
            $data['display_order'] ?? $category['display_order'],
            isset($data['is_active']) ? (int)$data['is_active'] : $category['is_active'],
            $id
        ];

        $result = $this->db->execute($query, $params);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم تحديث التصنيف بنجاح'];
        }

        return ['success' => false, 'message' => 'فشل تحديث التصنيف'];
    }

    public function delete($id) {
        // Check if category has posts
        $postsCount = $this->db->querySingle(
            "SELECT COUNT(*) as count FROM blog_posts WHERE category_id = ?",
            [$id]
        );

        if ($postsCount['count'] > 0) {
            return ['success' => false, 'message' => 'لا يمكن حذف تصنيف يحتوي على مقالات'];
        }

        $query = "DELETE FROM blog_categories WHERE id = ?";
        $result = $this->db->execute($query, [$id]);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم حذف التصنيف بنجاح'];
        }

        return ['success' => false, 'message' => 'فشل حذف التصنيف'];
    }
}
