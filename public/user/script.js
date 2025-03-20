$(document).ready(function() {
    $('.grid_sorting_button').on('click', function() {
        var filterValue = $(this).attr('data-filter');
        $('.grid_sorting_button').removeClass('active');
        $(this).addClass('active');
        $('.info-product').hide();
        $('.' + filterValue).show();
    });
});
