"use strict";

const dataBase = [];

const modalAdd = document.querySelector(".modal__add"),
  addAd = document.querySelector(".add__ad"),
  modalBtnSubmit = document.querySelector(".modal__btn-submit"),
  modalSubmit = document.querySelector(".modal__submit"),
  catalog = document.querySelector(".catalog"),
  modalItem = document.querySelector(".modal__item "),
  modalBtnWarning = document.querySelector('.modal__btn-warning');

// Get form elements without button in arr
const elementsModalSubmit = [...modalSubmit.elements]
  .filter(elem => elem.tagName !== "BUTTON" && elem.type !=='submit');
// console.log(
//   [...elementsModalSubmit].filter((elem) => {
//     return elem.tagName !== "BUTTON";
//   })
// );

// Function close modal

// const closeModal = (event) => {
//   const target = event.target;

//   if (
//     target.classList.contains("modal__close") ||
//     target === modalAdd ||
//     target === modalItem
//   ) {
//     modalAdd.classList.add("hide");
//     modalItem.classList.add("hide");
//     modalSubmit.reset();
//   }
// };

const closeModal = function (event) {
  const target = event.target;
  // console.log(this);

  if (target.classList.contains("modal__close") || target === this) {
    this.classList.add("hide");
    if (this === modalItem) {
      modalSubmit.reset();
    }
  }
};

// Function close modal on Escape
const closeModalEsc = (event) => {
  if (event.code === "Escape") {
    modalItem.classList.add("hide");
    modalAdd.classList.add("hide");
    document.removeEventListener("keydown", closeModalEsc);
  }
};

//Verification form on value
modalSubmit.addEventListener('input' , () => {
  const validForm = elementsModalSubmit.every(elem => elem.value);
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? "none" : '';
});

modalSubmit.addEventListener('submit', event => {
  event.preventDefault();

  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    // console.log(elem);
    itemObj[elem.name] = elem.value;
  }
  // console.log(itemObj);
  dataBase.push(itemObj);
  modalSubmit.reset();
  // console.log(dataBase);
});



// show modal add card
addAd.addEventListener("click", () => {
  modalAdd.classList.remove("hide");
  modalBtnSubmit.disabled = true;
  document.addEventListener("keydown", closeModalEsc);
});

modalAdd.addEventListener("click", closeModal);
modalItem.addEventListener("click", closeModal);

catalog.addEventListener("click", (event) => {
  const target = event.target;

  if (target.closest(".card")) {
    modalItem.classList.remove("hide");
    document.addEventListener("keydown", closeModalEsc);
  }
});

