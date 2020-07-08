'use strict';

const modalAdd = document.querySelector('.modal__add'),
  addAd = document.querySelector('.add__ad'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  catalog = document.querySelector('.catalog'),
  modalItem = document.querySelector('.modal__item ');


// show modal add card
addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
});


modalAdd.addEventListener('click', event => {
  // console.log(event);
  const target = event.target;

  if (target.classList.contains('modal__close') || target === modalAdd) {
    modalAdd.classList.add('hide');
    modalSubmit.reset();
  }
});

catalog.addEventListener('click', event => {
  const target = event.target.closest('.card');

  if (target) {
    modalItem.classList.remove('hide');
    console.log('okk');
  }
});

document.addEventListener('keydown', event => {
  // console.log(event);
  if (event.keyCode == 27) {
    console.log('ok');
    modalItem.classList.add('hide');
  }
  // console.log(target);
});