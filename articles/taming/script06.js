$(document).ready(function () {

  $(".accordion, .no-style-button").click(function () {
    $(this).toggleClass("is-active");
    $(this).next(".panel").slideToggle("fast");
    updateIcons();
  });

  $('#toggle-all').click(function () {
    if ($('.panel').first().is(':visible')) {
      $('.panel').slideUp();
      $('.accordion, .no-style-button').removeClass('is-active');
      $(this).text('全て広げるor閉じる');
    } else {
      $('.panel').slideDown();
      $('.accordion, .no-style-button').addClass('is-active');
      $(this).text('全て広げるor閉じる');
    }
    updateIcons();
  });

  function updateIcons() {
    $(".accordion, .no-style-button").each(function () {
      if ($(this).hasClass("is-active")) {
        $(this).find(".i_box").addClass("is-active");
      } else {
        $(this).find(".i_box").removeClass("is-active");
      }
    });
  }

  updateIcons();
});
