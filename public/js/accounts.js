// URL của API
const ACCOUNT_API_URL = "http://localhost:3000/accounts";
const ROLE_API_URL = "http://localhost:3000/roles";

// Hàm lấy danh sách vai trò để điền vào select
async function fetchRolesForSelect(selectElement) {
  try {
    const response = await axios.get(ROLE_API_URL);
    const roles = response.data;
    selectElement.innerHTML = selectElement.id === "filterRoleId" ? '<option value="">Tất cả</option>' : '<option value="">Chọn vai trò</option>';
    roles.forEach(role => {
      const option = document.createElement("option");
      option.value = role._id;
      option.textContent = role.name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vai trò:", error);
  }
}

// Hàm lấy danh sách tài khoản từ API và hiển thị (có lọc theo role_id)
async function fetchAccounts() {
  try {
    const roleId = document.getElementById("filterRoleId").value;
    const url = roleId ? `${ACCOUNT_API_URL}?role_id=${roleId}` : ACCOUNT_API_URL;
    const response = await axios.get(url);
    const accountList = response.data;
    const accountTableBody = document.getElementById("accountList");
    accountTableBody.innerHTML = ""; // Xóa dữ liệu cũ

    const rolesResponse = await axios.get(ROLE_API_URL);
    const roles = rolesResponse.data;
    const roleMap = new Map(roles.map(role => [role._id.toString(), role.name]));

    accountList.forEach((account, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${account.username}</td>
          <td>${roleMap.get(account.role_id.toString()) || "Không xác định"}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editUser('${account._id}')">Cập nhật thông tin</button>
            <button class="btn btn-danger btn-sm" onclick="deleteAccount('${account._id}')">Xóa tài khoản</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${account._id}')">Xóa thông tin</button>
          </td>
        </tr>
      `;
      accountTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error);
    alert("Không thể tải danh sách tài khoản!");
  }
}

// Hàm thêm tài khoản mới
async function addAccount() {
  const username = document.getElementById("accountUsername").value;
  const password = document.getElementById("accountPassword").value;
  const role_id = document.getElementById("accountRoleId").value;

  if (!username || !password || !role_id) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    await axios.post(ACCOUNT_API_URL, { username, password, role_id });
    alert("Thêm tài khoản thành công!");
    document.getElementById("accountUsername").value = "";
    document.getElementById("accountPassword").value = "";
    document.getElementById("accountRoleId").value = "";
    bootstrap.Modal.getInstance(document.getElementById("createAccountModal")).hide();
    fetchAccounts(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi thêm tài khoản:", error);
    alert(error.response?.data?.message || "Không thể thêm tài khoản!");
  }
}

// Hàm hiển thị modal cập nhật thông tin người dùng
async function editUser(accountId) {
  try {
    const response = await axios.get(`${ACCOUNT_API_URL}/${accountId}/user`);
    const user = response.data;

    document.getElementById("editAccountId").value = accountId;
    document.getElementById("editFullName").value = user.full_name || "";
    document.getElementById("editEmail").value = user.email || "";
    document.getElementById("editPhone").value = user.phone || "";
    document.getElementById("editAddress").value = user.address || "";

    const modal = new bootstrap.Modal(document.getElementById("editUserModal"));
    modal.show();
  } catch (error) {
    if (error.response?.status === 404) {
      // Nếu chưa có thông tin người dùng, vẫn mở modal với các trường trống
      document.getElementById("editAccountId").value = accountId;
      document.getElementById("editFullName").value = "";
      document.getElementById("editEmail").value = "";
      document.getElementById("editPhone").value = "";
      document.getElementById("editAddress").value = "";
      const modal = new bootstrap.Modal(document.getElementById("editUserModal"));
      modal.show();
    } else {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      alert("Không thể tải thông tin người dùng!");
    }
  }
}

// Hàm lưu thông tin người dùng đã chỉnh sửa
async function saveUpdatedUser() {
  const account_id = document.getElementById("editAccountId").value;
  const full_name = document.getElementById("editFullName").value;
  const email = document.getElementById("editEmail").value;
  const phone = document.getElementById("editPhone").value;
  const address = document.getElementById("editAddress").value;

  try {
    await axios.put(`${ACCOUNT_API_URL}/${account_id}/user`, { full_name, email, phone, address });
    alert("Cập nhật thông tin người dùng thành công!");
    bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    alert(error.response?.data?.message || "Không thể cập nhật thông tin người dùng!");
  }
}

// Hàm xóa thông tin người dùng (không xóa tài khoản)
async function deleteUser(accountId) {
  if (confirm("Bạn có chắc chắn muốn xóa thông tin người dùng này? Tài khoản sẽ không bị ảnh hưởng.")) {
    try {
      await axios.delete(`${ACCOUNT_API_URL}/${accountId}/user`);
      alert("Xóa thông tin người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa thông tin người dùng:", error);
      alert(error.response?.data?.message || "Không thể xóa thông tin người dùng!");
    }
  }
}

// Hàm xóa tài khoản (xóa luôn thông tin người dùng)
async function deleteAccount(accountId) {
  if (confirm("Bạn có chắc chắn muốn xóa tài khoản này? Thông tin người dùng liên quan cũng sẽ bị xóa.")) {
    try {
      await axios.delete(`${ACCOUNT_API_URL}/${accountId}`);
      alert("Xóa tài khoản thành công!");
      fetchAccounts(); // Cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      alert(error.response?.data?.message || "Không thể xóa tài khoản!");
    }
  }
}

// Gọi hàm fetchAccounts và load vai trò khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  fetchAccounts();
  fetchRolesForSelect(document.getElementById("accountRoleId")); // Cho modal thêm tài khoản
  fetchRolesForSelect(document.getElementById("filterRoleId"));  // Cho bộ lọc
});