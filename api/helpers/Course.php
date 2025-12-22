<?php
/**
 * Course Helper Class
 * Handles course management operations
 */

class Course {
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
        // Simple slug creation - you might want to use a more sophisticated method
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        return trim($slug, '-');
    }

    /**
     * Check if slug exists
     */
    private function slugExists($slug, $excludeId = null) {
        $sql = "SELECT id FROM courses WHERE slug = ?";
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
     * Create new course
     */
    public function create($data, $createdBy) {
        // Validate required fields
        if (!isset($data['title']) || empty(trim($data['title']))) {
            return [
                'success' => false,
                'message' => 'عنوان الكورس مطلوب'
            ];
        }

        // Generate slug
        $slug = $this->generateUniqueSlug($data['title']);

        // Prepare data
        $title = trim($data['title']);
        $description = isset($data['description']) ? trim($data['description']) : null;
        $content = isset($data['content']) ? $data['content'] : null;
        $image = isset($data['image']) ? trim($data['image']) : null;
        $videoUrl = isset($data['video_url']) ? trim($data['video_url']) : null;
        $price = isset($data['price']) ? floatval($data['price']) : 0.00;
        $duration = isset($data['duration']) ? intval($data['duration']) : null;
        $level = isset($data['level']) ? $data['level'] : 'beginner';
        $category = isset($data['category']) ? trim($data['category']) : null;
        $isPublished = isset($data['is_published']) ? intval($data['is_published']) : 0;
        $featured = isset($data['featured']) ? intval($data['featured']) : 0;

        $sql = "INSERT INTO courses
                (title, slug, description, content, image, video_url, price, duration, level, category, is_published, featured, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            $this->db->execute($sql, [
                $title, $slug, $description, $content, $image, $videoUrl,
                $price, $duration, $level, $category, $isPublished, $featured, $createdBy
            ]);

            $courseId = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إنشاء الكورس بنجاح',
                'course' => $this->getById($courseId)
            ];
        } catch (Exception $e) {
            error_log("Course Create Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء الكورس'
            ];
        }
    }

    /**
     * Get all courses with pagination and filters
     */
    public function getAll($page = 1, $limit = 10, $filters = []) {
        $offset = ($page - 1) * $limit;

        // Build WHERE clause
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

        if (isset($filters['level'])) {
            $where[] = "level = ?";
            $params[] = $filters['level'];
        }

        if (isset($filters['category'])) {
            $where[] = "category = ?";
            $params[] = $filters['category'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(title LIKE ? OR description LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM courses $whereClause";
        $countResult = $this->db->querySingle($countSql, $params);
        $total = $countResult['total'];

        // Get courses
        $sql = "SELECT c.*, u.name as creator_name
                FROM courses c
                LEFT JOIN users u ON c.created_by = u.id
                $whereClause
                ORDER BY c.created_at DESC
                LIMIT ? OFFSET ?";

        $params[] = $limit;
        $params[] = $offset;

        $courses = $this->db->query($sql, $params);

        return [
            'success' => true,
            'courses' => $courses,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Get course by ID
     */
    public function getById($id) {
        $sql = "SELECT c.*, u.name as creator_name
                FROM courses c
                LEFT JOIN users u ON c.created_by = u.id
                WHERE c.id = ?";

        return $this->db->querySingle($sql, [$id]);
    }

    /**
     * Get course by slug
     */
    public function getBySlug($slug) {
        $sql = "SELECT c.*, u.name as creator_name
                FROM courses c
                LEFT JOIN users u ON c.created_by = u.id
                WHERE c.slug = ?";

        return $this->db->querySingle($sql, [$slug]);
    }

    /**
     * Update course
     */
    public function update($id, $data) {
        // Check if course exists
        $course = $this->getById($id);
        if (!$course) {
            return [
                'success' => false,
                'message' => 'الكورس غير موجود'
            ];
        }

        // Build update query
        $fields = [];
        $params = [];

        if (isset($data['title']) && !empty(trim($data['title']))) {
            $fields[] = "title = ?";
            $params[] = trim($data['title']);

            // Update slug if title changed
            if ($data['title'] !== $course['title']) {
                $slug = $this->generateUniqueSlug($data['title'], $id);
                $fields[] = "slug = ?";
                $params[] = $slug;
            }
        }

        if (isset($data['description'])) {
            $fields[] = "description = ?";
            $params[] = trim($data['description']);
        }

        if (isset($data['content'])) {
            $fields[] = "content = ?";
            $params[] = $data['content'];
        }

        if (isset($data['image'])) {
            $fields[] = "image = ?";
            $params[] = trim($data['image']);
        }

        if (isset($data['video_url'])) {
            $fields[] = "video_url = ?";
            $params[] = trim($data['video_url']);
        }

        if (isset($data['price'])) {
            $fields[] = "price = ?";
            $params[] = floatval($data['price']);
        }

        if (isset($data['duration'])) {
            $fields[] = "duration = ?";
            $params[] = intval($data['duration']);
        }

        if (isset($data['level'])) {
            $fields[] = "level = ?";
            $params[] = $data['level'];
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

        if (empty($fields)) {
            return [
                'success' => false,
                'message' => 'لا توجد بيانات للتحديث'
            ];
        }

        $params[] = $id;
        $sql = "UPDATE courses SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);

            return [
                'success' => true,
                'message' => 'تم تحديث الكورس بنجاح',
                'course' => $this->getById($id)
            ];
        } catch (Exception $e) {
            error_log("Course Update Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الكورس'
            ];
        }
    }

    /**
     * Delete course
     */
    public function delete($id) {
        // Check if course exists
        $course = $this->getById($id);
        if (!$course) {
            return [
                'success' => false,
                'message' => 'الكورس غير موجود'
            ];
        }

        $sql = "DELETE FROM courses WHERE id = ?";

        try {
            $this->db->execute($sql, [$id]);

            return [
                'success' => true,
                'message' => 'تم حذف الكورس بنجاح'
            ];
        } catch (Exception $e) {
            error_log("Course Delete Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الكورس'
            ];
        }
    }

    /**
     * Get course statistics
     */
    public function getStats() {
        $sql = "SELECT
                COUNT(*) as total_courses,
                SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published_courses,
                SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured_courses,
                SUM(students_count) as total_students,
                AVG(rating) as average_rating
                FROM courses";

        return $this->db->querySingle($sql);
    }
}
