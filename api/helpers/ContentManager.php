<?php
/**
 * Content Manager Helper Class
 * Handles site content and settings management
 */

class ContentManager {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    /**
     * Get setting by key
     */
    public function getSetting($key) {
        $sql = "SELECT * FROM site_settings WHERE setting_key = ?";
        $setting = $this->db->querySingle($sql, [$key]);
        
        if (!$setting) {
            return null;
        }

        // Parse JSON if type is json
        if ($setting['setting_type'] === 'json' && !empty($setting['setting_value'])) {
            $setting['setting_value'] = json_decode($setting['setting_value'], true);
        }

        return $setting;
    }

    /**
     * Get all settings by category
     */
    public function getByCategory($category, $publicOnly = false) {
        $sql = "SELECT * FROM site_settings WHERE category = ?";
        $params = [$category];
        
        if ($publicOnly) {
            $sql .= " AND is_public = 1";
        }
        
        $sql .= " ORDER BY setting_key ASC";
        
        $settings = $this->db->query($sql, $params);
        
        // Parse JSON values
        foreach ($settings as &$setting) {
            if ($setting['setting_type'] === 'json' && !empty($setting['setting_value'])) {
                $setting['setting_value'] = json_decode($setting['setting_value'], true);
            }
        }
        
        return $settings;
    }

    /**
     * Get homepage content
     */
    public function getHomeContent() {
        $settings = $this->getByCategory('home', true);
        
        $content = [];
        foreach ($settings as $setting) {
            // Remove 'home_' prefix from key
            $key = str_replace('home_', '', $setting['setting_key']);
            $content[$key] = $setting['setting_value'];
        }
        
        return $content;
    }

    /**
     * Get about page content
     */
    public function getAboutContent() {
        $settings = $this->getByCategory('about', true);
        
        $content = [];
        foreach ($settings as $setting) {
            // Remove 'about_' prefix from key
            $key = str_replace('about_', '', $setting['setting_key']);
            $content[$key] = $setting['setting_value'];
        }
        
        return $content;
    }

    /**
     * Update or create setting
     */
    public function updateSetting($key, $value, $userId, $category = null, $type = null, $isPublic = null, $description = null) {
        // Check if setting exists
        $existing = $this->getSetting($key);
        
        if ($existing) {
            // Update existing
            $fields = ["setting_value = ?", "updated_by = ?"];
            $params = [$value, $userId];
            
            if ($category !== null) {
                $fields[] = "category = ?";
                $params[] = $category;
            }
            
            if ($type !== null) {
                $fields[] = "setting_type = ?";
                $params[] = $type;
            }
            
            if ($isPublic !== null) {
                $fields[] = "is_public = ?";
                $params[] = intval($isPublic);
            }
            
            if ($description !== null) {
                $fields[] = "description = ?";
                $params[] = $description;
            }
            
            $params[] = $key;
            $sql = "UPDATE site_settings SET " . implode(', ', $fields) . " WHERE setting_key = ?";
            
            try {
                $this->db->execute($sql, $params);
                
                return [
                    'success' => true,
                    'message' => 'تم تحديث الإعداد بنجاح',
                    'setting' => $this->getSetting($key)
                ];
            } catch (Exception $e) {
                error_log("Update Setting Error: " . $e->getMessage());
                return ['success' => false, 'message' => 'حدث خطأ أثناء التحديث'];
            }
        } else {
            // Create new
            $sql = "INSERT INTO site_settings (setting_key, setting_value, category, setting_type, is_public, description, updated_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            try {
                $this->db->execute($sql, [
                    $key,
                    $value,
                    $category ?? 'general',
                    $type ?? 'text',
                    $isPublic !== null ? intval($isPublic) : 1,
                    $description,
                    $userId
                ]);
                
                return [
                    'success' => true,
                    'message' => 'تم إنشاء الإعداد بنجاح',
                    'setting' => $this->getSetting($key)
                ];
            } catch (Exception $e) {
                error_log("Create Setting Error: " . $e->getMessage());
                return ['success' => false, 'message' => 'حدث خطأ أثناء الإنشاء'];
            }
        }
    }

    /**
     * Delete setting
     */
    public function deleteSetting($key) {
        $sql = "DELETE FROM site_settings WHERE setting_key = ?";
        
        try {
            $this->db->execute($sql, [$key]);
            
            return [
                'success' => true,
                'message' => 'تم حذف الإعداد بنجاح'
            ];
        } catch (Exception $e) {
            error_log("Delete Setting Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ أثناء الحذف'];
        }
    }

    /**
     * Get all settings (admin)
     */
    public function getAllSettings($page = 1, $limit = 50, $filters = []) {
        $offset = ($page - 1) * $limit;
        
        $where = [];
        $params = [];
        
        if (isset($filters['category']) && !empty($filters['category'])) {
            $where[] = "category = ?";
            $params[] = $filters['category'];
        }
        
        if (isset($filters['search']) && !empty($filters['search'])) {
            $where[] = "(setting_key LIKE ? OR description LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $countSql = "SELECT COUNT(*) as total FROM site_settings $whereClause";
        $countResult = $this->db->querySingle($countSql, $params);
        
        $sql = "SELECT s.*, u.name as updated_by_name 
                FROM site_settings s
                LEFT JOIN users u ON s.updated_by = u.id
                $whereClause
                ORDER BY s.category ASC, s.setting_key ASC
                LIMIT ? OFFSET ?";
        
        $params[] = $limit;
        $params[] = $offset;
        
        $settings = $this->db->query($sql, $params);
        
        // Parse JSON values
        foreach ($settings as &$setting) {
            if ($setting['setting_type'] === 'json' && !empty($setting['setting_value'])) {
                $setting['setting_value_parsed'] = json_decode($setting['setting_value'], true);
            }
        }
        
        return [
            'success' => true,
            'settings' => $settings,
            'pagination' => [
                'total' => $countResult['total'],
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($countResult['total'] / $limit)
            ]
        ];
    }

    /**
     * Get general site info
     */
    public function getSiteInfo() {
        $siteInfo = $this->getSetting('site_info');
        $socialLinks = $this->getSetting('social_links');
        
        return [
            'site_info' => $siteInfo ? $siteInfo['setting_value'] : null,
            'social_links' => $socialLinks ? $socialLinks['setting_value'] : null
        ];
    }
}
