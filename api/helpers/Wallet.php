<?php
class Wallet {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    private function ensureWalletExists($userId) {
        $sql = "INSERT INTO wallet (user_id, balance) VALUES (?, 0.00) 
                ON DUPLICATE KEY UPDATE user_id = user_id";
        $this->db->execute($sql, [$userId]);
    }

    public function getBalance($userId) {
        $this->ensureWalletExists($userId);
        $sql = "SELECT * FROM wallet WHERE user_id = ?";
        $wallet = $this->db->querySingle($sql, [$userId]);
        return $wallet ? floatval($wallet['balance']) : 0.00;
    }

    public function addFunds($userId, $amount, $paymentMethod = 'bank_transfer', $description = null) {
        if ($amount <= 0) {
            return ['success' => false, 'message' => 'المبلغ يجب أن يكون أكبر من صفر'];
        }

        $this->ensureWalletExists($userId);
        $balanceBefore = $this->getBalance($userId);
        $balanceAfter = $balanceBefore + $amount;

        try {
            $this->db->beginTransaction();

            // Update wallet
            $sql = "UPDATE wallet SET balance = ?, total_deposited = total_deposited + ? WHERE user_id = ?";
            $this->db->execute($sql, [$balanceAfter, $amount, $userId]);

            // Record transaction
            $sql = "INSERT INTO wallet_transactions 
                    (user_id, transaction_type, amount, balance_before, balance_after, description, payment_method)
                    VALUES (?, 'deposit', ?, ?, ?, ?, ?)";
            $this->db->execute($sql, [$userId, $amount, $balanceBefore, $balanceAfter, $description, $paymentMethod]);

            $this->db->commit();

            return [
                'success' => true,
                'message' => 'تم إضافة الرصيد بنجاح',
                'balance' => $balanceAfter
            ];
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Wallet Add Funds Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ أثناء إضافة الرصيد'];
        }
    }

    public function deductFunds($userId, $amount, $referenceType = null, $referenceId = null, $description = null) {
        if ($amount <= 0) {
            return ['success' => false, 'message' => 'المبلغ يجب أن يكون أكبر من صفر'];
        }

        $balanceBefore = $this->getBalance($userId);
        
        if ($balanceBefore < $amount) {
            return ['success' => false, 'message' => 'الرصيد غير كافي'];
        }

        $balanceAfter = $balanceBefore - $amount;

        try {
            $this->db->beginTransaction();

            // Update wallet
            $sql = "UPDATE wallet SET balance = ?, total_spent = total_spent + ? WHERE user_id = ?";
            $this->db->execute($sql, [$balanceAfter, $amount, $userId]);

            // Record transaction
            $sql = "INSERT INTO wallet_transactions 
                    (user_id, transaction_type, amount, balance_before, balance_after, description, reference_type, reference_id)
                    VALUES (?, 'purchase', ?, ?, ?, ?, ?, ?)";
            $this->db->execute($sql, [$userId, $amount, $balanceBefore, $balanceAfter, $description, $referenceType, $referenceId]);

            $this->db->commit();

            return [
                'success' => true,
                'message' => 'تم خصم المبلغ بنجاح',
                'balance' => $balanceAfter
            ];
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Wallet Deduct Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ أثناء خصم المبلغ'];
        }
    }

    public function getTransactions($userId, $page = 1, $limit = 20) {
        $offset = ($page - 1) * $limit;
        
        $countSql = "SELECT COUNT(*) as total FROM wallet_transactions WHERE user_id = ?";
        $countResult = $this->db->querySingle($countSql, [$userId]);
        
        $sql = "SELECT * FROM wallet_transactions WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $transactions = $this->db->query($sql, [$userId, $limit, $offset]);

        return [
            'success' => true,
            'transactions' => $transactions,
            'pagination' => [
                'total' => $countResult['total'],
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($countResult['total'] / $limit)
            ]
        ];
    }

    public function getWalletInfo($userId) {
        $this->ensureWalletExists($userId);
        $sql = "SELECT * FROM wallet WHERE user_id = ?";
        return $this->db->querySingle($sql, [$userId]);
    }
}
