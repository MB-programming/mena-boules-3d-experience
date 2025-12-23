# SQLite Database Configuration

## Quick Start

1. Upload the `api` folder to your Hostinger server
2. Visit `https://your-domain.com/api/config/setup.php` to initialize the database
3. Delete `setup.php` after initialization (for security)
4. Login to admin panel with:
   - Email: `admin@menaboules.com`
   - Password: `admin123`

## Database Location

The SQLite database file is stored at:
```
api/data/database.sqlite
```

This folder is protected by `.htaccess` and cannot be accessed directly from the web.

## Configuration

Edit `api/config/database.php` to change:
- Application name and URLs
- Email settings
- Security settings (JWT secret, session lifetime)
- CORS allowed origins

## Backup

To backup your data, simply copy the `api/data/database.sqlite` file.

## Security Notes

- Change the default admin password immediately after first login
- Update the `JWT_SECRET` in `database.php` to a unique random string
- Keep the `api/data` folder protected
