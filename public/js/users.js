const API_BASE_URL = "http://localhost:3000/api/accounts";

// Lấy danh sách người dùng
function fetchUsers() {
  axios.get(API_BASE_URL)
    .then(response => {
      const accounts = response.data;
      const userPromises = accounts.map(account =>
        axios.get(`${API_BASE_URL}/${account._id}/user`).catch(() => ({ data: null }))
      );

      Promise.all(userPromises)
        .then(userResponses => {
          const userList = document.getElementById("userList");
          userList.innerHTML = "";

          userResponses.forEach((userResponse, index) => {
            const account = accounts[index];
            const user = userResponse.data;
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${index + 1}</td>
              <td>${user?.full_name || "Chưa có"}</td>
              <td>${user?.email || "Chưa có"}</td>
              <td>${user?.phone || "Chưa có"}</td>
              <td>${user?.address || "Chưa có"}</td>
              <td>${account.username}</td>
              <td>
                <button class="btn btn-warning btn-sm" onclick="showUser('${account._id}')">Sửa</button>
                ${user ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${account._id}')">Xóa</button>` : ""}
              </td>
            `;
            userList.appendChild(tr);
          });
        })
        .catch(error => console.error("Lỗi khi tải danh sách người dùng:", error));
    })
    .catch(error => console.error("Lỗi khi tải danh sách tài khoản:", error));
}

// Hiển thị thông tin người dùng để chỉnh sửa
function showUser(accountId) {
  axios.get(`${API_BASE_URL}/${accountId}/user`)
    .then(response => {
      const user = response.data;
      document.getElementById("editAccountId").value = accountId;
      document.getElementById("userFullName").value = user.full_name || "";
      document.getElementById("userEmail").value = user.email || "";
      document.getElementById("userPhone").value = user.phone || "";
      document.getElementById("userAddress").value = user.address || "";
      new bootstrap.Modal(document.getElementById("editUserModal")).show();
    })
    .catch(error => {
      if (error.response?.status === 404) {
        // Nếu không tìm thấy user, mở modal với form trống
        document.getElementById("editAccountId").value = accountId;
        document.getElementById("userFullName").value = "";
        document.getElementById("userEmail").value = "";
        document.getElementById("userPhone").value = "";
        document.getElementById("userAddress").value = "";
        new bootstrap.Modal(document.getElementById("editUserModal")).show();
      } else {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        alert(error.response?.data?.message || "Lỗi khi lấy thông tin người dùng!");
      }
    });
}

// Cập nhật thông tin người dùng
function updateUser() {
  const accountId = document.getElementById("editAccountId").value;
  const fullName = document.getElementById("userFullName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const address = document.getElementById("userAddress").value.trim();

  axios.put(`${API_BASE_URL}/${accountId}/user`, {
    full_name: fullName,
    email,
    phone,
    address
  })
  .then(response => {
    alert(response.data.message);
    fetchUsers();
    bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
  })
  .catch(error => {
    console.error("Lỗi khi cập nhật người dùng:", error);
    alert(error.response?.data?.message || "Lỗi khi cập nhật người dùng!");
  });
}

// Xóa người dùng (không ảnh hưởng account)
function deleteUser(accountId) {
  if (!confirm("Bạn có chắc chắn muốn xóa thông tin người dùng này? Tài khoản liên quan sẽ không bị ảnh hưởng.")) return;

  axios.delete(`${API_BASE_URL}/${accountId}/user`)
    .then(response => {
      alert(response.data.message);
      fetchUsers();
    })
    .catch(error => {
      console.error("Lỗi khi xóa người dùng:", error);
      alert(error.response?.data?.message || "Lỗi khi xóa người dùng!");
    });
}

// Tải danh sách người dùng khi trang được tải
document.addEventListener("DOMContentLoaded", fetchUsers);