// используем строгий режим
"use strict";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
//получаем кнопку ВОЙТИ со страницы
const buttonAuth = document.querySelector(".button-auth");
//получаем модальное окно входа
const modalAuth = document.querySelector(".modal-auth");
//получаем кновку закрытия модалки
const closeAuth = document.querySelector(".close-auth");
// получаем форму входа
const logInForm = document.querySelector("#logInForm");
//получаем input логин
const loginInput = document.querySelector("#login");
// получаем user name
const userName = document.querySelector(".user-name");
//получаем кнопку выхода usera
const buttonOut = document.querySelector(".button-out");
//получаем блок с карточками ресторанов
const cardsRestaurants = document.querySelector(".cards-restaurants");
// получаем весь блок promo
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

// создаем переменную login
let login = localStorage.getItem("gloDelivery");

//валидация формы. Регулярные выражения пишуться между слешами
const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

// функция запроса на сервер (json файлу) и получения данных. Асинхронная - значит что будем управлять задержкой (укажим avait - следующая строка не выполнется пока не закончим с этой) и выполнение данного кода не останавливает все остальное
const getData = async function (url) {
  // запрос на сервер при помощи апи фетч
  const response = await fetch(url);

  // обрабатываем полученное. В промисе есть значение ok. Его и проверим
  if (!response.ok) {
    // если респонс false то сбрасываем ошибку
    throw new Error(
      `Ошибка по адресу ${url}, статус ошибки ${response.status}!`
    );
  }

  //чтобы расшифровать данные полученные с сервера необходимо выполнить функцию json. await означает что нужно дождаться ответа с сервера
  //console.log(response.json());

  // возвращаем данные
  return await response.json(); // сначала выполняется json потом response и потом return. И теперь в getData попадет массив с сервера
};

// вызываем функцию и передаем туда url. Вызываем в конце перед обьявлениями событий
//console.log(getData("./db/partners.json"));

const toggleModal = function () {
  modal.classList.toggle("is-open");
};

// функция добавления класса .is-open
// если функцию вкинуть в переменную то ее нельзя вызвать до объявления данной функции
const toggleModalAuth = function () {
  modalAuth.classList.toggle("is-open");

  //при нажатии на submit бордеру значение по умолчанию
  loginInput.style.borderColor = "";
};

function returnMain() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
}

// функция если пользователь авторизован
function authorized() {
  console.log("Авторизован");

  //функция выхода
  function logOut() {
    login = null;

    //при выходе очищаем localStorage
    localStorage.removeItem("gloDelivery");

    //передавая пустую строку означает вернуть свойства прописанные в css
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnMain();
  }

  //если авторизован скрываем кнопку "войти"
  buttonAuth.style.display = "none";

  // записываем в userName имя введенное пользователем
  userName.textContent = login;

  //если авторизован показываем логин и кнопку выхода
  userName.style.display = "inline"; //inline т.к. <span>
  buttonOut.style.display = "block";

  // на кнопку выхода навешиваем событие при котором запуститься функция выхода
  buttonOut.addEventListener("click", logOut);
}

// функция не авторизован
function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    // event - объект. Отменяем перезагрузку страницы при клике на кнопку "войти" в форме
    event.preventDefault();

    //проверяем чтобы в инпуте что-то было. trim удаляет пробелы как вначале так и в конце
    if (valid(loginInput.value)) {
      loginInput.style.borderColor = "";
      //получаем значение с поля логин
      login = loginInput.value;
      //записываем в localStorage данные пользователя который вошол и не вышел, чтоб после перезагрузки страницы оставался авторизован
      localStorage.setItem("gloDelivery", login); // ключ - gloDelivery, значение с login
      //после авторизации закрываем окно с формой
      toggleModalAuth();
      //remove чтобы очищать событие после авторизации (события не навешиваются по несколько раз)
      // удаляем слушание события с toggleModalAuth
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      //удаляем слушатель событий (submit) на отправку данных
      logInForm.removeEventListener("submit", logIn);
      //сбрасываем все значения формы по умолчанию чтобы очистить поля ввода
      logInForm.reset();
      //вызываем проверку авторизации
      checkAuth();
    } else {
      loginInput.style.borderColor = "red";
      // очищаем поле ввода если не валидно
      loginInput.value = "";
    }
  }

  // на клик по кнопке запускаем функцию toggleModalAuth
  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  // на форму навешиваем слушатель событий (submit) на отправку данных и запускаем функцию logIn
  logInForm.addEventListener("submit", logIn);
}

//проверка авторизации
function checkAuth() {
  //если авторизован - то true иначе false
  if (login) {
    //если пустая строка - то дает false (не обязательно сравнивать login == null || login == '')
    authorized();
  } else {
    notAuthorized();
  }
}

//=========day-2=====добавление карточек на сайт

//функция создания карточек
function createCardRestaurant(restaurant) {
  //получили объекты с ресторана
  console.log(restaurant);

  // необходимо деструктурировать объект (массив)
  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery, //переиминовали переменную
  } = restaurant;

  //переменная создания карточки (href убираем тюкю не будем переходить на другую страницу)
  const card = `
    <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

// функция создания карточки в меню. Деструктурируем
function createCardGood({ description, image, name, price }) {
  // создаем div
  const card = document.createElement("div");
  // задаем класс для дива
  card.className = "card";

  card.insertAdjacentHTML(
    "beforeend",
    `
    <img
      src="${image}"
      alt="image"
      class="card-image"
    />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
    <!-- /.card-text -->
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

// при клике на созданную карточку открываем этот ресторан (event нужен чтоб определить на какой имменно объект в карточке мы кликнули)
function openGoods(event) {
  const target = event.target;
  // console.log(event.target); //вывод в консоль места куда был клик

  //при клике внутри  карточки мы должны получить всю карточку

  // проверка на то что клик был по карточке а не за ее пределами
  if (login) {
    //при клике на карточку запускаем проверку на авторизацию

    const restaurant = target.closest(".card-restaurant"); // closest поднимается по родителя пока не наткнется на указанный (если не находит то возвращает null)
    console.log(restaurant);
    if (restaurant) {
      // очищаем cardsMenu
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);

        // createCardGood();
        // createCardGood();
        // createCardGood();
      });
    }
  } else {
    toggleModalAuth();
  }
}

//функция инициализации (запуска) проекта
function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant); //увидем 6 карточек тануки на странице
  }); // в then указываем кол-бек функцию кoтороя выполниться после того как нам вернется ответ с сервера. при помощи then обрабатываютс япромисы

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  // запускаем функцию openGoods при клике на карточку
  cardsRestaurants.addEventListener("click", openGoods);

  // при клике на лого в меню возврат на главную
  logo.addEventListener("click", returnMain);

  // вызываем функцию при загрузке страницы чтобы произошла проверка в функции logIn
  checkAuth();

  //вызываем функцию для вставки карточки (сколько раз вызовем столько карточек и вставится)
  // createCardRestaurant();
  // createCardRestaurant();
  // createCardRestaurant();

  // swiper (свайпер написан в ООП)
  new Swiper(".swiper-container", {
    loop: true,
    autoplay: true,
    effect: "flip",
    speed: 500,
  });
}

init();
