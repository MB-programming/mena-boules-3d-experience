// API Base URL
const API_URL = '../api';

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');

    if (token && user) {
        const userData = JSON.parse(user);
        // Check if user is admin or super_admin
        if (userData.role === 'admin' || userData.role === 'super_admin') {
            // If on login page, redirect to dashboard
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
                return;
            }
            return userData;
        } else {
            // Not an admin, clear storage
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
        }
    }

    // If not logged in and not on login page, redirect to login
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }

    return null;
}

// Login function
async function login(email, password, remember = false) {
    try {
        const response = await fetch(`${API_URL}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            const user = data.user;

            // Check if user is admin or super_admin
            if (user.role !== 'admin' && user.role !== 'super_admin') {
                return {
                    success: false,
                    message: 'ليس لديك صلاحية الوصول للوحة التحكم'
                };
            }

            // Store token and user info
            localStorage.setItem('admin_token', user.session_token);
            localStorage.setItem('admin_user', JSON.stringify(user));

            if (remember) {
                localStorage.setItem('admin_remember', 'true');
            }

            return { success: true, user };
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال بالخادم'
        };
    }
}

// Logout function
function logout() {
    fetch(`${API_URL}/auth/logout.php`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'Content-Type': 'application/json'
        }
    }).finally(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_remember');
        window.location.href = 'login.html';
    });
}

// API request helper with authentication
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('admin_token');

    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);
        const data = await response.json();

        // If unauthorized, logout
        if (response.status === 401 || response.status === 403) {
            if (data.message && data.message.includes('session')) {
                logout();
            }
        }

        return { ...data, status: response.status };
    } catch (error) {
        console.error('API Request error:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال بالخادم'
        };
    }
}

// Show alert message
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;

    alertBox.className = `alert ${type}`;
    alertBox.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    alertBox.style.display = 'flex';

    // Auto hide after 5 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');

        // Show loading state
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';

        const result = await login(email, password, remember);

        // Hide loading state
        loginBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';

        if (result.success) {
            showAlert('تم تسجيل الدخول بنجاح!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert(result.message || 'فشل تسجيل الدخول. تحقق من البيانات المدخلة.');
        }
    });
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('login.html')) {
        checkAuth();
    }
});
