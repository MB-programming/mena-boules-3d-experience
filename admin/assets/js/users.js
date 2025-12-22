// Users Management

let currentPage = 1;
let totalPages = 1;
let searchQuery = '';

// Load users
async function loadUsers(page = 1) {
    currentPage = page;

    const params = new URLSearchParams({
        page: page,
        limit: 15
    });

    if (searchQuery) {
        params.append('search', searchQuery);
    }

    const result = await apiRequest('/admin/users/index.php?' + params.toString());
    const tbody = document.getElementById('usersTable');

    if (result.success && result.users && result.users.length > 0) {
        tbody.innerHTML = result.users.map(user => {
            return '<tr>' +
                '<td>' + user.id + '</td>' +
                '<td>' + escapeHtml(user.full_name || 'N/A') + '</td>' +
                '<td>' + escapeHtml(user.email) + '</td>' +
                '<td>' + escapeHtml(user.phone || 'N/A') + '</td>' +
                '<td><span class="badge badge-' + getRoleBadge(user.role) + '">' + getRoleText(user.role) + '</span></td>' +
                '<td><span class="badge badge-' + (user.email_verified ? 'success' : 'warning') + '">' + (user.email_verified ? 'مفعل' : 'غير مفعل') + '</span></td>' +
                '<td>' + formatDate(user.created_at) + '</td>' +
                '<td>' +
                '<button class="btn btn-sm btn-secondary" onclick="editUser(' + user.id + ')">' +
                '<i class="fas fa-edit"></i>' +
                '</button> ' +
                '<button class="btn btn-sm btn-danger" onclick="deleteUser(' + user.id + ', \'' + escapeHtml(user.email) + '\')">' +
                '<i class="fas fa-trash"></i>' +
                '</button>' +
                '</td>' +
                '</tr>';
        }).join('');

        totalPages = result.total_pages || 1;
        renderPagination('paginationContainer', currentPage, totalPages, 'loadUsers');
    } else {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">' +
            '<i class="fas fa-users"></i>' +
            '<h3>لا توجد نتائج</h3>' +
            '<p>لم يتم العثور على مستخدمين</p>' +
            '</td></tr>';
        document.getElementById('paginationContainer').innerHTML = '';
    }
}

// Edit user
async function editUser(userId) {
    const result = await apiRequest('/admin/users/get.php?id=' + userId);

    if (result.success && result.user) {
        const user = result.user;
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editFullName').value = user.full_name || '';
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editRole').value = user.role;

        openModal('editModal');
    } else {
        showToast('فشل تحميل بيانات المستخدم', 'error');
    }
}

// Save user
async function saveUser() {
    const userId = document.getElementById('editUserId').value;
    const fullName = document.getElementById('editFullName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const role = document.getElementById('editRole').value;

    const result = await apiRequest('/admin/users/update.php', {
        method: 'PUT',
        body: JSON.stringify({
            id: parseInt(userId),
            full_name: fullName,
            email: email,
            phone: phone,
            role: role
        })
    });

    if (result.success) {
        showToast('تم تحديث المستخدم بنجاح', 'success');
        closeModal('editModal');
        loadUsers(currentPage);
    } else {
        showToast(result.message || 'فشل تحديث المستخدم', 'error');
    }
}

// Delete user
async function deleteUser(userId, email) {
    confirmDialog('هل أنت متأكد من حذف المستخدم: ' + email + '؟', async function() {
        const result = await apiRequest('/admin/users/delete.php', {
            method: 'DELETE',
            body: JSON.stringify({ id: userId })
        });

        if (result.success) {
            showToast('تم حذف المستخدم بنجاح', 'success');
            loadUsers(currentPage);
        } else {
            showToast(result.message || 'فشل حذف المستخدم', 'error');
        }
    });
}

// Search handler
let searchTimeout;
function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
        searchQuery = document.getElementById('searchInput').value.trim();
        loadUsers(1);
    }, 500);
}
