$(document).ready(function() {
    $('.grid_sorting_button').on('click', function() {
        var filterValue = $(this).attr('data-filter');
        $('.grid_sorting_button').removeClass('active');
        $(this).addClass('active');
        $('.info-product').hide();
        $('.' + filterValue).show();
    });
});

    document.addEventListener("DOMContentLoaded", function () {
        const menuToggle = document.querySelector(".menu-toggle");
        const mobileMenu = document.querySelector(".mobile-menu");
        const closeMenu = document.querySelector(".close-menu");

        // Khi click vào menu toggle (3 gạch ngang)
        menuToggle.addEventListener("click", function () {
            mobileMenu.classList.add("active"); // Hiện menu từ trái
        });

        // Khi click vào nút đóng menu
        closeMenu.addEventListener("click", function () {
            mobileMenu.classList.remove("active"); // Ẩn menu về trái
        });

        // Click bên ngoài menu để đóng
        document.addEventListener("click", function (event) {
            if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileMenu.classList.remove("active");
            }
        });
    });
