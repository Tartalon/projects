const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
let body = document.querySelector('#body');

cartButton.onclick = function () {
  modal.classList.add('is-open');
  body.classList.add('scroll');
}
close.onclick = function () {
  modal.classList.remove('is-open');
  body.classList.remove('scroll');
}
window.onclick = function (e) {
  if(e.target == modal) {
    modal.classList.remove('is-open');
    body.classList.remove('scroll');
  }
}

new WOW().init();