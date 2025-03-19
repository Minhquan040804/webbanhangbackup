const API_BASE_URL = "http://localhost:3000/accounts";
const ROLES_API_URL = "http://localhost:3000/roles";

let roleMap = {}; // Ánh xạ từ role_id sang tên vai trò

// Lấy danh sách vai trò và tạo map
function fetchRoles() {
  return axios.get(ROLES_API_URL)
    .then(response => {
      const roles = response.data;
      const roleSelect = document.getElementById("accountRole");
      roleSelect.innerHTML = '<option value="">Chọn vai trò</option>';

      roles.forEach(role => {
        // Tạo option cho select
        const option = document.createElement("option");
        option.value = role._id;
        option.textContent = role.name;
        roleSelect.appendChild(option);

        // Lưu vào roleMap
        roleMap[role._id] = role.name;
      });
    })
    .catch(error => console.error("Lỗi khi tải danh sách vai trò:", error));
}

// Lấy danh sách tài khoản
function fetchAccounts() {
  axios.get(API_BASE_URL)
    .then(response => {
      const accounts = response.data;
      const accountList = document.getElementById("accountList");
      accountList.innerHTML = "";

      accounts.forEach((account, index) => {
        const roleName = roleMap[account.role_id] || account.role_id; // Lấy tên vai trò, nếu không có thì giữ nguyên ID
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${account.username}</td>
          <td>${roleName}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteAccount('${account._id}')">Xóa</button>
          </td>
        `;
        accountList.appendChild(tr);
      });
    })
    .catch(error => console.error("Lỗi khi tải danh sách tài khoản:", error));
}

// Tạo tài khoản mới
function createAccount() {
  const username = document.getElementById("accountUsername").value.trim();
  const password = document.getElementById("accountPassword").value.trim();
  const roleId = document.getElementById("accountRole").value;

  if (!username || !password || !roleId) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
    return;
  }

  axios.post(API_BASE_URL, { username, password, role_id: roleId })
    .then(response => {
      alert(response.data.message);
      document.getElementById("accountForm").reset();
      fetchAccounts();
      bootstrap.Modal.getInstance(document.getElementById("createAccountModal")).hide();
    })
    .catch(error => {
      console.error("Lỗi khi tạo tài khoản:", error);
      alert(error.response?.data?.message || "Lỗi khi tạo tài khoản!");
    });
}

// Xóa tài khoản (xóa luôn user)
function deleteAccount(accountId) {
  if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này? Thông tin người dùng liên quan cũng sẽ bị xóa.")) return;

  axios.delete(`${API_BASE_URL}/${accountId}`)
    .then(response => {
      alert(response.data.message);
      fetchAccounts();
    })
    .catch(error => {
      console.error("Lỗi khi xóa tài khoản:", error);
      alert(error.response?.data?.message || "Lỗi khi xóa tài khoản!");
    });
}

// Tải dữ liệu khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  fetchRoles().then(() => fetchAccounts()); // Đảm bảo lấy roles trước khi lấy accounts
});