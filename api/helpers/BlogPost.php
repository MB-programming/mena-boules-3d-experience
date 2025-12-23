<?php
/**
 * Blog Post Helper Class
 */

class BlogPost {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    private function createSlug($title) {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        return trim($slug, '-');
    }

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

    private function slugExists($slug, $excludeId = null) {
        $sql = "SELECT id FROM blog_posts WHERE slug = ?";
        $params = [$slug];

        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }

        return $this->db->querySingle($sql, $params) ? true : false;
    }

    /**
     * Get all posts
     */
    public function getAll($page = 1, $limit = 10, $filters = []) {
        $offset = ($page - 1) * $limit;
        $where = [];
        $params = [];

        if (isset($filters['status'])) {
            $where[] = "status = ?";
            $params[] = $filters['status'];
        }

        if (isset($filters['category']) && !empty($filters['category'])) {
            $where[] = "category = ?";
            $params[] = $filters['category'];
        }

        if (isset($filters['is_featured'])) {
            $where[] = "is_featured = ?";
            $params[] = $filters['is_featured'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(title LIKE ? OR title_ar LIKE ? OR excerpt LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        // Count
        $countSql = "SELECT COUNT(*) as total FROM blog_posts $whereClause";
        $total = $this->db->querySingle($countSql, $params)['total'];

        // Get posts
        $sql = "SELECT bp.*, u.name as author_name 
                FROM blog_posts bp 
                LEFT JOIN users u ON bp.author_id = u.id 
                $whereClause 
                ORDER BY bp.published_at DESC, bp.created_at DESC 
                LIMIT ? OFFSET ?";
        
        $params[] = $limit;
        $params[] = $offset;

        $posts = $this->db->query($sql, $params);

        // Decode tags
        foreach ($posts as &$post) {
            $post['tags'] = json_decode($post['tags'] ?? '[]', true);
        }

        return [
            'success' => true,
            'posts' => $posts,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Get post by ID
     */
    public function getById($id) {
        $sql = "SELECT bp.*, u.name as author_name 
                FROM blog_posts bp 
                LEFT JOIN users u ON bp.author_id = u.id 
                WHERE bp.id = ?";
        
        $post = $this->db->querySingle($sql, [$id]);

        if ($post) {
            $post['tags'] = json_decode($post['tags'] ?? '[]', true);
        }

        return $post;
    }

    /**
     * Get post by slug
     */
    public function getBySlug($slug) {
        $sql = "SELECT bp.*, u.name as author_name 
                FROM blog_posts bp 
                LEFT JOIN users u ON bp.author_id = u.id 
                WHERE bp.slug = ?";
        
        $post = $this->db->querySingle($sql, [$slug]);

        if ($post) {
            $post['tags'] = json_decode($post['tags'] ?? '[]', true);
            // Increment views
            $this->db->execute("UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?", [$post['id']]);
        }

        return $post;
    }

    /**
     * Create post
     */
    public function create($data, $authorId = null) {
        if (!isset($data['title']) || empty(trim($data['title']))) {
            return ['success' => false, 'message' => 'عنوان المقال مطلوب'];
        }

        $slug = $this->generateUniqueSlug($data['title']);

        $sql = "INSERT INTO blog_posts (title, title_ar, slug, excerpt, excerpt_ar, content, content_ar,
                featured_image, category, tags, author_id, status, is_featured, published_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            trim($data['title']),
            isset($data['title_ar']) ? trim($data['title_ar']) : null,
            $slug,
            isset($data['excerpt']) ? trim($data['excerpt']) : null,
            isset($data['excerpt_ar']) ? trim($data['excerpt_ar']) : null,
            isset($data['content']) ? $data['content'] : null,
            isset($data['content_ar']) ? $data['content_ar'] : null,
            isset($data['featured_image']) ? trim($data['featured_image']) : null,
            isset($data['category']) ? trim($data['category']) : null,
            isset($data['tags']) ? json_encode($data['tags']) : null,
            $authorId,
            isset($data['status']) ? $data['status'] : 'draft',
            isset($data['is_featured']) ? intval($data['is_featured']) : 0,
            isset($data['status']) && $data['status'] === 'published' ? date('Y-m-d H:i:s') : null
        ];

        try {
            $this->db->execute($sql, $params);
            $id = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إنشاء المقال بنجاح',
                'post' => $this->getById($id)
            ];
        } catch (Exception $e) {
            error_log("Blog Create Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل إنشاء المقال'];
        }
    }

    /**
     * Update post
     */
    public function update($id, $data) {
        $existing = $this->getById($id);
        if (!$existing) {
            return ['success' => false, 'message' => 'المقال غير موجود'];
        }

        $fields = [];
        $params = [];

        if (isset($data['title'])) {
            $fields[] = "title = ?";
            $params[] = trim($data['title']);
            
            if ($data['title'] !== $existing['title']) {
                $slug = $this->generateUniqueSlug($data['title'], $id);
                $fields[] = "slug = ?";
                $params[] = $slug;
            }
        }

        $allowedFields = ['title_ar', 'excerpt', 'excerpt_ar', 'content', 'content_ar',
                          'featured_image', 'category', 'is_featured'];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                if ($field === 'is_featured') {
                    $params[] = intval($data[$field]);
                } else {
                    $params[] = is_string($data[$field]) ? trim($data[$field]) : $data[$field];
                }
            }
        }

        if (isset($data['tags'])) {
            $fields[] = "tags = ?";
            $params[] = json_encode($data['tags']);
        }

        if (isset($data['status'])) {
            $fields[] = "status = ?";
            $params[] = $data['status'];
            
            if ($data['status'] === 'published' && !$existing['published_at']) {
                $fields[] = "published_at = datetime('now')";
            }
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'لا توجد بيانات للتحديث'];
        }

        $fields[] = "updated_at = datetime('now')";
        $params[] = $id;

        $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);
            return [
                'success' => true,
                'message' => 'تم تحديث المقال بنجاح',
                'post' => $this->getById($id)
            ];
        } catch (Exception $e) {
            error_log("Blog Update Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل تحديث المقال'];
        }
    }

    /**
     * Delete post
     */
    public function delete($id) {
        $sql = "DELETE FROM blog_posts WHERE id = ?";
        
        try {
            $this->db->execute($sql, [$id]);
            return ['success' => true, 'message' => 'تم حذف المقال بنجاح'];
        } catch (Exception $e) {
            error_log("Blog Delete Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل حذف المقال'];
        }
    }

    /**
     * Get categories
     */
    public function getCategories() {
        $sql = "SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL AND category != '' ORDER BY category";
        $result = $this->db->query($sql);
        return array_column($result, 'category');
    }
}
