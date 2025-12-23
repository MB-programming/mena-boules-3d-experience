// Projects Management

let currentPage = 1;
const perPage = 10;

// Load projects list
async function loadProjects(page = 1) {
    currentPage = page;
    const category = document.getElementById('filterCategory').value;
    
    let url = `/admin/projects/index.php?page=${page}&limit=${perPage}`;
    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }

    const result = await apiRequest(url);
    const tbody = document.getElementById('projectsTable');

    if (result.success && result.data && result.data.length > 0) {
        tbody.innerHTML = result.data.map(project => `
            <tr>
                <td>
                    <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" 
                         style="width: 60px; height: 45px; object-fit: cover; border-radius: 6px;"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23ccc%22%3E%3Crect width=%2224%22 height=%2224%22/%3E%3C/svg%3E'">
                </td>
                <td>
                    <strong>${escapeHtml(project.title)}</strong>
                    <br><small class="text-muted">${escapeHtml(project.slug || '')}</small>
                </td>
                <td><span class="badge badge-info">${escapeHtml(project.category)}</span></td>
                <td>${escapeHtml(project.price || 'N/A')}</td>
                <td>
                    <span class="badge badge-${project.is_active == 1 ? 'success' : 'warning'}">
                        ${project.is_active == 1 ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editProject(${project.id})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${project.link ? `
                        <a href="${escapeHtml(project.link)}" target="_blank" class="btn btn-sm btn-primary" title="عرض">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    ` : ''}
                </td>
            </tr>
        `).join('');

        // Render pagination
        const totalPages = Math.ceil((result.total || result.data.length) / perPage);
        renderPagination('paginationContainer', currentPage, totalPages, 'loadProjects');
    } else {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <i class="fas fa-folder-open" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>لا توجد مشاريع</p>
                </td>
            </tr>
        `;
        document.getElementById('paginationContainer').innerHTML = '';
    }
}

// Open add modal
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'إضافة مشروع جديد';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('isActive').checked = true;
    openModal('projectModal');
}

// Edit project
async function editProject(id) {
    const result = await apiRequest(`/admin/projects/get.php?id=${id}`);
    
    if (result.success && result.data) {
        const project = result.data;
        document.getElementById('modalTitle').textContent = 'تعديل المشروع';
        document.getElementById('projectId').value = project.id;
        document.getElementById('title').value = project.title || '';
        document.getElementById('slug').value = project.slug || '';
        document.getElementById('description').value = project.description || '';
        document.getElementById('category').value = project.category || '';
        document.getElementById('image').value = project.image || '';
        document.getElementById('link').value = project.link || '';
        document.getElementById('price').value = project.price || '';
        document.getElementById('tags').value = project.tags || '';
        document.getElementById('technologies').value = project.technologies || '';
        document.getElementById('isActive').checked = project.is_active == 1;
        openModal('projectModal');
    } else {
        showToast('حدث خطأ في تحميل بيانات المشروع', 'error');
    }
}

// Save project
async function saveProject() {
    const id = document.getElementById('projectId').value;
    const title = document.getElementById('title').value.trim();
    const slug = document.getElementById('slug').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value.trim();
    const link = document.getElementById('link').value.trim();
    const price = document.getElementById('price').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const technologies = document.getElementById('technologies').value.trim();
    const isActive = document.getElementById('isActive').checked ? 1 : 0;

    // Validation
    if (!title || title.length > 100) {
        showToast('العنوان مطلوب ويجب أن يكون أقل من 100 حرف', 'error');
        return;
    }
    if (!description || description.length > 500) {
        showToast('الوصف مطلوب ويجب أن يكون أقل من 500 حرف', 'error');
        return;
    }
    if (!category) {
        showToast('يرجى اختيار تصنيف', 'error');
        return;
    }
    if (!image) {
        showToast('رابط الصورة مطلوب', 'error');
        return;
    }

    const data = {
        title,
        slug: slug || generateSlug(title),
        description,
        category,
        image,
        link,
        price,
        tags,
        technologies,
        is_active: isActive
    };

    const url = id ? '/admin/projects/update.php' : '/admin/projects/create.php';
    if (id) data.id = id;

    const result = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (result.success) {
        showToast(id ? 'تم تحديث المشروع بنجاح' : 'تم إضافة المشروع بنجاح', 'success');
        closeModal('projectModal');
        loadProjects(currentPage);
    } else {
        showToast(result.message || 'حدث خطأ', 'error');
    }
}

// Delete project
function deleteProject(id) {
    confirmDialog('هل أنت متأكد من حذف هذا المشروع؟', async () => {
        const result = await apiRequest('/admin/projects/delete.php', {
            method: 'POST',
            body: JSON.stringify({ id })
        });

        if (result.success) {
            showToast('تم حذف المشروع بنجاح', 'success');
            loadProjects(currentPage);
        } else {
            showToast(result.message || 'حدث خطأ في الحذف', 'error');
        }
    });
}

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
