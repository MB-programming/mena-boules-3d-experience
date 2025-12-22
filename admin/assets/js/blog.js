// Blog Management
let currentPage = 1;
let categories = [];

async function loadBlogPosts(page = 1) {
    currentPage = page;
    const params = new URLSearchParams({ page: page, limit: 10 });
    const status = document.getElementById('filterStatus')?.value;
    if (status) params.append('status', status);

    const result = await apiRequest('/admin/blog/index.php?' + params.toString());
    const tbody = document.getElementById('blogTable');

    if (result.success && result.posts && result.posts.length > 0) {
        tbody.innerHTML = result.posts.map(post => {
            return '<tr>' +
                '<td><strong>' + escapeHtml(post.title) + '</strong><br><small>' + post.slug + '</small></td>' +
                '<td>' + escapeHtml(post.category_name || 'بدون تصنيف') + '</td>' +
                '<td>' + escapeHtml(post.author_name) + '</td>' +
                '<td><span class="badge badge-' + getStatusBadge(post.status) + '">' + getStatusText(post.status) + '</span></td>' +
                '<td>' + (post.published_at || '-') + '</td>' +
                '<td>' + post.views + '</td>' +
                '<td>' +
                '<button class="btn btn-sm btn-secondary" onclick="editPost(' + post.id + ')"><i class="fas fa-edit"></i></button> ' +
                '<button class="btn btn-sm btn-danger" onclick="deletePost(' + post.id + ', \'' + escapeHtml(post.title) + '\')"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');
        renderPagination('paginationContainer', currentPage, result.total_pages || 1, 'loadBlogPosts');
    } else {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد مقالات</td></tr>';
    }
}

async function loadCategories() {
    const result = await apiRequest('/admin/blog/categories.php');
    if (result.success) {
        categories = result.categories;
        const select = document.getElementById('categoryId');
        if (select) {
            select.innerHTML = '<option value="">اختر تصنيف...</option>' +
                categories.map(cat => '<option value="' + cat.id + '">' + escapeHtml(cat.name) + '</option>').join('');
        }
    }
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'إضافة مقالة جديدة';
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('status').value = 'draft';
    openModal('postModal');
}

async function editPost(id) {
    const result = await apiRequest('/admin/blog/get.php?id=' + id);
    if (result.success && result.post) {
        const p = result.post;
        document.getElementById('modalTitle').textContent = 'تعديل مقالة';
        document.getElementById('postId').value = p.id;
        document.getElementById('title').value = p.title;
        document.getElementById('slug').value = p.slug;
        document.getElementById('excerpt').value = p.excerpt || '';
        document.getElementById('content').value = p.content;
        document.getElementById('featuredImage').value = p.featured_image || '';
        document.getElementById('categoryId').value = p.category_id || '';
        document.getElementById('tags').value = p.tags || '';
        document.getElementById('status').value = p.status;
        document.getElementById('publishedAt').value = p.published_at ? p.published_at.substring(0, 16) : '';
        document.getElementById('metaTitle').value = p.meta_title || '';
        document.getElementById('metaDescription').value = p.meta_description || '';
        document.getElementById('metaKeywords').value = p.meta_keywords || '';
        document.getElementById('ogTitle').value = p.og_title || '';
        document.getElementById('ogDescription').value = p.og_description || '';
        document.getElementById('ogImage').value = p.og_image || '';
        document.getElementById('twitterTitle').value = p.twitter_title || '';
        document.getElementById('twitterDescription').value = p.twitter_description || '';
        document.getElementById('isFeatured').checked = p.is_featured == 1;
        openModal('postModal');
    }
}

async function savePost() {
    const id = document.getElementById('postId').value;
    const data = {
        title: document.getElementById('title').value,
        slug: document.getElementById('slug').value,
        excerpt: document.getElementById('excerpt').value,
        content: document.getElementById('content').value,
        featured_image: document.getElementById('featuredImage').value,
        category_id: parseInt(document.getElementById('categoryId').value) || null,
        tags: document.getElementById('tags').value,
        status: document.getElementById('status').value,
        published_at: document.getElementById('publishedAt').value || null,
        meta_title: document.getElementById('metaTitle').value,
        meta_description: document.getElementById('metaDescription').value,
        meta_keywords: document.getElementById('metaKeywords').value,
        og_title: document.getElementById('ogTitle').value,
        og_description: document.getElementById('ogDescription').value,
        og_image: document.getElementById('ogImage').value,
        twitter_title: document.getElementById('twitterTitle').value,
        twitter_description: document.getElementById('twitterDescription').value,
        is_featured: document.getElementById('isFeatured').checked ? 1 : 0
    };

    let result;
    if (id) {
        data.id = parseInt(id);
        result = await apiRequest('/admin/blog/update.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    } else {
        result = await apiRequest('/admin/blog/create.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    if (result.success) {
        showToast('تم الحفظ بنجاح', 'success');
        closeModal('postModal');
        loadBlogPosts(currentPage);
    } else {
        showToast(result.message || 'فشل الحفظ', 'error');
    }
}

async function deletePost(id, title) {
    confirmDialog('هل أنت متأكد من حذف المقالة: ' + title + '؟', async function() {
        const result = await apiRequest('/admin/blog/delete.php', {
            method: 'DELETE',
            body: JSON.stringify({ id: id })
        });
        if (result.success) {
            showToast('تم الحذف بنجاح', 'success');
            loadBlogPosts(currentPage);
        } else {
            showToast(result.message || 'فشل الحذف', 'error');
        }
    });
}

// Auto-fill SEO fields
function autoFillSEO() {
    const title = document.getElementById('title').value;
    const excerpt = document.getElementById('excerpt').value;
    const featuredImage = document.getElementById('featuredImage').value;

    if (!document.getElementById('metaTitle').value) {
        document.getElementById('metaTitle').value = title;
    }
    if (!document.getElementById('metaDescription').value) {
        document.getElementById('metaDescription').value = excerpt;
    }
    if (!document.getElementById('ogTitle').value) {
        document.getElementById('ogTitle').value = title;
    }
    if (!document.getElementById('ogDescription').value) {
        document.getElementById('ogDescription').value = excerpt;
    }
    if (!document.getElementById('ogImage').value) {
        document.getElementById('ogImage').value = featuredImage;
    }
    if (!document.getElementById('twitterTitle').value) {
        document.getElementById('twitterTitle').value = title;
    }
    if (!document.getElementById('twitterDescription').value) {
        document.getElementById('twitterDescription').value = excerpt;
    }
}
