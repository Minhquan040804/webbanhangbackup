const API_PRODUCTS = "http://localhost:3000/products";
const API_CATEGORIES = "http://localhost:3000/product-categories";

// Lưu danh mục sản phẩm để tham chiếu
let categoriesMap = {};

// Lấy danh sách danh mục sản phẩm
function fetchCategories() {
    axios.get(API_CATEGORIES)
        .then(response => {
            response.data.forEach(category => {
                categoriesMap[category._id.$oid || category._id] = category.name;
            });
            fetchProducts(); // Sau khi lấy danh mục xong, lấy danh sách sản phẩm
        })
        .catch(error => console.error("Lỗi khi tải danh mục:", error));
}

// Lấy danh sách sản phẩm và hiển thị
function fetchProducts() {
    axios.get(API_PRODUCTS)
        .then(response => {
            const products = response.data;
            const productList = document.getElementById("productList");
            productList.innerHTML = "";

            products.forEach((product, index) => {
                const productId = product._id?.$oid || product._id;
                const categoryId = product.product_categoryId?.$oid || product.product_categoryId;
                const categoryName = categoriesMap[categoryId] || "Không xác định";
                const createdAt = new Date(product.created_at?.$date || product.created_at).toLocaleString();

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.productId || "N/A"}</td>
                    <td><img src="${product.image}" alt="Ảnh" width="50" height="50"></td>
                    <td>${product.title}</td>
                    <td>${categoryName}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price.toLocaleString()} đ</td>
                    <td>${product.price_sale.toLocaleString()} đ</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateProduct('${productId}')">Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${productId}')">Xóa</button>
                    </td>
                `;
                productList.appendChild(tr);
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
}

// Hàm chuyển đổi text thành slug (alias)
function slugify(text) {
    return text.toString()
        // Tách dấu ra khỏi ký tự (normalize về dạng NFD)
        .normalize('NFD')
        // Loại bỏ các dấu (Unicode combining marks)
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '-')        // Thay thế khoảng trắng thành dấu gạch ngang
        .replace(/[^\w\-]+/g, '')     // Loại bỏ các ký tự không phải chữ, số, gạch ngang
        .replace(/\-\-+/g, '-')       // Thay thế nhiều dấu gạch ngang thành một dấu
        .replace(/^-+/, '')           // Xóa dấu gạch ngang ở đầu
        .replace(/-+$/, '');          // Xóa dấu gạch ngang ở cuối
}

// Thêm sản phẩm mới
function addProduct() {
    const title = document.getElementById("productTitle").value.trim();
    const price = document.getElementById("productPrice").value;
    const priceSale = document.getElementById("productPriceSale").value;
    const quantity = document.getElementById("productQuantity").value;
    const image = document.getElementById("productImage").value;
    const categoryId = document.getElementById("productCategory").value; // ID danh mục sản phẩm

    if (!title || !price || !quantity || !categoryId) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const alias = createAlias(title);
    const createdAt = new Date().toISOString();

    axios.post(API_PRODUCTS, {
        title, 
        alias,
        price: Number(price),
        price_sale: Number(priceSale) || Number(price),
        quantity: Number(quantity),
        image,
        product_categoryId: categoryId,
        created_at: { $date: createdAt }
    }, {
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        document.getElementById("productForm").reset();
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
    axios.get(`${API_PRODUCTS}/${id}`)
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
            document.getElementById("editProductAlias").value = product.alias;
            document.getElementById("editProductDescription").value = product.description || "";
            document.getElementById("editProductDetail").value = product.detail || "";
            document.getElementById("editProductProductId").value = product.productId || "";

            // Hiển thị danh sách danh mục có thể chọn
            const categorySelect = document.getElementById("editProductCategory");
            categorySelect.innerHTML = ""; // Xóa danh sách cũ
            for (const key in categoriesMap) {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = categoriesMap[key];
                if (key === (product.product_categoryId.$oid || product.product_categoryId)) {
                    option.selected = true;
                }
                categorySelect.appendChild(option);
            }

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
    const newAlias = document.getElementById("editProductAlias").value.trim();
    const newDescription = document.getElementById("editProductDescription").value.trim();
    const newDetail = document.getElementById("editProductDetail").value.trim();
    const newProductId = document.getElementById("editProductProductId").value.trim();
    const newCategoryId = document.getElementById("editProductCategory").value;

    if (!id || !newTitle ) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    axios.put(`${API_PRODUCTS}/${id}`, {
        productId: newProductId,
        title: newTitle,
        alias: newAlias,
        price: Number(newPrice),
        price_sale: Number(newPriceSale) || Number(newPrice),
        quantity: Number(newQuantity),
        image: newImage,
        description: newDescription,
        detail: newDetail,
        product_categoryId: newCategoryId
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

    axios.delete(`${API_PRODUCTS}/${id}`)
    .then(() => fetchProducts())
    .catch(error => {
        console.error(`Lỗi khi xóa sản phẩm ${id}:`, error);
        alert("Lỗi khi xóa sản phẩm! Kiểm tra console để biết chi tiết.");
    });
}

// Gọi hàm hiển thị danh sách sản phẩm khi tải trang
document.addEventListener("DOMContentLoaded", fetchCategories);
