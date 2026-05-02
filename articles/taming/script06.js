$(document).ready(function () {
  var currentImageIndex = 0;
  var images = $(".step-image");
  var isAccordionOpen = false;
  var isAllOpen = false;

  function showCurrentImage() {
    images.addClass("hidden");
    if (isAccordionOpen && images.length > 0) {
      images.eq(currentImageIndex).removeClass("hidden");
    }
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showCurrentImage();
  }

  $(".accordion").eq(1).click(function () {
    isAccordionOpen = !isAccordionOpen;
    if (isAccordionOpen) {
      nextImage();
    } else {
      images.addClass("hidden");
    }
  });

  $(".accordion, .no-style-button").click(function () {
    $(this).toggleClass("is-active");
    $(this).next(".panel").slideToggle("fast");
    updateIcons();
  });

  $('#toggle-all').click(function () {
    if (isAllOpen) {
      $('.panel').slideUp();
      $('.accordion, .no-style-button').removeClass('is-active');
      $(this).text('広げる');
      isAccordionOpen = false;
      images.addClass("hidden");
    } else {
      $('.panel').slideDown();
      $('.accordion, .no-style-button').addClass('is-active');
      $(this).text('折り畳む');
      isAccordionOpen = true;
      nextImage();
    }
    isAllOpen = !isAllOpen;
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
  showCurrentImage();
});
