# API Documentation - Mena Boules 3D Experience Platform

Complete API documentation for all endpoints.

**Base URL**: `http://yoursite.com/api`  
**Authentication**: Bearer Token in `Authorization` header  
**Response Format**: JSON

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Profile](#user-profile)
3. [Courses](#courses)
4. [My Courses](#my-courses)
5. [Wishlist](#wishlist)
6. [Course Curriculum](#course-curriculum)
7. [Course Player & Progress](#course-player--progress)
8. [Wallet](#wallet)
9. [Orders & Checkout](#orders--checkout)
10. [Certificates](#certificates)
11. [Projects](#projects)
12. [Services](#services)
13. [Companies & Certificates Portfolio](#companies--certificates-portfolio)
14. [Blog](#blog)
15. [Content Management](#content-management)
16. [Admin APIs](#admin-apis)

---

## Authentication

### Register
```http
POST /auth/register.php
```

**Request Body:**
```json
{
  "full_name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "password": "password123",
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
    "full_name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "role": "user",
    "session_token": "abc123..."
  }
}
```

---

### Login
```http
POST /auth/login.php
```

**Request Body:**
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
    "full_name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "role": "user",
    "session_token": "abc123..."
  }
}
```

---

### Logout
```http
POST /auth/logout.php
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

### Get Current User
```http
GET /auth/me.php
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "full_name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "phone": "01234567890",
    "avatar": null,
    "role": "user"
  }
}
```

---

### Forgot Password
```http
POST /auth/forgot-password.php
```

**Request Body:**
```json
{
  "email": "ahmed@example.com"
}
```

---

### Reset Password
```http
POST /auth/reset-password.php
```

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "new_password123"
}
```

---

## User Profile

### Get Profile Dashboard
```http
GET /user/profile/dashboard.php
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "stats": {
      "enrolled_courses": 5,
      "completed_courses": 2,
      "certificates": 2,
      "total_spent": 500
    }
  }
}
```

---

### Update Profile
```http
PUT /user/profile/update.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "full_name": "Ahmed Mohamed Updated",
  "phone": "01234567890",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

### Change Password
```http
PUT /user/profile/change-password.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "current_password": "old_password",
  "new_password": "new_password123"
}
```

---

## Courses

### Get All Courses (Public)
```http
GET /public/courses/index.php?page=1&limit=10&category=web&search=react
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category slug
- `search` (optional): Search in title/description
- `level` (optional): Filter by level (beginner, intermediate, advanced)
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "title": "React Complete Course",
      "slug": "react-complete-course",
      "description": "Learn React from scratch",
      "thumbnail": "https://...",
      "price": 299,
      "discount_price": 199,
      "level": "beginner",
      "duration": "10 hours",
      "students_count": 150,
      "rating": 4.5,
      "instructor_name": "Mena Boules"
    }
  ],
  "total": 50,
  "page": 1,
  "total_pages": 5
}
```

---

### Get Single Course
```http
GET /public/courses/get.php?slug=react-complete-course
```

**Response:**
```json
{
  "success": true,
  "course": {
    "id": 1,
    "title": "React Complete Course",
    "slug": "react-complete-course",
    "description": "...",
    "content": "<p>Full description...</p>",
    "thumbnail": "...",
    "price": 299,
    "discount_price": 199,
    "level": "beginner",
    "duration": "10 hours",
    "requirements": ["HTML", "CSS", "JavaScript"],
    "what_you_will_learn": ["React Hooks", "State Management", "..."],
    "students_count": 150,
    "rating": 4.5,
    "is_enrolled": false,
    "is_in_wishlist": false,
    "sections": [
      {
        "id": 1,
        "title": "Introduction",
        "lessons_count": 5,
        "total_duration": "30 min"
      }
    ]
  }
}
```

---

## My Courses

### Get My Enrolled Courses
```http
GET /user/my-courses/index.php
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "title": "React Complete Course",
      "slug": "react-complete-course",
      "thumbnail": "...",
      "progress": 45,
      "enrolled_at": "2024-01-15 10:30:00",
      "completed_at": null,
      "total_lessons": 50,
      "completed_lessons": 22,
      "last_accessed_lesson": "Lesson 22: State Management"
    }
  ]
}
```

---

## Wishlist

### Add to Wishlist
```http
POST /user/wishlist/add.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "course_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "تمت الإضافة إلى المفضلة"
}
```

---

### Remove from Wishlist
```http
DELETE /user/wishlist/remove.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "course_id": 1
}
```

---

### Get My Wishlist
```http
GET /user/wishlist/index.php
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "wishlist": [
    {
      "id": 2,
      "title": "Advanced React Patterns",
      "slug": "advanced-react-patterns",
      "thumbnail": "...",
      "price": 399,
      "discount_price": 299,
      "added_at": "2024-01-20 15:00:00"
    }
  ]
}
```

---

## Course Curriculum

### Get Course Curriculum (With Access Check)
```http
GET /user/course-player/get-course.php?course_id=1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "course": {
    "id": 1,
    "title": "React Complete Course",
    "sections": [
      {
        "id": 1,
        "title": "Introduction",
        "description": "Getting started",
        "lessons": [
          {
            "id": 1,
            "title": "Welcome to the Course",
            "description": "...",
            "video_url": "https://youtube.com/watch?v=...",
            "video_type": "youtube",
            "video_duration": 300,
            "is_preview": true,
            "is_completed": false,
            "resources": [
              {
                "id": 1,
                "title": "Course Syllabus",
                "file_url": "...",
                "file_type": "pdf",
                "file_size": 2048000
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Course Player & Progress

### Update Lesson Progress
```http
POST /user/course-player/update-progress.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "lesson_id": 1,
  "progress_percentage": 75,
  "is_completed": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث التقدم",
  "course_progress": 45
}
```

---

### Mark Lesson as Complete
```http
POST /user/course-player/update-progress.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "lesson_id": 1,
  "is_completed": true,
  "progress_percentage": 100
}
```

---

## Wallet

### Get Wallet Balance
```http
GET /user/wallet/balance.php
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "balance": 500.00,
  "currency": "EGP"
}
```

---

### Add Funds to Wallet
```http
POST /user/wallet/add-funds.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "amount": 100,
  "payment_method": "card",
  "transaction_ref": "TXN123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تمت إضافة الرصيد بنجاح",
  "new_balance": 600.00
}
```

---

### Get Transaction History
```http
GET /user/wallet/transactions.php?page=1&limit=20
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "type": "credit",
      "amount": 100,
      "description": "إضافة رصيد",
      "balance_after": 600,
      "created_at": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "type": "debit",
      "amount": 299,
      "description": "شراء دورة: React Complete Course",
      "balance_after": 301,
      "created_at": "2024-01-16 14:20:00"
    }
  ],
  "total": 25,
  "page": 1,
  "total_pages": 2
}
```

---

## Orders & Checkout

### Create Order (Add to Cart)
```http
POST /user/checkout/create-order.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "course_id": 1,
      "price": 299
    },
    {
      "course_id": 2,
      "price": 399
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order_id": 123,
  "total_amount": 698,
  "message": "تم إنشاء الطلب بنجاح"
}
```

---

### Process Payment (From Wallet)
```http
POST /user/checkout/process-payment.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "order_id": 123,
  "payment_method": "wallet"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم الدفع بنجاح",
  "enrollment_ids": [1, 2]
}
```

---

### Enroll with Access Code
```http
POST /user/checkout/enroll-with-code.php
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "course_id": 1,
  "access_code": "PROMO2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم الاشتراك بنجاح باستخدام الكود",
  "enrollment_id": 5
}
```

---

### Get My Orders
```http
GET /user/checkout/my-orders.php?page=1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": 123,
      "total_amount": 698,
      "status": "completed",
      "payment_method": "wallet",
      "created_at": "2024-01-15",
      "items": [
        {
          "course_title": "React Complete Course",
          "price": 299
        }
      ]
    }
  ]
}
```

---

## Certificates

### Get My Certificates
```http
GET /user/certificate/my-certificates.php
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "certificates": [
    {
      "id": 1,
      "course_title": "React Complete Course",
      "certificate_code": "CERT-2024-001",
      "issued_at": "2024-01-20",
      "certificate_url": "/certificates/CERT-2024-001"
    }
  ]
}
```

---

### Verify Certificate (Public)
```http
GET /user/certificate/verify.php?code=CERT-2024-001
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "code": "CERT-2024-001",
    "student_name": "Ahmed Mohamed",
    "course_title": "React Complete Course",
    "issued_at": "2024-01-20",
    "is_valid": true
  }
}
```

---

## Projects

### Get All Projects (Public)
```http
GET /public/projects/index.php?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": 1,
      "title": "3D Architecture Visualization",
      "slug": "3d-architecture-visualization",
      "description": "...",
      "thumbnail": "...",
      "images": ["img1.jpg", "img2.jpg"],
      "technologies": ["Blender", "Unity", "C#"],
      "project_url": "https://...",
      "status": "published"
    }
  ]
}
```

---

### Get Single Project
```http
GET /public/projects/get.php?slug=3d-architecture-visualization
```

---

## Services

### Get All Services (Public)
```http
GET /public/services/index.php
```

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "id": 1,
      "title": "3D Modeling Service",
      "slug": "3d-modeling-service",
      "description": "...",
      "price": 500,
      "pricing_type": "fixed",
      "features": ["Feature 1", "Feature 2"],
      "status": "published"
    }
  ]
}
```

---

## Companies & Certificates Portfolio

### Get Companies I Worked With
```http
GET /public/portfolio/companies.php
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company_name": "Wida",
      "position": "Web Developer",
      "company_handle": "@Wida",
      "start_date": "Jan 2025",
      "end_date": "Present",
      "is_current": 1,
      "logo_bg_color": "#4a5568"
    }
  ]
}
```

---

### Get Education & Certificates
```http
GET /public/portfolio/certificates.php
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "certificate_name": "ICDL Specto & Edraak",
      "issuer": "@Edraak",
      "year": "2019",
      "logo_bg_color": "#ec4899"
    }
  ]
}
```

---

## Blog

### Get Blog Posts (Public)
```http
GET /public/blog/posts.php?page=1&limit=10&category=1&search=react
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with React",
      "slug": "getting-started-with-react",
      "excerpt": "...",
      "featured_image": "...",
      "category_name": "Web Development",
      "author_name": "Mena Boules",
      "published_at": "2024-01-15",
      "views": 150,
      "reading_time": 5,
      "tags": "react,javascript,tutorial"
    }
  ],
  "total": 50,
  "page": 1,
  "total_pages": 5
}
```

---

### Get Single Blog Post
```http
GET /public/blog/post.php?slug=getting-started-with-react
```

**Response:**
```json
{
  "success": true,
  "post": {
    "id": 1,
    "title": "Getting Started with React",
    "slug": "getting-started-with-react",
    "content": "<p>Full article content...</p>",
    "featured_image": "...",
    "category_name": "Web Development",
    "author_name": "Mena Boules",
    "author_avatar": "...",
    "published_at": "2024-01-15",
    "views": 151,
    "reading_time": 5,
    "meta_title": "...",
    "meta_description": "...",
    "og_title": "...",
    "og_image": "...",
    "twitter_card": "summary_large_image"
  }
}
```

---

### Get Blog Categories
```http
GET /public/blog/categories.php
```

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "3D Modeling",
      "slug": "3d-modeling",
      "description": "...",
      "color": "#667eea",
      "post_count": 12
    }
  ]
}
```

---

## Content Management

### Get Homepage Content
```http
GET /public/content/home.php
```

**Response:**
```json
{
  "success": true,
  "content": {
    "hero": {
      "title": "...",
      "subtitle": "...",
      "cta_text": "...",
      "background_image": "..."
    },
    "features": [...],
    "stats": [...],
    "testimonials": [...]
  }
}
```

---

### Get About Page Content
```http
GET /public/content/about.php
```

---

### Get Site Info
```http
GET /public/content/site-info.php
```

**Response:**
```json
{
  "success": true,
  "data": {
    "site_name": "Mena Boules 3D Experience",
    "tagline": "...",
    "logo": "...",
    "contact_email": "...",
    "contact_phone": "...",
    "social_links": {
      "facebook": "...",
      "twitter": "...",
      "instagram": "..."
    }
  }
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "معرف الدورة مطلوب"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "يجب تسجيل الدخول أولاً"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "ليس لديك صلاحية للوصول"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "المورد غير موجود"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "حدث خطأ في الخادم"
}
```

---

## Rate Limiting

Currently, there are no rate limits. This will be implemented in future versions.

---

## Versioning

Current API Version: **v1**

All endpoints are currently under `/api/` and are considered v1.

---

## Support

For API support, contact: **info@menaboules.com**

---

**Last Updated:** December 2024
