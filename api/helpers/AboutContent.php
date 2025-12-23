<?php
/**
 * About Content Helper Class
 * Handles about section content management
 */

class AboutContent {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    /**
     * Get about content
     */
    public function get() {
        $sql = "SELECT * FROM about_content WHERE id = 1";
        $about = $this->db->querySingle($sql);

        if (!$about) {
            // Create default record if not exists
            $this->db->execute(
                "INSERT INTO about_content (id, title, title_ar, subtitle, subtitle_ar, description, description_ar) 
                 VALUES (1, 'About Me', 'عني', 'Creative Designer', 'مصمم مبدع', '', '')"
            );
            $about = $this->db->querySingle($sql);
        }

        // Decode stats if JSON
        if (isset($about['stats']) && !empty($about['stats'])) {
            $about['stats'] = json_decode($about['stats'], true);
        } else {
            $about['stats'] = [];
        }

        return [
            'success' => true,
            'about' => $about
        ];
    }

    /**
     * Update about content
     */
    public function update($data) {
        $fields = [];
        $params = [];

        if (isset($data['title'])) {
            $fields[] = "title = ?";
            $params[] = trim($data['title']);
        }
        if (isset($data['title_ar'])) {
            $fields[] = "title_ar = ?";
            $params[] = trim($data['title_ar']);
        }
        if (isset($data['subtitle'])) {
            $fields[] = "subtitle = ?";
            $params[] = trim($data['subtitle']);
        }
        if (isset($data['subtitle_ar'])) {
            $fields[] = "subtitle_ar = ?";
            $params[] = trim($data['subtitle_ar']);
        }
        if (isset($data['description'])) {
            $fields[] = "description = ?";
            $params[] = trim($data['description']);
        }
        if (isset($data['description_ar'])) {
            $fields[] = "description_ar = ?";
            $params[] = trim($data['description_ar']);
        }
        if (isset($data['image'])) {
            $fields[] = "image = ?";
            $params[] = trim($data['image']);
        }
        if (isset($data['resume_url'])) {
            $fields[] = "resume_url = ?";
            $params[] = trim($data['resume_url']);
        }
        if (isset($data['stats'])) {
            $fields[] = "stats = ?";
            $params[] = is_array($data['stats']) ? json_encode($data['stats']) : $data['stats'];
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'لا توجد بيانات للتحديث'];
        }

        $fields[] = "updated_at = datetime('now')";

        $sql = "UPDATE about_content SET " . implode(', ', $fields) . " WHERE id = 1";

        try {
            $this->db->execute($sql, $params);
            return [
                'success' => true,
                'message' => 'تم تحديث المحتوى بنجاح',
                'about' => $this->get()['about']
            ];
        } catch (Exception $e) {
            error_log("About Update Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'فشل تحديث المحتوى'];
        }
    }
}
