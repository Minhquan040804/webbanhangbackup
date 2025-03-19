// main.js
import { loadProducts, addProduct, saveUpdatedProduct } from './ui.js';

// Tải danh sách sản phẩm khi trang load
document.addEventListener('DOMContentLoaded', loadProducts);

// Gắn sự kiện cho nút Lưu trong modal thêm
document.querySelector('#createProductModal .btn-primary').addEventListener('click', addProduct);

// Gắn sự kiện cho nút Lưu trong modal sửa
document.querySelector('#editProductModal .btn-primary').addEventListener('click', saveUpdatedProduct);

// Xử lý Enter trong modal thêm
document.getElementById('createProductModal').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') addProduct();
});

// Xử lý Enter trong modal sửa
document.getElementById('editProductModal').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') saveUpdatedProduct();
});