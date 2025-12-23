<?php
/**
 * Create Skill (Admin)
 * POST /api/admin/skills/create.php
 */

require_once '../../config/database.php';
require_once '../../helpers/Database.php';
require_once '../../helpers/Skill.php';
require_once '../../middleware/cors.php';
require_once '../../middleware/admin.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $admin = requireAdmin();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    $name = isset($input['name']) ? trim($input['name']) : '';
    $icon = isset($input['icon']) ? trim($input['icon']) : 'Sparkles';
    $category = isset($input['category']) ? trim($input['category']) : '';
    $color = isset($input['color']) ? trim($input['color']) : '#667eea';
    $isActive = isset($input['is_active']) ? (int)$input['is_active'] : 1;

    if (empty($name) || strlen($name) > 50) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'الاسم مطلوب ويجب أن يكون أقل من 50 حرف']);
        exit();
    }

    if (empty($category)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'التصنيف مطلوب']);
        exit();
    }

    if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $color)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'اللون يجب أن يكون بصيغة Hex صحيحة']);
        exit();
    }

    $database = new Database();
    $skill = new Skill($database);

    $result = $skill->create([
        'name' => $name,
        'icon' => $icon,
        'category' => $category,
        'color' => $color,
        'is_active' => $isActive
    ]);

    if ($result) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'تم إضافة المهارة بنجاح', 'id' => $result]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'فشل في إضافة المهارة']);
    }

} catch (Exception $e) {
    error_log("Create Skill Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم']);
}
