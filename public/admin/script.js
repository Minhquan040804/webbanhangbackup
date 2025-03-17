document.addEventListener('DOMContentLoaded', function() {
    // Khai báo các phần tử DOM
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const mainContent = document.querySelector('.main-content');
    const menuItems = document.querySelectorAll('.has-submenu');
    const iframe = document.getElementById('mainFrame');
    
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
            if (e.target.matches('.sidebar-menu-button') || 
                e.target.matches('.submenu-icon') ||
                e.target.parentElement.matches('.sidebar-menu-button')) {
                e.preventDefault();
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
    const defaultPage = "/views/admin/dashboard/index.html";
    let savedPage = sessionStorage.getItem("currentPage") || defaultPage;
    
    loadContent(savedPage);
    
    document.querySelectorAll(".sidebar-menu-button, .sidebar-submenu-button").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("data-page");
            if (page) {
                sessionStorage.setItem("currentPage", page);
                loadContent(page);
            }
        });
    });
});

function loadContent(page) {
    const iframe = document.getElementById("mainFrame");
    if (iframe) {
        iframe.src = page;
    } else {
        console.error("Không tìm thấy phần tử iframe để tải nội dung.");
    }
}
