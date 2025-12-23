<?php
/**
 * Project Helper Class
 * Handles project management operations
 */

class Project {
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
        $sql = "SELECT id FROM projects WHERE slug = ?";
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
     * Create new project
     */
    public function create($data, $createdBy) {
        if (!isset($data['title']) || empty(trim($data['title']))) {
            return [
                'success' => false,
                'message' => 'عنوان المشروع مطلوب'
            ];
        }

        $slug = $this->generateUniqueSlug($data['title']);

        $title = trim($data['title']);
        $description = isset($data['description']) ? trim($data['description']) : null;
        $content = isset($data['content']) ? $data['content'] : null;
        $clientName = isset($data['client_name']) ? trim($data['client_name']) : null;
        $projectType = isset($data['project_type']) ? trim($data['project_type']) : null;
        $category = isset($data['category']) ? trim($data['category']) : null;
        $images = isset($data['images']) ? json_encode($data['images']) : null;
        $videoUrl = isset($data['video_url']) ? trim($data['video_url']) : null;
        $completionDate = isset($data['completion_date']) ? $data['completion_date'] : null;
        $duration = isset($data['duration']) ? intval($data['duration']) : null;
        $technologies = isset($data['technologies']) ? json_encode($data['technologies']) : null;
        $isPublished = isset($data['is_published']) ? intval($data['is_published']) : 0;
        $featured = isset($data['featured']) ? intval($data['featured']) : 0;
        $orderIndex = isset($data['order_index']) ? intval($data['order_index']) : 0;

        $sql = "INSERT INTO projects
                (title, slug, description, content, client_name, project_type, category, images,
                video_url, completion_date, duration, technologies, is_published, featured, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            $this->db->execute($sql, [
                $title, $slug, $description, $content, $clientName, $projectType, $category, $images,
                $videoUrl, $completionDate, $duration, $technologies, $isPublished, $featured, $orderIndex
            ]);

            $projectId = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'تم إنشاء المشروع بنجاح',
                'project' => $this->getById($projectId)
            ];
        } catch (Exception $e) {
            error_log("Project Create Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء المشروع'
            ];
        }
    }

    /**
     * Get all projects with pagination and filters
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

        if (isset($filters['project_type']) && !empty($filters['project_type'])) {
            $where[] = "project_type = ?";
            $params[] = $filters['project_type'];
        }

        if (isset($filters['category']) && !empty($filters['category'])) {
            $where[] = "category = ?";
            $params[] = $filters['category'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(title LIKE ? OR description LIKE ? OR client_name LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        $countSql = "SELECT COUNT(*) as total FROM projects $whereClause";
        $countResult = $this->db->querySingle($countSql, $params);
        $total = $countResult['total'];

        $sql = "SELECT p.*
                FROM projects p
                $whereClause
                ORDER BY p.order_index ASC, p.created_at DESC
                LIMIT ? OFFSET ?";

        $params[] = $limit;
        $params[] = $offset;

        $projects = $this->db->query($sql, $params);

        // Decode JSON fields
        foreach ($projects as &$project) {
            $project['images'] = json_decode($project['images'] ?? '[]', true);
            $project['technologies'] = json_decode($project['technologies'] ?? '[]', true);
        }

        return [
            'success' => true,
            'projects' => $projects,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Get project by ID
     */
    public function getById($id) {
        $sql = "SELECT p.*
                FROM projects p
                WHERE p.id = ?";

        $project = $this->db->querySingle($sql, [$id]);

        if ($project) {
            $project['images'] = json_decode($project['images'] ?? '[]', true);
            $project['technologies'] = json_decode($project['technologies'] ?? '[]', true);
        }

        return $project;
    }

    /**
     * Get project by slug
     */
    public function getBySlug($slug) {
        $sql = "SELECT p.*
                FROM projects p
                WHERE p.slug = ?";

        $project = $this->db->querySingle($sql, [$slug]);

        if ($project) {
            $project['images'] = json_decode($project['images'] ?? '[]', true);
            $project['technologies'] = json_decode($project['technologies'] ?? '[]', true);

            // Increment views
            $this->db->execute("UPDATE projects SET views_count = views_count + 1 WHERE id = ?", [$project['id']]);
        }

        return $project;
    }

    /**
     * Update project
     */
    public function update($id, $data) {
        $project = $this->getById($id);
        if (!$project) {
            return [
                'success' => false,
                'message' => 'المشروع غير موجود'
            ];
        }

        $fields = [];
        $params = [];

        if (isset($data['title']) && !empty(trim($data['title']))) {
            $fields[] = "title = ?";
            $params[] = trim($data['title']);

            if ($data['title'] !== $project['title']) {
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

        if (isset($data['client_name'])) {
            $fields[] = "client_name = ?";
            $params[] = trim($data['client_name']);
        }

        if (isset($data['project_type'])) {
            $fields[] = "project_type = ?";
            $params[] = trim($data['project_type']);
        }

        if (isset($data['category'])) {
            $fields[] = "category = ?";
            $params[] = trim($data['category']);
        }

        if (isset($data['images'])) {
            $fields[] = "images = ?";
            $params[] = json_encode($data['images']);
        }

        if (isset($data['video_url'])) {
            $fields[] = "video_url = ?";
            $params[] = trim($data['video_url']);
        }

        if (isset($data['completion_date'])) {
            $fields[] = "completion_date = ?";
            $params[] = $data['completion_date'];
        }

        if (isset($data['duration'])) {
            $fields[] = "duration = ?";
            $params[] = intval($data['duration']);
        }

        if (isset($data['technologies'])) {
            $fields[] = "technologies = ?";
            $params[] = json_encode($data['technologies']);
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
        $sql = "UPDATE projects SET " . implode(', ', $fields) . " WHERE id = ?";

        try {
            $this->db->execute($sql, $params);

            return [
                'success' => true,
                'message' => 'تم تحديث المشروع بنجاح',
                'project' => $this->getById($id)
            ];
        } catch (Exception $e) {
            error_log("Project Update Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث المشروع'
            ];
        }
    }

    /**
     * Delete project
     */
    public function delete($id) {
        $project = $this->getById($id);
        if (!$project) {
            return [
                'success' => false,
                'message' => 'المشروع غير موجود'
            ];
        }

        $sql = "DELETE FROM projects WHERE id = ?";

        try {
            $this->db->execute($sql, [$id]);

            return [
                'success' => true,
                'message' => 'تم حذف المشروع بنجاح'
            ];
        } catch (Exception $e) {
            error_log("Project Delete Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المشروع'
            ];
        }
    }

    /**
     * Get project statistics
     */
    public function getStats() {
        $sql = "SELECT
                COUNT(*) as total_projects,
                SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published_projects,
                SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured_projects,
                SUM(views_count) as total_views
                FROM projects";

        return $this->db->querySingle($sql);
    }
}
