const API_URL = "http://localhost:3000/product-categories";

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

// Lấy danh sách danh mục và hiển thị lên giao diện
function fetchCategories() {
    axios.get(API_URL)
        .then(response => {
            const categories = response.data;
            const categoryList = document.getElementById("categoryList");
            categoryList.innerHTML = ""; // Xóa danh mục cũ trước khi cập nhật mới

            categories.forEach((cat, index) => {
                // Lấy ID từ dữ liệu (nếu _id là đối tượng chứa $oid)
                const categoryId = cat._id?.$oid || cat._id;
                if (!categoryId) {
                    console.error("Không tìm thấy ID cho danh mục:", cat);
                    return;
                }
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${cat.name}</td>
                    <td>${cat.alias || ''}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateCategory('${categoryId}')">Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCategory('${categoryId}')">Xóa</button>
                    </td>
                `;
                categoryList.appendChild(tr);
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh mục:", error));
}

// Thêm danh mục mới (alias tự động tạo từ name nếu không nhập)
function addCategory() {
    const categoryName = document.getElementById("categoryName").value.trim();
    
    if (!categoryName) {
        alert("Vui lòng nhập tên danh mục!");
        return;
    }

    const categoryAlias = slugify(categoryName);

    axios.post(API_URL, { name: categoryName, alias: categoryAlias }, {
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        document.getElementById("categoryName").value = ""; // Xóa nội dung input
        fetchCategories(); // Cập nhật danh sách danh mục
        bootstrap.Modal.getInstance(document.getElementById("createCategoryModal")).hide(); // Đóng modal
    })
    .catch(error => {
        console.error("Lỗi khi thêm danh mục:", error);
        alert("Lỗi khi thêm danh mục! Kiểm tra console để biết chi tiết.");
    });
}

function handleEnterAdd(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Ngăn hành động mặc định
        addCategory();          // Gọi hàm thêm danh mục
    }
}

// Cập nhật danh mục (alias tự động tạo từ newName nếu để trống)
function updateCategory(id) {
    if (!id) {
        console.error("Không có ID danh mục để cập nhật!");
        return;
    }

    // Lấy thông tin danh mục hiện tại từ bảng
    axios.get(`${API_URL}/${id}`)
        .then(response => {
            const category = response.data;
            if (!category) {
                alert("Không tìm thấy danh mục!");
                return;
            }

            // Hiển thị dữ liệu trong modal
            document.getElementById("editCategoryId").value = id;
            document.getElementById("editCategoryName").value = category.name;

            // Mở modal chỉnh sửa
            new bootstrap.Modal(document.getElementById("editCategoryModal")).show();
        })
        .catch(error => {
            console.error(`Lỗi khi lấy danh mục ${id}:`, error);
            alert("Lỗi khi tải dữ liệu danh mục!");
        });
}

// Lưu chỉnh sửa danh mục
function saveUpdatedCategory() {
    const id = document.getElementById("editCategoryId").value;
    const newName = document.getElementById("editCategoryName").value.trim();

    if (!id) {
        console.error("Không có ID danh mục để cập nhật!");
        return;
    }

    if (!newName) {
        alert("Vui lòng nhập tên danh mục!");
        return;
    }

    const newAlias = slugify(newName);

    axios.put(`${API_URL}/${id}`, { name: newName, alias: newAlias })
        .then(() => {
            fetchCategories(); // Load lại danh sách
            bootstrap.Modal.getInstance(document.getElementById("editCategoryModal")).hide(); // Đóng modal
        })
        .catch(error => console.error(`Lỗi khi cập nhật danh mục ${id}:`, error));
}

function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Ngăn hành động mặc định
        saveUpdatedCategory();  // Gọi hàm lưu danh mục
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Focus vào ô input khi mở modal "Thêm danh mục"
    var createCategoryModal = document.getElementById("createCategoryModal");
    if (createCategoryModal) {
        createCategoryModal.addEventListener("shown.bs.modal", function () {
            document.getElementById("categoryName").focus();
        });
    }

    // Focus vào ô input khi mở modal "Chỉnh sửa danh mục"
    var editCategoryModal = document.getElementById("editCategoryModal");
    if (editCategoryModal) {
        editCategoryModal.addEventListener("shown.bs.modal", function () {
            document.getElementById("editCategoryName").focus();
        });
    }
});

// Xóa danh mục
function deleteCategory(id) {
    if (!id) {
        console.error("Không có ID danh mục để xóa!");
        return;
    }
    
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    axios.delete(`${API_URL}/${id}`)
    .then(() => fetchCategories())
    .catch(error => {
        console.error(`Lỗi khi xóa danh mục ${id}:`, error);
        alert("Lỗi khi xóa danh mục! Kiểm tra console để biết chi tiết.");
    });
}

// Gọi hàm để hiển thị danh mục khi tải trang
document.addEventListener("DOMContentLoaded", fetchCategories);
