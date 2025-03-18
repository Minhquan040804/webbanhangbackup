// URL của API dựa trên cấu hình server
const API_URL = "http://localhost:3000/news";

// Hàm lấy danh sách tin tức từ API và hiển thị
async function fetchNews() {
  try {
    const response = await axios.get(API_URL);
    const newsList = response.data;
    const newsTableBody = document.getElementById("newsList");
    newsTableBody.innerHTML = ""; // Xóa dữ liệu cũ

    newsList.forEach((news, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${news.title}</td>
          <td>${news.alias}</td>
          <td>${news.description ? news.description.substring(0, 50) + "..." : ""}</td>
          <td>${new Date(news.created_at).toLocaleDateString("vi-VN")}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editNews('${news._id}')">Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteNews('${news._id}')">Xóa</button>
          </td>
        </tr>
      `;
      newsTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tin tức:", error);
    alert("Không thể tải danh sách tin tức!");
  }
}

// Hàm thêm tin tức mới
async function addNews() {
  const title = document.getElementById("newsTitle").value;
  const alias = document.getElementById("newsAlias").value;
  const description = document.getElementById("newsDescription").value;
  const detail = document.getElementById("newsDetail").value;
  const image = document.getElementById("newsImage").value;

  if (!title || !alias) {
    alert("Vui lòng điền tiêu đề và alias!");
    return;
  }

  try {
    await axios.post(API_URL, { title, alias, description, detail, image });
    alert("Thêm tin tức thành công!");
    document.getElementById("newsTitle").value = "";
    document.getElementById("newsAlias").value = "";
    document.getElementById("newsDescription").value = "";
    document.getElementById("newsDetail").value = "";
    document.getElementById("newsImage").value = "";
    bootstrap.Modal.getInstance(document.getElementById("createNewsModal")).hide();
    fetchNews(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi thêm tin tức:", error);
    alert("Không thể thêm tin tức!");
  }
}

// Hàm hiển thị modal chỉnh sửa
async function editNews(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const news = response.data;

    document.getElementById("editNewsId").value = news._id;
    document.getElementById("editNewsTitle").value = news.title;
    document.getElementById("editNewsAlias").value = news.alias;
    document.getElementById("editNewsDescription").value = news.description || "";
    document.getElementById("editNewsDetail").value = news.detail || "";
    document.getElementById("editNewsImage").value = news.image || "";

    const modal = new bootstrap.Modal(document.getElementById("editNewsModal"));
    modal.show();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tin tức:", error);
    alert("Không thể tải thông tin tin tức!");
  }
}

// Hàm lưu tin tức đã chỉnh sửa
async function saveUpdatedNews() {
  const id = document.getElementById("editNewsId").value;
  const title = document.getElementById("editNewsTitle").value;
  const alias = document.getElementById("editNewsAlias").value;
  const description = document.getElementById("editNewsDescription").value;
  const detail = document.getElementById("editNewsDetail").value;
  const image = document.getElementById("editNewsImage").value;

  if (!title || !alias) {
    alert("Vui lòng điền tiêu đề và alias!");
    return;
  }

  try {
    await axios.put(`${API_URL}/${id}`, { title, alias, description, detail, image });
    alert("Cập nhật tin tức thành công!");
    bootstrap.Modal.getInstance(document.getElementById("editNewsModal")).hide();
    fetchNews(); // Cập nhật danh sách
  } catch (error) {
    console.error("Lỗi khi cập nhật tin tức:", error);
    alert("Không thể cập nhật tin tức!");
  }
}

// Hàm xóa tin tức
async function deleteNews(id) {
  if (confirm("Bạn có chắc chắn muốn xóa tin tức này?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Xóa tin tức thành công!");
      fetchNews(); // Cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error);
      alert("Không thể xóa tin tức!");
    }
  }
}

// Gọi hàm fetchNews khi trang được tải
document.addEventListener("DOMContentLoaded", fetchNews);