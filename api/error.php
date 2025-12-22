<?php
/**
 * Error Handler
 */

header("Content-Type: application/json; charset=UTF-8");

$errorCode = http_response_code();

$errors = [
    400 => 'طلب غير صحيح',
    401 => 'غير مصرح',
    403 => 'محظور',
    404 => 'غير موجود',
    405 => 'طريقة غير مسموحة',
    500 => 'خطأ في الخادم'
];

$message = isset($errors[$errorCode]) ? $errors[$errorCode] : 'حدث خطأ';

echo json_encode([
    'success' => false,
    'error' => $errorCode,
    'message' => $message
]);
