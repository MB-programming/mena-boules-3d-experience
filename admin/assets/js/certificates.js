// Certificates Management
async function loadCertificates() {
    const result = await apiRequest('/admin/certificates/index.php');
    const tbody = document.getElementById('certificatesTable');

    if (result.success && result.certificates && result.certificates.length > 0) {
        tbody.innerHTML = result.certificates.map(cert => {
            return '<tr>' +
                '<td>' + cert.display_order + '</td>' +
                '<td><strong>' + escapeHtml(cert.certificate_name) + '</strong></td>' +
                '<td>' + escapeHtml(cert.issuer) + '</td>' +
                '<td>' + escapeHtml(cert.year) + '</td>' +
                '<td><span class="badge badge-' + (cert.is_active ? 'success' : 'danger') + '">' + (cert.is_active ? 'فعال' : 'غير فعال') + '</span></td>' +
                '<td>' +
                '<button class="btn btn-sm btn-secondary" onclick="editCertificate(' + cert.id + ')"><i class="fas fa-edit"></i></button> ' +
                '<button class="btn btn-sm btn-danger" onclick="deleteCertificate(' + cert.id + ', \'' + escapeHtml(cert.certificate_name) + '\')"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد شهادات</td></tr>';
    }
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'إضافة شهادة';
    document.getElementById('certificateForm').reset();
    document.getElementById('certificateId').value = '';
    document.getElementById('isActive').checked = true;
    document.getElementById('logoBgColor').value = '#667eea';
    openModal('certificateModal');
}

async function editCertificate(id) {
    const result = await apiRequest('/admin/certificates/get.php?id=' + id);
    if (result.success && result.certificate) {
        const c = result.certificate;
        document.getElementById('modalTitle').textContent = 'تعديل شهادة';
        document.getElementById('certificateId').value = c.id;
        document.getElementById('certificateName').value = c.certificate_name;
        document.getElementById('issuer').value = c.issuer;
        document.getElementById('year').value = c.year;
        document.getElementById('description').value = c.description || '';
        document.getElementById('logoBgColor').value = c.logo_bg_color || '#667eea';
        document.getElementById('displayOrder').value = c.display_order;
        document.getElementById('isActive').checked = c.is_active == 1;
        openModal('certificateModal');
    }
}

async function saveCertificate() {
    const id = document.getElementById('certificateId').value;
    const data = {
        certificate_name: document.getElementById('certificateName').value,
        issuer: document.getElementById('issuer').value,
        year: document.getElementById('year').value,
        description: document.getElementById('description').value,
        logo_bg_color: document.getElementById('logoBgColor').value,
        display_order: parseInt(document.getElementById('displayOrder').value),
        is_active: document.getElementById('isActive').checked ? 1 : 0
    };

    let result;
    if (id) {
        data.id = parseInt(id);
        result = await apiRequest('/admin/certificates/update.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    } else {
        result = await apiRequest('/admin/certificates/create.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    if (result.success) {
        showToast(result.message || 'تم الحفظ بنجاح', 'success');
        closeModal('certificateModal');
        loadCertificates();
    } else {
        showToast(result.message || 'فشل الحفظ', 'error');
    }
}

async function deleteCertificate(id, name) {
    confirmDialog('هل أنت متأكد من حذف الشهادة: ' + name + '؟', async function() {
        const result = await apiRequest('/admin/certificates/delete.php', {
            method: 'DELETE',
            body: JSON.stringify({ id: id })
        });
        if (result.success) {
            showToast('تم الحذف بنجاح', 'success');
            loadCertificates();
        } else {
            showToast(result.message || 'فشل الحذف', 'error');
        }
    });
}
