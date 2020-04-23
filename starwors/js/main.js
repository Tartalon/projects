$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true,
    dots: false,
    margin: 10,
    nav: true,
    navClass: [
      "slider__nav--left",
      "slider__nav--right",
    ] /* если задавать стрелки бекграундом (добавляем классы которые потом стилизируем). */,
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 2,
      },
      800: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });
});

// burger menu
document.querySelector(".nav__burger").addEventListener("click", function (e) {
  e.preventDefault();
  // this.classList.toggle("is-active");
  if (this.classList.contains("is-active")) {
    this.classList.remove("is-active");
    document.querySelector("#nav").classList.remove("nav-active");
    document.body.classList.remove("body-active", "no-scroll");
  } else {
    this.classList.add("is-active");
    document.querySelector("#nav").classList.add("nav-active");
    document.body.classList.add("body-active", "no-scroll");
  }
});
