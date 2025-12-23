// Skills Management

let currentPage = 1;
const perPage = 15;

// Load skills list
async function loadSkills(page = 1) {
    currentPage = page;
    const category = document.getElementById('filterCategory').value;
    
    let url = `/admin/skills/index.php?page=${page}&limit=${perPage}`;
    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }

    const result = await apiRequest(url);
    const tbody = document.getElementById('skillsTable');

    if (result.success && result.data && result.data.length > 0) {
        tbody.innerHTML = result.data.map(skill => `
            <tr>
                <td>
                    <div class="skill-icon-preview" style="background-color: ${escapeHtml(skill.color)}20; color: ${escapeHtml(skill.color)};">
                        <i class="fas fa-code"></i>
                    </div>
                </td>
                <td>
                    <strong>${escapeHtml(skill.name)}</strong>
                    <br><small class="text-muted">Icon: ${escapeHtml(skill.icon || 'Sparkles')}</small>
                </td>
                <td><span class="badge badge-info">${escapeHtml(skill.category)}</span></td>
                <td>
                    <span class="color-preview" style="background-color: ${escapeHtml(skill.color)};"></span>
                    ${escapeHtml(skill.color)}
                </td>
                <td>
                    <span class="badge badge-${skill.is_active == 1 ? 'success' : 'warning'}">
                        ${skill.is_active == 1 ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editSkill(${skill.id})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSkill(${skill.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Render pagination
        const totalPages = Math.ceil((result.total || result.data.length) / perPage);
        renderPagination('paginationContainer', currentPage, totalPages, 'loadSkills');
    } else {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <i class="fas fa-code" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>لا توجد مهارات</p>
                </td>
            </tr>
        `;
        document.getElementById('paginationContainer').innerHTML = '';
    }
}

// Open add modal
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'إضافة مهارة جديدة';
    document.getElementById('skillForm').reset();
    document.getElementById('skillId').value = '';
    document.getElementById('isActive').checked = true;
    document.getElementById('colorPicker').value = '#667eea';
    document.getElementById('color').value = '#667eea';
    openModal('skillModal');
}

// Edit skill
async function editSkill(id) {
    const result = await apiRequest(`/admin/skills/get.php?id=${id}`);
    
    if (result.success && result.data) {
        const skill = result.data;
        document.getElementById('modalTitle').textContent = 'تعديل المهارة';
        document.getElementById('skillId').value = skill.id;
        document.getElementById('name').value = skill.name || '';
        document.getElementById('icon').value = skill.icon || '';
        document.getElementById('category').value = skill.category || '';
        document.getElementById('color').value = skill.color || '#667eea';
        document.getElementById('colorPicker').value = skill.color || '#667eea';
        document.getElementById('isActive').checked = skill.is_active == 1;
        openModal('skillModal');
    } else {
        showToast('حدث خطأ في تحميل بيانات المهارة', 'error');
    }
}

// Save skill
async function saveSkill() {
    const id = document.getElementById('skillId').value;
    const name = document.getElementById('name').value.trim();
    const icon = document.getElementById('icon').value.trim();
    const category = document.getElementById('category').value;
    const color = document.getElementById('color').value.trim();
    const isActive = document.getElementById('isActive').checked ? 1 : 0;

    // Validation
    if (!name || name.length > 50) {
        showToast('اسم المهارة مطلوب ويجب أن يكون أقل من 50 حرف', 'error');
        return;
    }
    if (!icon) {
        showToast('اسم الأيقونة مطلوب', 'error');
        return;
    }
    if (!category) {
        showToast('يرجى اختيار تصنيف', 'error');
        return;
    }
    if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        showToast('يرجى إدخال لون صحيح بصيغة Hex (مثال: #667eea)', 'error');
        return;
    }

    const data = {
        name,
        icon,
        category,
        color,
        is_active: isActive
    };

    const url = id ? '/admin/skills/update.php' : '/admin/skills/create.php';
    if (id) data.id = id;

    const result = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (result.success) {
        showToast(id ? 'تم تحديث المهارة بنجاح' : 'تم إضافة المهارة بنجاح', 'success');
        closeModal('skillModal');
        loadSkills(currentPage);
    } else {
        showToast(result.message || 'حدث خطأ', 'error');
    }
}

// Delete skill
function deleteSkill(id) {
    confirmDialog('هل أنت متأكد من حذف هذه المهارة؟', async () => {
        const result = await apiRequest('/admin/skills/delete.php', {
            method: 'POST',
            body: JSON.stringify({ id })
        });

        if (result.success) {
            showToast('تم حذف المهارة بنجاح', 'success');
            loadSkills(currentPage);
        } else {
            showToast(result.message || 'حدث خطأ في الحذف', 'error');
        }
    });
}
