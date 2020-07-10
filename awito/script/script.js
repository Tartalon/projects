"use strict";

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

const modalAdd = document.querySelector(".modal__add"),
  addAd = document.querySelector(".add__ad"),
  modalBtnSubmit = document.querySelector(".modal__btn-submit"),
  modalSubmit = document.querySelector(".modal__submit"),
  catalog = document.querySelector(".catalog"),
  modalItem = document.querySelector(".modal__item "),
  modalBtnWarning = document.querySelector(".modal__btn-warning"),
  modalFileInput = document.querySelector('.modal__file-input'),
  modalFileBtn = document.querySelector('.modal__file-btn'),
  modalImageAdd = document.querySelector('.modal__image-add');

// Get form elements without button in arr
const elementsModalSubmit = [...modalSubmit.elements].filter(
  (elem) => elem.tagName !== "BUTTON" && elem.type !== "submit"
);
// console.log(
//   [...elementsModalSubmit].filter((elem) => {
//     return elem.tagName !== "BUTTON";
//   })
// );


const infoPhoto = {};

//Localstorage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

const checkForm = () => {
  const validForm = elementsModalSubmit.every((elem) => elem.value);
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? "none" : "";
};

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

//Function close modal
const closeModal = function (event) {
  const target = event.target;
  // console.log(this);
  // console.log(target);

  if (
    target.closest(".modal__close") ||
    target.classList.contains("modal") ||
    event.code === "Escape"
  ) {
    modalAdd.classList.add("hide");
    modalItem.classList.add("hide");
    document.removeEventListener("keydown", closeModal);
    modalSubmit.reset();
    checkForm();
  }
};

//Change file name on button addPhoto
modalFileInput.addEventListener('change', (event) => {
  const target = event.target;

  const reader = new FileReader();

  // console.log(target.files[0]);
  const file = target.files[0];
  infoPhoto.filename = file.name;
  infoPhoto.size = file.size;

  reader.readAsBinaryString(file);

  reader.addEventListener('load', event => {
    if (infoPhoto.size < 200000) {
      modalFileBtn.textContent = infoPhoto.filename;
      infoPhoto.base64 = btoa(event.target.result);
      console.log(infoPhoto);
      modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
    } else {
      modalFileBtn.textContent = 'размер файла привішает 200Кб';
    }
  });

  console.log(infoPhoto);
});

//Verification form on value
modalSubmit.addEventListener("input", checkForm);

modalSubmit.addEventListener("submit", (event) => {
  event.preventDefault();

  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    // console.log(elem);
    itemObj[elem.name] = elem.value;
  }
  // console.log(itemObj);
  dataBase.push(itemObj);
  // console.log(dataBase);
  closeModal({ target: modalAdd });
  saveDB();
});

// show modal
addAd.addEventListener("click", () => {
  modalAdd.classList.remove("hide");
  modalBtnSubmit.disabled = true;
  document.addEventListener("keydown", closeModal);
});

catalog.addEventListener("click", (event) => {
  const target = event.target;

  if (target.closest(".card")) {
    modalItem.classList.remove("hide");
    document.addEventListener("keydown", closeModal);
  }
});

//Clos modal
modalAdd.addEventListener("click", closeModal);
modalItem.addEventListener("click", closeModal);
