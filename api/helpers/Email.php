<?php
/**
 * Email Helper Class
 * Handles sending emails using native PHP mail() or SMTP
 */

class Email {
    /**
     * Send password reset email
     */
    public function sendPasswordResetEmail($email, $token) {
        $resetLink = APP_URL . "/reset-password?token=" . $token;

        $subject = "إعادة تعيين كلمة المرور - " . APP_NAME;

        $message = "
        <!DOCTYPE html>
        <html dir='rtl' lang='ar'>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>" . APP_NAME . "</h1>
                </div>
                <div class='content'>
                    <h2>إعادة تعيين كلمة المرور</h2>
                    <p>مرحباً،</p>
                    <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
                    <p>للمتابعة، يرجى الضغط على الزر أدناه:</p>
                    <p style='text-align: center;'>
                        <a href='{$resetLink}' class='button'>إعادة تعيين كلمة المرور</a>
                    </p>
                    <p>أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
                    <p style='background: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;'>{$resetLink}</p>
                    <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
                    <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.</p>
                </div>
                <div class='footer'>
                    <p>&copy; " . date('Y') . " " . APP_NAME . ". جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->send($email, $subject, $message);
    }

    /**
     * Send welcome email
     */
    public function sendWelcomeEmail($email, $name) {
        $subject = "مرحباً بك في " . APP_NAME;

        $message = "
        <!DOCTYPE html>
        <html dir='rtl' lang='ar'>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>" . APP_NAME . "</h1>
                </div>
                <div class='content'>
                    <h2>مرحباً {$name}!</h2>
                    <p>نحن سعداء بانضمامك إلى " . APP_NAME . ".</p>
                    <p>تم إنشاء حسابك بنجاح ويمكنك الآن الاستمتاع بجميع مميزات المنصة.</p>
                    <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.</p>
                </div>
                <div class='footer'>
                    <p>&copy; " . date('Y') . " " . APP_NAME . ". جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->send($email, $subject, $message);
    }

    /**
     * Send email
     */
    private function send($to, $subject, $message) {
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM . ">" . "\r\n";

        try {
            // Using native PHP mail function
            // For production, consider using PHPMailer or SwiftMailer for SMTP
            $result = mail($to, $subject, $message, $headers);

            if ($result) {
                return [
                    'success' => true,
                    'message' => 'تم إرسال البريد الإلكتروني بنجاح'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'فشل إرسال البريد الإلكتروني'
                ];
            }
        } catch (Exception $e) {
            error_log("Email Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال البريد الإلكتروني'
            ];
        }
    }

    /**
     * Send email using SMTP (requires PHPMailer)
     * Uncomment and configure if you want to use SMTP
     */
    /*
    private function sendSMTP($to, $subject, $message) {
        require_once 'path/to/PHPMailer/PHPMailer.php';
        require_once 'path/to/PHPMailer/SMTP.php';
        require_once 'path/to/PHPMailer/Exception.php';

        $mail = new PHPMailer\PHPMailer\PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USER;
            $mail->Password = SMTP_PASS;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = SMTP_PORT;
            $mail->CharSet = 'UTF-8';

            // Recipients
            $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $message;

            $mail->send();
            return [
                'success' => true,
                'message' => 'Email sent successfully'
            ];
        } catch (Exception $e) {
            error_log("Email Error: {$mail->ErrorInfo}");
            return [
                'success' => false,
                'message' => 'Failed to send email'
            ];
        }
    }
    */
}
