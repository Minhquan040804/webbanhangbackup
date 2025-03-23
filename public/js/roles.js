// URL của API
const ROLE_API_URL = "http://localhost:3000/api/roles";
const ACCOUNT_API_URL = "http://localhost:3000/api/accounts";

// Hàm lấy danh sách vai trò từ API và hiển thị
async function fetchRoles() {
  try {
    const response = await axios.get(ROLE_API_URL);
    const roleList = response.data;
    const roleTableBody = document.getElementById("roleList");
    roleTableBody.innerHTML = ""; // Xóa dữ liệu cũ

    for (const [index, role] of roleList.entries()) {
      // Đếm số tài khoản liên kết với vai trò này
      const accountResponse = await axios.get(`${ACCOUNT_API_URL}?role_id=${role._id}`);
      const accountCount = accountResponse.data.length;

      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${role.name}</td>
          <td>${accountCount}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editRole('${role._id}')">Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRole('${role._id}', ${accountCount})">Xóa</button>
          </td>
        </tr>
      `;
      roleTableBody.innerHTML += row;
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vai trò:", error);
    alert("Không thể tải danh sách vai trò!");
  }
}

// Hàm thêm vai trò mới
async function addRole() {
  const name = document.getElementById("roleName").value;

  if (!name) {
    alert("Vui lòng điền tên vai trò!");
    return;
  }

  try {
    await axios.post(ROLE_API_URL, { name });
    alert("Thêm vai trò thành công!");
    document.getElementById("roleName").value = "";
    bootstrap.Modal.getInstance(document.getElementById("createRoleModal")).hide();
    fetchRoles(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi thêm vai trò:", error);
    alert(error.response?.data?.message || "Không thể thêm vai trò!");
  }
}

// Hàm hiển thị modal chỉnh sửa
async function editRole(id) {
  try {
    const response = await axios.get(`${ROLE_API_URL}/${id}`);
    const role = response.data;

    document.getElementById("editRoleId").value = role._id;
    document.getElementById("editRoleName").value = role.name;

    const modal = new bootstrap.Modal(document.getElementById("editRoleModal"));
    modal.show();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin vai trò:", error);
    alert("Không thể tải thông tin vai trò!");
  }
}

// Hàm lưu vai trò đã chỉnh sửa
async function saveUpdatedRole() {
  const id = document.getElementById("editRoleId").value;
  const name = document.getElementById("editRoleName").value;

  if (!name) {
    alert("Vui lòng điền tên vai trò!");
    return;
  }

  try {
    await axios.put(`${ROLE_API_URL}/${id}`, { name });
    alert("Cập nhật vai trò thành công!");
    bootstrap.Modal.getInstance(document.getElementById("editRoleModal")).hide();
    fetchRoles(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi cập nhật vai trò:", error);
    alert(error.response?.data?.message || "Không thể cập nhật vai trò!");
  }
}

// Hàm xóa vai trò với kiểm tra liên kết tài khoản
async function deleteRole(id, accountCount) {
  if (accountCount > 0) {
    const confirmDelete = confirm(`Vai trò này đang được sử dụng bởi ${accountCount} tài khoản. Bạn có chắc chắn muốn xóa? (Các tài khoản liên quan sẽ không bị xóa nhưng sẽ mất vai trò)`);
    if (!confirmDelete) return;
  } else {
    if (!confirm("Bạn có chắc chắn muốn xóa vai trò này?")) return;
  }

  try {
    await axios.delete(`${ROLE_API_URL}/${id}`);
    alert("Xóa vai trò thành công!");
    fetchRoles(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi xóa vai trò:", error);
    alert(error.response?.data?.message || "Không thể xóa vai trò!");
  }
}

// Gọi hàm fetchRoles khi trang được tải
document.addEventListener("DOMContentLoaded", fetchRoles);