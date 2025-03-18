const API_URL = "http://localhost:3000/products";

// Hàm lấy danh sách sản phẩm và hiển thị lên giao diện
function fetchProducts() {
    axios.get(API_URL)
        .then(response => {
            const products = response.data;
            const productList = document.getElementById("productList");
            productList.innerHTML = ""; // Xóa danh sách cũ

            products.forEach((product, index) => {
                const productId = product._id?.$oid || product._id;
                if (!productId) {
                    console.error("Không tìm thấy ID sản phẩm:", product);
                    return;
                }

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.title}</td>
                    <td>${product.price.toLocaleString()} đ</td>
                    <td>${product.price_sale.toLocaleString()} đ</td>
                    <td>${product.quantity}</td>
                    <td>
                        <img src="${product.image}" alt="${product.title}" width="50" height="50">
                    </td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateProduct('${productId}')">Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${productId}')">Xóa</button>
                    </td>
                `;
                productList.appendChild(tr);
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh sách sản phẩm:", error));
}

// Thêm sản phẩm mới
function addProduct() {
    const title = document.getElementById("productTitle").value.trim();
    const price = document.getElementById("productPrice").value;
    const priceSale = document.getElementById("productPriceSale").value;
    const quantity = document.getElementById("productQuantity").value;
    const image = document.getElementById("productImage").value;

    if (!title || !price || !quantity) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    axios.post(API_URL, {
        title, 
        price: Number(price),
        price_sale: Number(priceSale) || Number(price),
        quantity: Number(quantity),
        image
    }, {
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        document.getElementById("productTitle").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productPriceSale").value = "";
        document.getElementById("productQuantity").value = "";
        document.getElementById("productImage").value = "";
        fetchProducts(); // Cập nhật danh sách
        bootstrap.Modal.getInstance(document.getElementById("createProductModal")).hide(); // Đóng modal
    })
    .catch(error => {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Lỗi khi thêm sản phẩm! Kiểm tra console để biết chi tiết.");
    });
}

// Mở modal chỉnh sửa sản phẩm
function updateProduct(id) {
    axios.get(`${API_URL}/${id}`)
        .then(response => {
            const product = response.data;
            if (!product) {
                alert("Không tìm thấy sản phẩm!");
                return;
            }

            document.getElementById("editProductId").value = id;
            document.getElementById("editProductTitle").value = product.title;
            document.getElementById("editProductPrice").value = product.price;
            document.getElementById("editProductPriceSale").value = product.price_sale;
            document.getElementById("editProductQuantity").value = product.quantity;
            document.getElementById("editProductImage").value = product.image;

            new bootstrap.Modal(document.getElementById("editProductModal")).show();
        })
        .catch(error => {
            console.error(`Lỗi khi lấy sản phẩm ${id}:`, error);
            alert("Lỗi khi tải dữ liệu sản phẩm!");
        });
}

// Lưu chỉnh sửa sản phẩm
function saveUpdatedProduct() {
    const id = document.getElementById("editProductId").value;
    const newTitle = document.getElementById("editProductTitle").value.trim();
    const newPrice = document.getElementById("editProductPrice").value;
    const newPriceSale = document.getElementById("editProductPriceSale").value;
    const newQuantity = document.getElementById("editProductQuantity").value;
    const newImage = document.getElementById("editProductImage").value;

    if (!id || !newTitle || !newPrice || !newQuantity) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    axios.put(`${API_URL}/${id}`, {
        title: newTitle,
        price: Number(newPrice),
        price_sale: Number(newPriceSale) || Number(newPrice),
        quantity: Number(newQuantity),
        image: newImage
    })
    .then(() => {
        fetchProducts();
        bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();
    })
    .catch(error => console.error(`Lỗi khi cập nhật sản phẩm ${id}:`, error));
}

// Xóa sản phẩm
function deleteProduct(id) {
    if (!id) {
        console.error("Không có ID sản phẩm để xóa!");
        return;
    }
    
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    axios.delete(`${API_URL}/${id}`)
    .then(() => fetchProducts())
    .catch(error => {
        console.error(`Lỗi khi xóa sản phẩm ${id}:`, error);
        alert("Lỗi khi xóa sản phẩm! Kiểm tra console để biết chi tiết.");
    });
}

// Gọi hàm hiển thị danh sách sản phẩm khi tải trang
document.addEventListener("DOMContentLoaded", fetchProducts);
