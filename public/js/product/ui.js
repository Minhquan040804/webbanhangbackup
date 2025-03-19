// ui.js
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } from './api.js';

// Tải danh sách sản phẩm
export async function loadProducts() {
    try {
        const products = await getAllProducts();
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach((product, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.price_sale || 'N/A'}</td>
                <td>${product.quantity || '0'}</td>
                <td>${product.product_categoryId}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="window.editProduct('${product._id}')">
                        Sửa
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.deleteProduct('${product._id}')">
                        Xóa
                    </button>
                </td>
            `;
            productList.appendChild(tr);
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        alert('Không thể tải danh sách sản phẩm');
    }
}

// Thêm sản phẩm
export async function addProduct() {
    const title = document.getElementById('productTitle').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const price_sale = document.getElementById('productPriceSale').value.trim();
    const quantity = document.getElementById('productQuantity').value.trim();
    const product_categoryId = document.getElementById('productCategoryId').value.trim();

    if (!title || !price || !product_categoryId) {
        alert('Vui lòng nhập đầy đủ tiêu đề, giá và ID danh mục');
        return;
    }

    try {
        const productData = {
            title,
            price: Number(price),
            price_sale: price_sale ? Number(price_sale) : undefined,
            quantity: quantity ? Number(quantity) : undefined,
            product_categoryId
        };
        const result = await createProduct(productData);

        alert(result.message);
        bootstrap.Modal.getInstance(document.getElementById('createProductModal')).hide();
        resetCreateForm();
        loadProducts();
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert(error.response?.data?.message || 'Lỗi khi thêm sản phẩm');
    }
}

// Sửa sản phẩm
export async function editProduct(id) {
    try {
        const product = await getProductById(id);

        document.getElementById('editProductId').value = product._id;
        document.getElementById('editProductTitle').value = product.title;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductPriceSale').value = product.price_sale || '';
        document.getElementById('editProductQuantity').value = product.quantity || '';
        document.getElementById('editProductCategoryId').value = product.product_categoryId;

        const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editModal.show();
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        alert('Không thể tải thông tin sản phẩm');
    }
}

// Lưu sản phẩm đã sửa
export async function saveUpdatedProduct() {
    const id = document.getElementById('editProductId').value;
    const title = document.getElementById('editProductTitle').value.trim();
    const price = document.getElementById('editProductPrice').value.trim();
    const price_sale = document.getElementById('editProductPriceSale').value.trim();
    const quantity = document.getElementById('editProductQuantity').value.trim();
    const product_categoryId = document.getElementById('editProductCategoryId').value.trim();

    if (!title || !price || !product_categoryId) {
        alert('Vui lòng nhập đầy đủ tiêu đề, giá và ID danh mục');
        return;
    }

    try {
        const productData = {
            title,
            price: Number(price),
            price_sale: price_sale ? Number(price_sale) : undefined,
            quantity: quantity ? Number(quantity) : undefined,
            product_categoryId
        };
        const result = await updateProduct(id, productData);

        alert(result.message);
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        loadProducts();
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        alert(error.response?.data?.message || 'Lỗi khi cập nhật sản phẩm');
    }
}

// Xóa sản phẩm
export async function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
        const result = await deleteProduct(id);
        alert(result.message);
        loadProducts();
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert(error.response?.data?.message || 'Lỗi khi xóa sản phẩm');
    }
}

// Reset form thêm sản phẩm
function resetCreateForm() {
    document.getElementById('productTitle').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productPriceSale').value = '';
    document.getElementById('productQuantity').value = '';
    document.getElementById('productCategoryId').value = '';
}

// Gắn các hàm vào window để gọi từ HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;