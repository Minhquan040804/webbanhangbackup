const API_BASE_URL = "http://localhost:3000/api/orders";

// Lấy danh sách đơn hàng
function fetchOrders() {
  axios.get(API_BASE_URL)
    .then(response => {
      const orders = response.data;
      const orderList = document.getElementById("orderList");
      orderList.innerHTML = "";

      orders.forEach((order, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${order.orderId}</td>
          <td>${order.total_price.toLocaleString('vi-VN')} VNĐ</td>
          <td>${order.status}</td>
          <td>${order.type_payment}</td>
          <td>${new Date(order.created_at).toLocaleString('vi-VN')}</td>
          <td>
            <button class="btn btn-info btn-sm" onclick="showOrderDetail('${order._id}')">Chi tiết</button>
            <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order._id}')">Xóa</button>
          </td>
        `;
        orderList.appendChild(tr);
      });
    })
    .catch(error => console.error("Lỗi khi tải danh sách đơn hàng:", error));
}

// Hiển thị chi tiết đơn hàng
function showOrderDetail(orderId) {
  axios.get(`${API_BASE_URL}/${orderId}`)
    .then(response => {
      const order = response.data;
      const content = document.getElementById("orderDetailContent");
      content.innerHTML = `
        <p><strong>Mã đơn hàng:</strong> ${order.orderId}</p>
        <p><strong>Khách hàng:</strong> ${order.customer.full_name} (${order.customer.email})</p>
        <p><strong>Tổng tiền:</strong> ${order.total_price.toLocaleString('vi-VN')} VNĐ</p>
        <p><strong>Trạng thái:</strong> ${order.status}</p>
        <p><strong>Phương thức thanh toán:</strong> ${order.type_payment}</p>
        <p><strong>Ngày tạo:</strong> ${new Date(order.created_at).toLocaleString('vi-VN')}</p>
        <h6>Sản phẩm:</h6>
        <table class="table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            ${order.products.map(p => `
              <tr>
                <td>${p.title}</td>
                <td>${p.quantity}</td>
                <td>${p.unitPrice.toLocaleString('vi-VN')} VNĐ</td>
                <td>${p.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      new bootstrap.Modal(document.getElementById("orderDetailModal")).show();
    })
    .catch(error => {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      alert(error.response?.data?.message || "Lỗi khi lấy chi tiết đơn hàng!");
    });
}

// Xóa đơn hàng
function deleteOrder(orderId) {
  if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

  axios.delete(`${API_BASE_URL}/${orderId}`)
    .then(response => {
      alert(response.data.message);
      fetchOrders();
    })
    .catch(error => {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert(error.response?.data?.message || "Lỗi khi xóa đơn hàng!");
    });
}

// Tải danh sách đơn hàng khi trang được tải
document.addEventListener("DOMContentLoaded", fetchOrders);