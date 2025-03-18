// URL của API
const API_URL = "http://localhost:3000/orders";

// Hàm lấy danh sách đơn hàng từ API và hiển thị
async function fetchOrders() {
  try {
    const response = await axios.get(API_URL);
    const orderList = response.data;
    const orderTableBody = document.getElementById("orderList");
    orderTableBody.innerHTML = ""; // Xóa dữ liệu cũ

    orderList.forEach((order, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${order.orderId}</td>
          <td>${order.id_user}</td> <!-- Hiển thị ID khách hàng, có thể thay bằng tên nếu cần -->
          <td>${order.total_price.toLocaleString("vi-VN")} VNĐ</td>
          <td>${order.status}</td>
          <td>${new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editOrder('${order._id}')">Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order._id}')">Xóa</button>
          </td>
        </tr>
      `;
      orderTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    alert("Không thể tải danh sách đơn hàng!");
  }
}

// Hàm thêm trường sản phẩm mới trong modal tạo đơn hàng
function addProductField() {
  const productList = document.getElementById("productList");
  const newProduct = document.createElement("div");
  newProduct.className = "product-item mb-2";
  newProduct.innerHTML = `
    <input type="text" class="form-control mb-1 product-id" placeholder="ID sản phẩm">
    <input type="number" class="form-control product-quantity" placeholder="Số lượng" min="1">
    <button type="button" class="btn btn-sm btn-danger mt-1" onclick="this.parentElement.remove()">Xóa</button>
  `;
  productList.appendChild(newProduct);
}

// Hàm thêm đơn hàng mới
async function addOrder() {
  const userId = document.getElementById("orderUserId").value;
  const status = document.getElementById("orderStatus").value;
  const type_payment = document.getElementById("orderPaymentType").value;
  const productItems = document.querySelectorAll("#productList .product-item");

  if (!userId || !type_payment || productItems.length === 0) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const products = Array.from(productItems).map(item => ({
    productId: item.querySelector(".product-id").value,
    quantity: parseInt(item.querySelector(".product-quantity").value)
  }));

  try {
    await axios.post(API_URL, { id_user: userId, status, type_payment, products });
    alert("Thêm đơn hàng thành công!");
    document.getElementById("orderUserId").value = "";
    document.getElementById("orderPaymentType").value = "";
    document.getElementById("productList").innerHTML = `
      <div class="product-item mb-2">
        <input type="text" class="form-control mb-1 product-id" placeholder="ID sản phẩm">
        <input type="number" class="form-control product-quantity" placeholder="Số lượng" min="1">
      </div>
    `;
    bootstrap.Modal.getInstance(document.getElementById("createOrderModal")).hide();
    fetchOrders(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi thêm đơn hàng:", error);
    alert("Không thể thêm đơn hàng!");
  }
}

// Hàm thêm trường sản phẩm trong modal chỉnh sửa
function addEditProductField() {
  const productList = document.getElementById("editProductList");
  const newProduct = document.createElement("div");
  newProduct.className = "product-item mb-2";
  newProduct.innerHTML = `
    <input type="text" class="form-control mb-1 product-id" placeholder="ID sản phẩm">
    <input type="number" class="form-control product-quantity" placeholder="Số lượng" min="1">
    <button type="button" class="btn btn-sm btn-danger mt-1" onclick="this.parentElement.remove()">Xóa</button>
  `;
  productList.appendChild(newProduct);
}

// Hàm hiển thị modal chỉnh sửa
async function editOrder(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const order = response.data;

    document.getElementById("editOrderId").value = id;
    document.getElementById("editOrderStatus").value = order.status;
    document.getElementById("editOrderPaymentType").value = order.type_payment;

    const productList = document.getElementById("editProductList");
    productList.innerHTML = ""; // Xóa danh sách cũ
    order.products.forEach(product => {
      const productItem = document.createElement("div");
      productItem.className = "product-item mb-2";
      productItem.innerHTML = `
        <input type="text" class="form-control mb-1 product-id" value="${product.productId}" placeholder="ID sản phẩm">
        <input type="number" class="form-control product-quantity" value="${product.quantity}" placeholder="Số lượng" min="1">
        <button type="button" class="btn btn-sm btn-danger mt-1" onclick="this.parentElement.remove()">Xóa</button>
      `;
      productList.appendChild(productItem);
    });

    const modal = new bootstrap.Modal(document.getElementById("editOrderModal"));
    modal.show();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    alert("Không thể tải thông tin đơn hàng!");
  }
}

// Hàm lưu đơn hàng đã chỉnh sửa
async function saveUpdatedOrder() {
  const id = document.getElementById("editOrderId").value;
  const status = document.getElementById("editOrderStatus").value;
  const type_payment = document.getElementById("editOrderPaymentType").value;
  const productItems = document.querySelectorAll("#editProductList .product-item");

  if (!type_payment || productItems.length === 0) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const products = Array.from(productItems).map(item => ({
    productId: item.querySelector(".product-id").value,
    quantity: parseInt(item.querySelector(".product-quantity").value)
  }));

  try {
    await axios.put(`${API_URL}/${id}`, { status, type_payment, products });
    alert("Cập nhật đơn hàng thành công!");
    bootstrap.Modal.getInstance(document.getElementById("editOrderModal")).hide();
    fetchOrders(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    alert("Không thể cập nhật đơn hàng!");
  }
}

// Hàm xóa đơn hàng
async function deleteOrder(id) {
  if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Xóa đơn hàng thành công!");
      fetchOrders(); // Cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert("Không thể xóa đơn hàng!");
    }
  }
}

// Gọi hàm fetchOrders khi trang được tải
document.addEventListener("DOMContentLoaded", fetchOrders);