let slideIndex = 0;
const slidesWrapper = document.createElement("div"); // Tạo wrapper để chứa tất cả slides
const slides = document.querySelectorAll(".mySlides");
const totalSlides = slides.length;

// Bọc tất cả slide vào slidesWrapper
const slideshowContainer = document.querySelector(".slideshow-container");
slidesWrapper.classList.add("slides-wrapper");

slides.forEach(slide => slidesWrapper.appendChild(slide));
slideshowContainer.insertBefore(slidesWrapper, slideshowContainer.firstChild);

function showSlides() {
    slideIndex = (slideIndex + 1) % totalSlides;
    slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
}

// Chuyển ảnh tự động mỗi 3 giây
let slideInterval = setInterval(showSlides, 3000);

// Chuyển ảnh bằng nút prev/next
function plusSlides(n) {
    slideIndex = (slideIndex + n + totalSlides) % totalSlides;
    slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Reset lại thời gian tự động chuyển ảnh
    clearInterval(slideInterval);
    slideInterval = setInterval(showSlides, 3000);
}


document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeMenu = document.querySelector(".close-menu");
    const productLink = document.getElementById("product-link");
    const categorySubmenu = document.querySelector(".category-submenu");
    const closeSubmenu = document.querySelector(".close-submenu");

    // Hiển thị menu mobile
    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.add("active");
    });

    // Đóng menu mobile khi nhấn vào nút đóng
    closeMenu.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        categorySubmenu.classList.remove("active"); // Đóng luôn submenu
    });

    // Hiển thị submenu khi nhấn vào "SẢN PHẨM"
    productLink.addEventListener("click", function (event) {
        event.stopPropagation(); // Ngăn chặn sự kiện lan ra ngoài
        event.preventDefault(); // Ngăn tải lại trang
        categorySubmenu.classList.toggle("active");
    });

    // Đóng submenu khi nhấn vào nút đóng submenu
    if (closeSubmenu) {
        closeSubmenu.addEventListener("click", function (event) {
            event.stopPropagation(); // Ngăn chặn sự kiện lan ra ngoài
            categorySubmenu.classList.remove("active");
        });
    }

    // Click bên ngoài submenu để đóng chỉ submenu
    document.addEventListener("click", function (event) {
        if (
            categorySubmenu.classList.contains("active") &&
            !categorySubmenu.contains(event.target) &&
            event.target !== productLink
        ) {
            categorySubmenu.classList.remove("active");
            return; // Dừng lại, không tiếp tục đóng menu chính
        }

        // Nếu menu chính đang mở nhưng nhấn ngoài menu chính & submenu -> Đóng menu chính
        if (
            mobileMenu.classList.contains("active") &&
            !mobileMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            mobileMenu.classList.remove("active");
        }
    });
});

