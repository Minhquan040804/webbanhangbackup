document.addEventListener('DOMContentLoaded', function() {
    // Khai báo các phần tử DOM
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const mainContent = document.querySelector('.main-content');
    const menuItems = document.querySelectorAll('.has-submenu');
    
    // Tạo overlay cho mobile
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Toggle sidebar trên desktop
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
      
      // Xử lý cho mobile
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
      }
    });
    
    // Đóng sidebar trên mobile
    sidebarClose.addEventListener('click', function() {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
    
    // Đóng sidebar khi click vào overlay
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
    
    // Toggle submenu
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Nếu click vào submenu icon hoặc menu button
        if (e.target.matches('.sidebar-menu-button') || 
            e.target.matches('.submenu-icon') ||
            e.target.parentElement.matches('.sidebar-menu-button')) {
          // Ngăn việc chuyển trang khi click vào menu có submenu
          e.preventDefault();
          // Toggle class để mở/đóng submenu
          this.classList.toggle('submenu-open');
        }
      });
    });
    
    // Responsive handler
    function handleResize() {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
      } else {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      }
    }
    
    // Xử lý khi thay đổi kích thước màn hình
    window.addEventListener('resize', handleResize);
    
    // Khởi tạo ban đầu
    handleResize();
  });

document.addEventListener("DOMContentLoaded", function () {
  loadContent("dashboard.html");

  document.querySelectorAll(".sidebar-menu-button, .sidebar-submenu-button").forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const page = this.getAttribute("data-page");
      if (page) {
        loadContent(page);
      }
    });
  });
});

function loadContent(page) {
  fetch(page)
    .then(response => response.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
    })
    .catch(error => console.error("Lỗi khi tải nội dung:", error));
}
