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
    const categoryName = document.getElementById("categoryName").value;
    
    if (!categoryName.trim()) {
        alert("Vui lòng nhập tên danh mục!");
        return;
    }

    // Tạo alias tự động từ tên
    const categoryAlias = slugify(categoryName);

    axios.post(API_URL, { name: categoryName, alias: categoryAlias }, {
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        document.getElementById("categoryName").value = "";
        fetchCategories();
    })
    .catch(error => {
        console.error("Lỗi khi thêm danh mục:", error);
        alert("Lỗi khi thêm danh mục! Kiểm tra console để biết chi tiết.");
    });
}

// Cập nhật danh mục (alias tự động tạo từ newName nếu để trống)
function updateCategory(id) {
    if (!id) {
        console.error("Không có ID danh mục để cập nhật!");
        return;
    }
    
    // Yêu cầu nhập tên mới
    const newName = prompt("Nhập tên mới:");
    if (!newName) return;
    
    // Tự động tạo alias từ newName mà không yêu cầu nhập từ người dùng
    const newAlias = slugify(newName);
    
    axios.put(`${API_URL}/${id}`, { name: newName, alias: newAlias }, {
        headers: { "Content-Type": "application/json" }
    })
    .then(() => fetchCategories())
    .catch(error => {
        console.error(`Lỗi khi cập nhật danh mục ${id}:`, error);
        alert("Lỗi khi cập nhật danh mục! Kiểm tra console để biết chi tiết.");
    });
}


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
