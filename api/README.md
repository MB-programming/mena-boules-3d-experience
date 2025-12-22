# Mena Boules 3D Experience - Backend API

نظام Backend مبني بـ Native PHP وMySQL لتطبيق Mena Boules 3D Experience مع لوحة تحكم Admin كاملة.

## المتطلبات

- PHP 7.4 أو أحدث
- MySQL 5.7 أو أحدث
- Apache مع mod_rewrite مفعل
- PDO Extension

## التثبيت

### 1. إعداد قاعدة البيانات

قم بتشغيل ملف SQL لإنشاء قاعدة البيانات والجداول:

```bash
mysql -u root -p < api/config/schema.sql
```

### 2. تحديث إعدادات قاعدة البيانات

قم بتعديل ملف `api/config/database.php` وتحديث بيانات الاتصال:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'mena_boules_db');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
```

### 3. إعدادات الإيميل (اختياري)

لتفعيل إرسال الإيميلات، قم بتحديث إعدادات SMTP في `api/config/database.php`:

```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
```

### 4. تفعيل mod_rewrite في Apache

تأكد من تفعيل mod_rewrite:

```bash
sudo a2enmod rewrite
sudo service apache2 restart
```

## حساب Admin الافتراضي

بعد تشغيل schema.sql، يتم إنشاء حساب admin تلقائياً:

- **Email:** admin@menaboules.com
- **Password:** password
- **Role:** super_admin

⚠️ **مهم:** غيّر كلمة المرور فوراً بعد أول تسجيل دخول!

---

## Endpoints

### Authentication

#### 1. تسجيل مستخدم جديد
```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "01234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "user": {
    "id": 1,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01234567890"
  },
  "token": "your-session-token"
}
```

---

#### 2. تسجيل الدخول
```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "user": {
    "id": 1,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01234567890"
  },
  "token": "your-session-token"
}
```

---

#### 3. الحصول على بيانات المستخدم الحالي
```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer your-session-token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01234567890"
  }
}
```

---

#### 4. تسجيل الخروج
```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer your-session-token
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

#### 5. نسيت كلمة المرور
```
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "ahmed@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
}
```

---

#### 6. إعادة تعيين كلمة المرور
```
POST /api/auth/reset-password
```

**Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}
```

---

## هيكل المشروع

```
api/
├── auth/                    # Authentication endpoints
│   ├── register.php        # تسجيل مستخدم جديد
│   ├── login.php           # تسجيل الدخول
│   ├── logout.php          # تسجيل الخروج
│   ├── me.php              # الحصول على بيانات المستخدم
│   ├── forgot-password.php # نسيان كلمة المرور
│   └── reset-password.php  # إعادة تعيين كلمة المرور
├── config/                  # Configuration files
│   ├── database.php        # إعدادات قاعدة البيانات
│   └── schema.sql          # SQL schema
├── helpers/                 # Helper classes
│   ├── Database.php        # Database helper
│   ├── Auth.php            # Authentication helper
│   └── Email.php           # Email helper
├── middleware/              # Middleware
│   ├── cors.php            # CORS middleware
│   └── auth.php            # Authentication middleware
├── .htaccess               # Apache configuration
├── error.php               # Error handler
└── README.md               # هذا الملف
```

## الأمان

- كلمات المرور يتم تشفيرها باستخدام `password_hash()`
- استخدام Prepared Statements لمنع SQL Injection
- التحقق من صحة البيانات قبل معالجتها
- CORS محمي بقائمة Origins مسموحة
- Session tokens مؤمنة ولها فترة صلاحية

## معالجة الأخطاء

جميع الـ endpoints تعيد JSON response مع:
- `success`: boolean (true/false)
- `message`: رسالة بالعربية
- `data`: البيانات (في حالة النجاح)
- HTTP Status Codes مناسبة

## الاختبار

يمكنك اختبار الـ API باستخدام:
- Postman
- cURL
- Axios من Frontend

### مثال باستخدام cURL:

```bash
# تسجيل مستخدم جديد
curl -X POST http://localhost/mena-boules-3d-experience/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "password": "password123",
    "phone": "01234567890"
  }'

# تسجيل الدخول
curl -X POST http://localhost/mena-boules-3d-experience/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "password123"
  }'
```

## الدعم

للمشاكل والاستفسارات، يرجى فتح issue في المستودع.

---

## Admin Dashboard

لوحة تحكم كاملة للإدارة مع CRUD للمستخدمين والكورسات.

### Endpoints:

#### إحصائيات Dashboard
```
GET /api/admin/stats
```

#### إدارة المستخدمين
```
GET    /api/admin/users           # قائمة المستخدمين
GET    /api/admin/users/get       # الحصول على مستخدم
PUT    /api/admin/users/update    # تحديث مستخدم
DELETE /api/admin/users/delete    # حذف مستخدم
```

#### إدارة الكورسات
```
GET    /api/admin/courses         # قائمة الكورسات
POST   /api/admin/courses/create  # إنشاء كورس
GET    /api/admin/courses/get     # الحصول على كورس
PUT    /api/admin/courses/update  # تحديث كورس
DELETE /api/admin/courses/delete  # حذف كورس
```

للمزيد من التفاصيل، راجع [Admin API Documentation](admin/README.md)

---

## هيكل قاعدة البيانات

### الجداول:
- **users** - المستخدمين (مع role: user, admin, super_admin)
- **sessions** - جلسات المستخدمين
- **password_resets** - طلبات إعادة تعيين كلمة المرور
- **email_verifications** - تحقق البريد الإلكتروني
- **courses** - الكورسات
- **course_enrollments** - تسجيل المستخدمين في الكورسات
- **course_lessons** - دروس الكورسات (اختياري)

---

## License

Proprietary - All rights reserved
