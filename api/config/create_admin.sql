-- Create Super Admin Account
-- Username: minaboules
-- Email: minaboules@minaboules.com
-- Password: mina2002306

-- First, delete if exists to avoid duplicates
DELETE FROM users WHERE email = 'minaboules@minaboules.com';

-- Insert the super admin user
-- Password hash for 'mina2002306' using PHP password_hash()
INSERT INTO users (
    full_name,
    email,
    password,
    phone,
    role,
    email_verified,
    status,
    created_at
) VALUES (
    'Mena Boules',
    'minaboules@minaboules.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- This is a placeholder
    NULL,
    'super_admin',
    1,
    'active',
    NOW()
);

-- Note: The password hash above is a placeholder
-- You need to run this PHP code to generate the correct hash:
-- <?php echo password_hash('mina2002306', PASSWORD_DEFAULT); ?>
-- Then replace the hash in this SQL file

-- Or better: Use the admin registration endpoint to create the account
