<?php
class Blog {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    // Generate slug from title
    private function generateSlug($title, $id = null) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        
        // Check if slug exists
        $query = "SELECT id FROM blog_posts WHERE slug = ?";
        $params = [$slug];
        
        if ($id) {
            $query .= " AND id != ?";
            $params[] = $id;
        }
        
        $existing = $this->db->querySingle($query, $params);
        
        if ($existing) {
            $counter = 1;
            $newSlug = $slug . '-' . $counter;
            
            while ($this->db->querySingle("SELECT id FROM blog_posts WHERE slug = ?", [$newSlug])) {
                $counter++;
                $newSlug = $slug . '-' . $counter;
            }
            
            return $newSlug;
        }
        
        return $slug;
    }

    // Calculate reading time
    private function calculateReadingTime($content) {
        $wordCount = str_word_count(strip_tags($content));
        return ceil($wordCount / 200); // 200 words per minute
    }

    // Get all posts
    public function getAll($page = 1, $limit = 10, $filters = []) {
        $offset = ($page - 1) * $limit;
        $where = [];
        $params = [];

        if (isset($filters['status'])) {
            $where[] = "bp.status = ?";
            $params[] = $filters['status'];
        }

        if (isset($filters['category_id'])) {
            $where[] = "bp.category_id = ?";
            $params[] = $filters['category_id'];
        }

        if (isset($filters['is_featured'])) {
            $where[] = "bp.is_featured = ?";
            $params[] = $filters['is_featured'];
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(bp.title LIKE ? OR bp.excerpt LIKE ? OR bp.tags LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM blog_posts bp $whereClause";
        $totalResult = $this->db->querySingle($countQuery, $params);
        $total = $totalResult['total'];

        // Get posts with author and category info
        $query = "SELECT bp.*, 
                  u.full_name as author_name, u.email as author_email,
                  bc.name as category_name, bc.slug as category_slug
                  FROM blog_posts bp
                  LEFT JOIN users u ON bp.author_id = u.id
                  LEFT JOIN blog_categories bc ON bp.category_id = bc.id
                  $whereClause 
                  ORDER BY bp.published_at DESC, bp.created_at DESC 
                  LIMIT ? OFFSET ?";
        
        $params[] = $limit;
        $params[] = $offset;

        $posts = $this->db->query($query, $params);

        return [
            'success' => true,
            'posts' => $posts,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ];
    }

    // Get post by ID or slug
    public function get($identifier) {
        $isId = is_numeric($identifier);
        
        $query = "SELECT bp.*, 
                  u.full_name as author_name, u.email as author_email, u.avatar as author_avatar,
                  bc.name as category_name, bc.slug as category_slug, bc.color as category_color
                  FROM blog_posts bp
                  LEFT JOIN users u ON bp.author_id = u.id
                  LEFT JOIN blog_categories bc ON bp.category_id = bc.id
                  WHERE " . ($isId ? "bp.id = ?" : "bp.slug = ?");

        $post = $this->db->querySingle($query, [$identifier]);

        if (!$post) {
            return ['success' => false, 'message' => 'المقالة غير موجودة'];
        }

        return ['success' => true, 'post' => $post];
    }

    // Create post
    public function create($data, $authorId) {
        $requiredFields = ['title', 'content'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return ['success' => false, 'message' => "حقل $field مطلوب"];
            }
        }

        $slug = isset($data['slug']) && !empty($data['slug']) 
            ? $this->generateSlug($data['slug']) 
            : $this->generateSlug($data['title']);

        $readingTime = $this->calculateReadingTime($data['content']);

        $query = "INSERT INTO blog_posts (
            title, slug, excerpt, content, featured_image, author_id, category_id, tags,
            status, published_at, reading_time,
            meta_title, meta_description, meta_keywords, canonical_url, robots,
            og_title, og_description, og_image, og_type,
            twitter_card, twitter_title, twitter_description, twitter_image,
            schema_markup, is_featured, allow_comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $publishedAt = null;
        if (isset($data['status']) && $data['status'] === 'published') {
            $publishedAt = isset($data['published_at']) ? $data['published_at'] : date('Y-m-d H:i:s');
        } elseif (isset($data['status']) && $data['status'] === 'scheduled' && isset($data['published_at'])) {
            $publishedAt = $data['published_at'];
        }

        $params = [
            $data['title'],
            $slug,
            $data['excerpt'] ?? null,
            $data['content'],
            $data['featured_image'] ?? null,
            $authorId,
            $data['category_id'] ?? null,
            $data['tags'] ?? null,
            $data['status'] ?? 'draft',
            $publishedAt,
            $readingTime,
            $data['meta_title'] ?? $data['title'],
            $data['meta_description'] ?? $data['excerpt'],
            $data['meta_keywords'] ?? null,
            $data['canonical_url'] ?? null,
            $data['robots'] ?? 'index, follow',
            $data['og_title'] ?? $data['title'],
            $data['og_description'] ?? $data['excerpt'],
            $data['og_image'] ?? $data['featured_image'],
            $data['og_type'] ?? 'article',
            $data['twitter_card'] ?? 'summary_large_image',
            $data['twitter_title'] ?? $data['title'],
            $data['twitter_description'] ?? $data['excerpt'],
            $data['twitter_image'] ?? $data['featured_image'],
            $data['schema_markup'] ?? null,
            isset($data['is_featured']) ? (int)$data['is_featured'] : 0,
            isset($data['allow_comments']) ? (int)$data['allow_comments'] : 1
        ];

        $postId = $this->db->execute($query, $params);

        if ($postId) {
            return [
                'success' => true,
                'message' => 'تم إضافة المقالة بنجاح',
                'id' => $postId,
                'slug' => $slug
            ];
        }

        return ['success' => false, 'message' => 'فشل إضافة المقالة'];
    }

    // Update post
    public function update($id, $data) {
        $existing = $this->get($id);
        if (!$existing['success']) {
            return $existing;
        }

        $post = $existing['post'];
        
        $slug = isset($data['slug']) && !empty($data['slug'])
            ? $this->generateSlug($data['slug'], $id)
            : (isset($data['title']) ? $this->generateSlug($data['title'], $id) : $post['slug']);

        $content = $data['content'] ?? $post['content'];
        $readingTime = $this->calculateReadingTime($content);

        $publishedAt = $post['published_at'];
        if (isset($data['status'])) {
            if ($data['status'] === 'published' && !$publishedAt) {
                $publishedAt = isset($data['published_at']) ? $data['published_at'] : date('Y-m-d H:i:s');
            } elseif ($data['status'] === 'scheduled' && isset($data['published_at'])) {
                $publishedAt = $data['published_at'];
            }
        }

        $query = "UPDATE blog_posts SET
            title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?,
            category_id = ?, tags = ?, status = ?, published_at = ?, reading_time = ?,
            meta_title = ?, meta_description = ?, meta_keywords = ?, canonical_url = ?, robots = ?,
            og_title = ?, og_description = ?, og_image = ?, og_type = ?,
            twitter_card = ?, twitter_title = ?, twitter_description = ?, twitter_image = ?,
            schema_markup = ?, is_featured = ?, allow_comments = ?
        WHERE id = ?";

        $params = [
            $data['title'] ?? $post['title'],
            $slug,
            $data['excerpt'] ?? $post['excerpt'],
            $content,
            $data['featured_image'] ?? $post['featured_image'],
            $data['category_id'] ?? $post['category_id'],
            $data['tags'] ?? $post['tags'],
            $data['status'] ?? $post['status'],
            $publishedAt,
            $readingTime,
            $data['meta_title'] ?? $post['meta_title'],
            $data['meta_description'] ?? $post['meta_description'],
            $data['meta_keywords'] ?? $post['meta_keywords'],
            $data['canonical_url'] ?? $post['canonical_url'],
            $data['robots'] ?? $post['robots'],
            $data['og_title'] ?? $post['og_title'],
            $data['og_description'] ?? $post['og_description'],
            $data['og_image'] ?? $post['og_image'],
            $data['og_type'] ?? $post['og_type'],
            $data['twitter_card'] ?? $post['twitter_card'],
            $data['twitter_title'] ?? $post['twitter_title'],
            $data['twitter_description'] ?? $post['twitter_description'],
            $data['twitter_image'] ?? $post['twitter_image'],
            $data['schema_markup'] ?? $post['schema_markup'],
            isset($data['is_featured']) ? (int)$data['is_featured'] : $post['is_featured'],
            isset($data['allow_comments']) ? (int)$data['allow_comments'] : $post['allow_comments'],
            $id
        ];

        $result = $this->db->execute($query, $params);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم تحديث المقالة بنجاح', 'slug' => $slug];
        }

        return ['success' => false, 'message' => 'فشل تحديث المقالة'];
    }

    // Delete post
    public function delete($id) {
        $query = "DELETE FROM blog_posts WHERE id = ?";
        $result = $this->db->execute($query, [$id]);

        if ($result !== false) {
            return ['success' => true, 'message' => 'تم حذف المقالة بنجاح'];
        }

        return ['success' => false, 'message' => 'فشل حذف المقالة'];
    }

    // Increment views
    public function incrementViews($id) {
        $query = "UPDATE blog_posts SET views = views + 1 WHERE id = ?";
        $this->db->execute($query, [$id]);
    }
}
