# Deployment Guide - Mena Boules 3D Experience

## Server Configuration

### Database Settings
- **Host:** localhost
- **Database Name:** u186120816_cv
- **Username:** u186120816_cv
- **Password:** ?36PRDYk

### Domain Settings
- **Production Domain:** https://minaboules.com
- **Temporary Domain:** https://academy.karizmatek.com
- **API URL:** https://academy.karizmatek.com/api

---

## Deployment Steps

### 1. Upload Files
Upload all files to your server:
```
/public_html/
├── api/
├── admin/
└── docs/
```

### 2. Import Database
Run the database schema:
```bash
mysql -u u186120816_cv -p u186120816_cv < api/config/schema.sql
```

Or import via phpMyAdmin:
1. Login to phpMyAdmin
2. Select database `u186120816_cv`
3. Go to Import tab
4. Choose file: `api/config/schema.sql`
5. Click "Go"

### 3. Create Admin Account
**Option 1: Using PHP Script (Recommended)**
1. Visit: `https://academy.karizmatek.com/api/config/setup_admin.php`
2. This will create the admin account automatically
3. **Delete this file after use for security!**

**Option 2: Using API**
```bash
curl -X POST https://academy.karizmatek.com/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Mena Boules",
    "email": "minaboules@minaboules.com",
    "password": "mina2002306"
  }'
```

Then manually update the role in database:
```sql
UPDATE users SET role = 'super_admin', email_verified = 1 
WHERE email = 'minaboules@minaboules.com';
```

### 4. Admin Login
**URL:** https://academy.karizmatek.com/admin/login.html

**Credentials:**
- Email: `minaboules@minaboules.com`
- Password: `mina2002306`

---

## Security Checklist

### After Deployment:

1. ✅ **Delete setup files:**
   ```bash
   rm api/config/setup_admin.php
   rm api/config/create_admin.sql
   ```

2. ✅ **Update JWT Secret:**
   Edit `api/config/database.php`:
   ```php
   define('JWT_SECRET', 'your-new-random-secret-key-here');
   ```

3. ✅ **Set proper file permissions:**
   ```bash
   chmod 755 api/
   chmod 644 api/config/database.php
   ```

4. ✅ **Enable HTTPS:**
   - Ensure SSL certificate is installed
   - Force HTTPS redirects

5. ✅ **Configure .htaccess:**
   ```apache
   # Add to root .htaccess
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## API Endpoints

### Base URLs:
- **Production:** `https://academy.karizmatek.com/api`
- **Future:** `https://minaboules.com/api`

### Admin Panel:
- **URL:** `https://academy.karizmatek.com/admin/`
- **Login:** `https://academy.karizmatek.com/admin/login.html`

### Documentation:
- **API Docs:** `/docs/API_DOCUMENTATION.md`

---

## Troubleshooting

### Database Connection Error
Check:
1. Database credentials in `api/config/database.php`
2. MySQL service is running
3. Database user has proper permissions

### CORS Errors
Check:
1. Domain is in `ALLOWED_ORIGINS` in `api/config/database.php`
2. `api/middleware/cors.php` is included in endpoints

### 404 Errors
Check:
1. `.htaccess` files are uploaded
2. `mod_rewrite` is enabled
3. File paths are correct

---

## Backup

### Database Backup:
```bash
mysqldump -u u186120816_cv -p u186120816_cv > backup_$(date +%Y%m%d).sql
```

### Files Backup:
```bash
tar -czf backup_files_$(date +%Y%m%d).tar.gz api/ admin/ docs/
```

---

## Support

For technical support:
- Email: info@minaboules.com
- Documentation: `/docs/API_DOCUMENTATION.md`

---

**Last Updated:** December 2024
