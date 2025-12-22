<?php
class Order {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    private function generateOrderNumber() {
        return 'ORD-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
    }

    public function createOrder($userId, $items, $paymentMethod = 'wallet') {
        if (empty($items)) {
            return ['success' => false, 'message' => 'السلة فارغة'];
        }

        $totalAmount = 0;
        $courseIds = [];
        
        foreach ($items as $item) {
            $courseIds[] = $item['course_id'];
            $totalAmount += floatval($item['price']);
        }

        // Check if user already owns any courses
        $placeholders = str_repeat('?,', count($courseIds) - 1) . '?';
        $sql = "SELECT course_id FROM course_enrollments 
                WHERE user_id = ? AND course_id IN ($placeholders)";
        $params = array_merge([$userId], $courseIds);
        $owned = $this->db->query($sql, $params);
        
        if (!empty($owned)) {
            return ['success' => false, 'message' => 'تمتلك بعض الكورسات بالفعل'];
        }

        $orderNumber = $this->generateOrderNumber();
        $finalAmount = $totalAmount; // Can apply discounts here

        try {
            $this->db->beginTransaction();

            // Create order
            $sql = "INSERT INTO orders 
                    (order_number, user_id, total_amount, final_amount, payment_method, ip_address)
                    VALUES (?, ?, ?, ?, ?, ?)";
            $this->db->execute($sql, [
                $orderNumber, $userId, $totalAmount, $finalAmount, 
                $paymentMethod, $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $orderId = $this->db->lastInsertId();

            // Add order items
            foreach ($items as $item) {
                $sql = "INSERT INTO order_items (order_id, course_id, course_title, price)
                        VALUES (?, ?, ?, ?)";
                $this->db->execute($sql, [
                    $orderId, $item['course_id'], $item['course_title'], $item['price']
                ]);
            }

            $this->db->commit();

            return [
                'success' => true,
                'message' => 'تم إنشاء الطلب بنجاح',
                'order' => $this->getById($orderId)
            ];
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Order Create Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ أثناء إنشاء الطلب'];
        }
    }

    public function processPayment($orderId, $userId) {
        $order = $this->getById($orderId);
        
        if (!$order || $order['user_id'] != $userId) {
            return ['success' => false, 'message' => 'الطلب غير موجود'];
        }

        if ($order['payment_status'] == 'completed') {
            return ['success' => false, 'message' => 'الطلب مدفوع بالفعل'];
        }

        $wallet = new Wallet($this->db);
        
        // Deduct from wallet
        $deductResult = $wallet->deductFunds(
            $userId, 
            $order['final_amount'], 
            'order', 
            $orderId,
            "دفع طلب رقم {$order['order_number']}"
        );

        if (!$deductResult['success']) {
            return $deductResult;
        }

        try {
            $this->db->beginTransaction();

            // Update order
            $sql = "UPDATE orders SET payment_status = 'completed', paid_at = NOW() 
                    WHERE id = ?";
            $this->db->execute($sql, [$orderId]);

            // Enroll user in courses
            $sql = "SELECT course_id FROM order_items WHERE order_id = ?";
            $items = $this->db->query($sql, [$orderId]);

            foreach ($items as $item) {
                $sql = "INSERT INTO course_enrollments (user_id, course_id) 
                        VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id";
                $this->db->execute($sql, [$userId, $item['course_id']]);
                
                // Update course students count
                $sql = "UPDATE courses SET students_count = students_count + 1 
                        WHERE id = ?";
                $this->db->execute($sql, [$item['course_id']]);
            }

            // Clear cart
            $sql = "DELETE FROM cart WHERE user_id = ?";
            $this->db->execute($sql, [$userId]);

            $this->db->commit();

            return [
                'success' => true,
                'message' => 'تم الدفع بنجاح',
                'order' => $this->getById($orderId)
            ];
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Payment Process Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ أثناء الدفع'];
        }
    }

    public function getById($id) {
        $sql = "SELECT o.*, u.name as user_name, u.email as user_email
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                WHERE o.id = ?";
        
        $order = $this->db->querySingle($sql, [$id]);
        
        if ($order) {
            $sql = "SELECT * FROM order_items WHERE order_id = ?";
            $order['items'] = $this->db->query($sql, [$id]);
        }

        return $order;
    }

    public function getUserOrders($userId, $page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        
        $countSql = "SELECT COUNT(*) as total FROM orders WHERE user_id = ?";
        $countResult = $this->db->querySingle($countSql, [$userId]);
        
        $sql = "SELECT * FROM orders WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $orders = $this->db->query($sql, [$userId, $limit, $offset]);

        // Get items for each order
        foreach ($orders as &$order) {
            $sql = "SELECT * FROM order_items WHERE order_id = ?";
            $order['items'] = $this->db->query($sql, [$order['id']]);
        }

        return [
            'success' => true,
            'orders' => $orders,
            'pagination' => [
                'total' => $countResult['total'],
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($countResult['total'] / $limit)
            ]
        ];
    }
}
