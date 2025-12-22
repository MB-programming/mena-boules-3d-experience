// Dashboard Functions

// Load dashboard statistics and data
async function loadDashboardData() {
    try {
        // Load stats
        const stats = await apiRequest('/admin/stats.php');

        if (stats.success) {
            document.getElementById('totalUsers').textContent = stats.data.total_users || 0;
            document.getElementById('totalCourses').textContent = stats.data.total_courses || 0;
            document.getElementById('totalEnrollments').textContent = stats.data.total_enrollments || 0;

            // Get projects count separately
            const projects = await apiRequest('/admin/projects/index.php?limit=1');
            if (projects.success) {
                document.getElementById('totalProjects').textContent = projects.total || 0;
            }
        }

        // Load recent users
        await loadRecentUsers();

        // Load recent courses
        await loadRecentCourses();

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load recent users
async function loadRecentUsers() {
    const result = await apiRequest('/admin/users/index.php?limit=5&sort=created_at&order=desc');
    const tbody = document.getElementById('recentUsersTable');

    if (result.success && result.users && result.users.length > 0) {
        tbody.innerHTML = result.users.map(user => `
            <tr>
                <td>${escapeHtml(user.full_name || 'N/A')}</td>
                <td>${escapeHtml(user.email)}</td>
                <td><span class="badge badge-${getRoleBadge(user.role)}">${getRoleText(user.role)}</span></td>
                <td>${formatDate(user.created_at)}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">لا توجد بيانات</td>
            </tr>
        `;
    }
}

// Load recent courses
async function loadRecentCourses() {
    const result = await apiRequest('/admin/courses/index.php?limit=5&sort=created_at&order=desc');
    const tbody = document.getElementById('recentCoursesTable');

    if (result.success && result.courses && result.courses.length > 0) {
        tbody.innerHTML = result.courses.map(course => `
            <tr>
                <td>${escapeHtml(course.title)}</td>
                <td><span class="badge badge-${getStatusBadge(course.status)}">${getStatusText(course.status)}</span></td>
                <td>${course.price > 0 ? course.price + ' جنيه' : 'مجاني'}</td>
                <td>${formatDate(course.created_at)}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">لا توجد بيانات</td>
            </tr>
        `;
    }
}

// Helper Functions

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'اليوم';
    } else if (diffDays === 1) {
        return 'أمس';
    } else if (diffDays < 7) {
        return `منذ ${diffDays} أيام`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
    }

    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get role badge class
function getRoleBadge(role) {
    const badges = {
        'super_admin': 'danger',
        'admin': 'warning',
        'user': 'primary'
    };
    return badges[role] || 'info';
}

// Get role text
function getRoleText(role) {
    const roles = {
        'super_admin': 'مدير رئيسي',
        'admin': 'مدير',
        'user': 'مستخدم'
    };
    return roles[role] || role;
}

// Get status badge class
function getStatusBadge(status) {
    const badges = {
        'published': 'success',
        'draft': 'warning',
        'archived': 'danger',
        'pending': 'info',
        'completed': 'success',
        'approved': 'success',
        'rejected': 'danger'
    };
    return badges[status] || 'info';
}

// Get status text
function getStatusText(status) {
    const statuses = {
        'published': 'منشور',
        'draft': 'مسودة',
        'archived': 'مؤرشف',
        'pending': 'قيد الانتظار',
        'completed': 'مكتمل',
        'approved': 'موافق عليه',
        'rejected': 'مرفوض'
    };
    return statuses[status] || status;
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    // Add toast styles if not already added
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                padding: 16px 24px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 3000;
                animation: toastSlideIn 0.3s ease-out;
            }
            .toast-success {
                border-right: 4px solid #28a745;
            }
            .toast-error {
                border-right: 4px solid #dc3545;
            }
            .toast i {
                font-size: 20px;
            }
            .toast-success i {
                color: #28a745;
            }
            .toast-error i {
                color: #dc3545;
            }
            @keyframes toastSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Confirm dialog
function confirmDialog(message, onConfirm) {
    const confirmed = confirm(message);
    if (confirmed) {
        onConfirm();
    }
}

// Modal helpers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Pagination helper
function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container || totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
        html += `<button onclick="${onPageChange}(${currentPage - 1})" class="pagination-btn">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }

    // Page numbers
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button onclick="${onPageChange}(${i})" class="pagination-btn ${i === currentPage ? 'active' : ''}">
            ${i}
        </button>`;
    }

    // Next button
    if (currentPage < totalPages) {
        html += `<button onclick="${onPageChange}(${currentPage + 1})" class="pagination-btn">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }

    html += '</div>';

    // Add pagination styles if not already added
    if (!document.getElementById('pagination-styles')) {
        const style = document.createElement('style');
        style.id = 'pagination-styles';
        style.textContent = `
            .pagination {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 24px;
            }
            .pagination-btn {
                padding: 8px 12px;
                border: 1px solid var(--border-color);
                background-color: var(--card-bg);
                color: var(--text-primary);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 500;
            }
            .pagination-btn:hover {
                background-color: var(--hover-bg);
            }
            .pagination-btn.active {
                background-color: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            .pagination-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = html;
}
