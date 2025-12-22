# Admin Dashboard API Documentation

لوحة تحكم الإدارة الكاملة مع CRUD للمستخدمين والكورسات.

## المصادقة

جميع endpoints الـ admin تحتاج إلى:
1. Token صالح في header: `Authorization: Bearer {token}`
2. دور المستخدم يجب أن يكون `admin` أو `super_admin`

## Admin Statistics

### الحصول على إحصائيات Dashboard

```
GET /api/admin/stats
```

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total_users": 150,
      "admin_users": 3,
      "regular_users": 147,
      "active_users": 145,
      "new_users_today": 5,
      "new_users_week": 23,
      "new_users_month": 87
    },
    "courses": {
      "total_courses": 45,
      "published_courses": 38,
      "featured_courses": 12,
      "total_students": 523,
      "average_rating": 4.5
    },
    "enrollments": {
      "total_enrollments": 523,
      "completed_enrollments": 234,
      "average_progress": 67.5
    }
  },
  "recent": {
    "users": [...],
    "courses": [...]
  },
  "popular_courses": [...]
}
```

---

## Users Management

### 1. الحصول على جميع المستخدمين

```
GET /api/admin/users?page=1&limit=10&role=user&status=active&search=ahmed
```

**Query Parameters:**
- `page` (optional): رقم الصفحة، default: 1
- `limit` (optional): عدد النتائج، default: 10, max: 100
- `role` (optional): تصفية حسب الدور (user, admin, super_admin)
- `status` (optional): تصفية حسب الحالة (active, inactive, suspended)
- `search` (optional): البحث في الاسم، البريد، الهاتف

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "01234567890",
      "avatar": null,
      "role": "user",
      "email_verified": 1,
      "status": "active",
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

---

### 2. الحصول على مستخدم معين

```
GET /api/admin/users/get?id=1
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01234567890",
    "avatar": null,
    "role": "user",
    "email_verified": 1,
    "status": "active",
    "created_at": "2024-01-15 10:30:00"
  }
}
```

---

### 3. تحديث مستخدم

```
PUT /api/admin/users/update
```

**Body:**
```json
{
  "id": 1,
  "name": "أحمد محمد الجديد",
  "email": "newemail@example.com",
  "phone": "01234567890",
  "role": "admin",
  "status": "active",
  "email_verified": 1,
  "password": "newpassword123"
}
```

**ملاحظات:**
- جميع الحقول اختيارية ما عدا `id`
- فقط `super_admin` يمكنه تعيين دور `super_admin`
- لا يمكن تعديل `super_admin` بواسطة `admin` عادي
- `password` اختياري - إذا تم توفيره سيتم تحديث كلمة المرور

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث المستخدم بنجاح",
  "user": {...}
}
```

---

### 4. حذف مستخدم

```
DELETE /api/admin/users/delete
```

**Body:**
```json
{
  "id": 1
}
```

**ملاحظات:**
- لا يمكنك حذف نفسك
- لا يمكن حذف `super_admin` بواسطة `admin` عادي

**Response:**
```json
{
  "success": true,
  "message": "تم حذف المستخدم بنجاح"
}
```

---

## Courses Management

### 1. الحصول على جميع الكورسات

```
GET /api/admin/courses?page=1&limit=10&is_published=1&level=beginner&category=design&search=photoshop
```

**Query Parameters:**
- `page` (optional): رقم الصفحة
- `limit` (optional): عدد النتائج
- `is_published` (optional): 0 أو 1
- `featured` (optional): 0 أو 1
- `level` (optional): beginner, intermediate, advanced
- `category` (optional): اسم الفئة
- `search` (optional): البحث في العنوان والوصف

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "title": "تعلم Photoshop من الصفر",
      "slug": "learn-photoshop-from-scratch",
      "description": "كورس شامل لتعلم فوتوشوب",
      "content": "...",
      "image": "course.jpg",
      "video_url": "https://...",
      "price": 299.00,
      "duration": 120,
      "level": "beginner",
      "category": "design",
      "is_published": 1,
      "featured": 1,
      "students_count": 45,
      "rating": 4.5,
      "created_by": 1,
      "creator_name": "Admin",
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 2. إنشاء كورس جديد

```
POST /api/admin/courses/create
```

**Body:**
```json
{
  "title": "تعلم Blender 3D",
  "description": "كورس شامل لتعلم Blender",
  "content": "محتوى الكورس التفصيلي...",
  "image": "blender-course.jpg",
  "video_url": "https://youtube.com/...",
  "price": 399.00,
  "duration": 180,
  "level": "intermediate",
  "category": "3d",
  "is_published": 1,
  "featured": 0
}
```

**الحقول المطلوبة:**
- `title`: عنوان الكورس (مطلوب)

**الحقول الاختيارية:**
- `description`: الوصف
- `content`: المحتوى الكامل
- `image`: رابط الصورة
- `video_url`: رابط الفيديو
- `price`: السعر (default: 0.00)
- `duration`: المدة بالدقائق
- `level`: المستوى (beginner, intermediate, advanced)
- `category`: الفئة
- `is_published`: منشور (0 أو 1)
- `featured`: مميز (0 أو 1)

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الكورس بنجاح",
  "course": {...}
}
```

---

### 3. الحصول على كورس معين

```
GET /api/admin/courses/get?id=1
```

**Response:**
```json
{
  "success": true,
  "course": {...}
}
```

---

### 4. تحديث كورس

```
PUT /api/admin/courses/update
```

**Body:**
```json
{
  "id": 1,
  "title": "تعلم Blender 3D - محدث",
  "description": "وصف محدث",
  "price": 349.00,
  "is_published": 1,
  "featured": 1
}
```

**ملاحظات:**
- `id` مطلوب
- جميع الحقول الأخرى اختيارية
- سيتم تحديث الـ slug تلقائياً إذا تغير العنوان

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث الكورس بنجاح",
  "course": {...}
}
```

---

### 5. حذف كورس

```
DELETE /api/admin/courses/delete
```

**Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم حذف الكورس بنجاح"
}
```

---

## الأخطاء الشائعة

### 401 Unauthorized
```json
{
  "success": false,
  "message": "غير مصرح - يجب تسجيل الدخول"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "غير مصرح - يجب أن تكون مسؤولاً للوصول إلى هذا المورد"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "المستخدم/الكورس غير موجود"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "بيانات غير صالحة"
}
```

---

## حساب Admin الافتراضي

عند تشغيل schema.sql، يتم إنشاء حساب admin افتراضي:

**Email:** admin@menaboules.com
**Password:** password
**Role:** super_admin

**⚠️ مهم:** غيّر كلمة المرور فوراً بعد أول تسجيل دخول!

---

## الأدوار والصلاحيات

### user
- مستخدم عادي
- لا يمكنه الوصول لـ admin endpoints

### admin
- يمكنه إدارة المستخدمين والكورسات
- لا يمكنه تعديل أو حذف `super_admin`
- لا يمكنه تعيين دور `super_admin`

### super_admin
- صلاحيات كاملة
- يمكنه إدارة جميع المستخدمين
- يمكنه تعيين أي دور
