// Companies Management
async function loadCompanies() {
    const result = await apiRequest('/admin/companies/index.php');
    const tbody = document.getElementById('companiesTable');

    if (result.success && result.companies && result.companies.length > 0) {
        tbody.innerHTML = result.companies.map(company => {
            const period = company.start_date + ' - ' + (company.end_date || 'Present');
            return '<tr>' +
                '<td>' + company.display_order + '</td>' +
                '<td><strong>' + escapeHtml(company.company_name) + '</strong><br><small>' + escapeHtml(company.company_handle || '') + '</small></td>' +
                '<td>' + escapeHtml(company.position) + '</td>' +
                '<td>' + period + (company.is_current ? ' <span class="badge badge-success">حالياً</span>' : '') + '</td>' +
                '<td><span class="badge badge-' + (company.is_active ? 'success' : 'danger') + '">' + (company.is_active ? 'فعال' : 'غير فعال') + '</span></td>' +
                '<td>' +
                '<button class="btn btn-sm btn-secondary" onclick="editCompany(' + company.id + ')"><i class="fas fa-edit"></i></button> ' +
                '<button class="btn btn-sm btn-danger" onclick="deleteCompany(' + company.id + ', \'' + escapeHtml(company.company_name) + '\')"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد شركات</td></tr>';
    }
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'إضافة شركة';
    document.getElementById('companyForm').reset();
    document.getElementById('companyId').value = '';
    document.getElementById('isActive').checked = true;
    document.getElementById('logoBgColor').value = '#667eea';
    openModal('companyModal');
}

async function editCompany(id) {
    const result = await apiRequest('/admin/companies/get.php?id=' + id);
    if (result.success && result.company) {
        const c = result.company;
        document.getElementById('modalTitle').textContent = 'تعديل شركة';
        document.getElementById('companyId').value = c.id;
        document.getElementById('companyName').value = c.company_name;
        document.getElementById('position').value = c.position;
        document.getElementById('companyHandle').value = c.company_handle || '';
        document.getElementById('startDate').value = c.start_date;
        document.getElementById('endDate').value = c.end_date || '';
        document.getElementById('logoBgColor').value = c.logo_bg_color || '#667eea';
        document.getElementById('displayOrder').value = c.display_order;
        document.getElementById('isCurrent').checked = c.is_current == 1;
        document.getElementById('isActive').checked = c.is_active == 1;
        openModal('companyModal');
    }
}

async function saveCompany() {
    const id = document.getElementById('companyId').value;
    const data = {
        company_name: document.getElementById('companyName').value,
        position: document.getElementById('position').value,
        company_handle: document.getElementById('companyHandle').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        logo_bg_color: document.getElementById('logoBgColor').value,
        display_order: parseInt(document.getElementById('displayOrder').value),
        is_current: document.getElementById('isCurrent').checked ? 1 : 0,
        is_active: document.getElementById('isActive').checked ? 1 : 0
    };

    let result;
    if (id) {
        data.id = parseInt(id);
        result = await apiRequest('/admin/companies/update.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    } else {
        result = await apiRequest('/admin/companies/create.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    if (result.success) {
        showToast(result.message || 'تم الحفظ بنجاح', 'success');
        closeModal('companyModal');
        loadCompanies();
    } else {
        showToast(result.message || 'فشل الحفظ', 'error');
    }
}

async function deleteCompany(id, name) {
    confirmDialog('هل أنت متأكد من حذف الشركة: ' + name + '؟', async function() {
        const result = await apiRequest('/admin/companies/delete.php', {
            method: 'DELETE',
            body: JSON.stringify({ id: id })
        });
        if (result.success) {
            showToast('تم الحذف بنجاح', 'success');
            loadCompanies();
        } else {
            showToast(result.message || 'فشل الحذف', 'error');
        }
    });
}
