// используем строгий режим
'use strict';

const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
//получаем кнопку ВОЙТИ со страницы
const buttonAuth = document.querySelector('.button-auth');
//получаем модальное окно входа
const modalAuth = document.querySelector('.modal-auth');
//получаем кновку закрытия модалки
const closeAuth = document.querySelector('.close-auth');
// получаем форму входа
const logInForm = document.querySelector('#logInForm');
//получаем input логин
const loginInput = document.querySelector('#login');
// получаем user name
const userName = document.querySelector('.user-name');
//получаем кнопку выхода usera
const buttonOut = document.querySelector('.button-out');
//получаем блок с карточками ресторанов
const cardsRestaurants = document.querySelector('.cards-restaurants');
// получаем весь блок promo
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

// создаем переменную login
let login = localStorage.getItem('gloDelivery');

// массив для корзины
const cart = [];

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
  modal.classList.toggle('is-open');
};

// функция добавления класса .is-open
// если функцию вкинуть в переменную то ее нельзя вызвать до объявления данной функции
const toggleModalAuth = function () {
  modalAuth.classList.toggle('is-open');

  //при нажатии на submit бордеру значение по умолчанию
  loginInput.style.borderColor = '';
};

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

// функция если пользователь авторизован
function authorized() {
  //функция выхода
  function logOut() {
    login = null;

    //при выходе очищаем localStorage
    localStorage.removeItem('gloDelivery');

    //передавая пустую строку означает вернуть свойства прописанные в css
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }

  console.log('Авторизован');

  //если авторизован скрываем кнопку "войти"
  buttonAuth.style.display = 'none';

  // записываем в userName имя введенное пользователем
  userName.textContent = login;

  //если авторизован показываем логин и кнопку выхода
  userName.style.display = 'inline'; //inline т.к. <span>
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  // на кнопку выхода навешиваем событие при котором запуститься функция выхода
  buttonOut.addEventListener('click', logOut);
}

// функция не авторизован
function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    // event - объект. Отменяем перезагрузку страницы при клике на кнопку "войти" в форме
    event.preventDefault();

    //проверяем чтобы в инпуте что-то было. trim удаляет пробелы как вначале так и в конце
    if (valid(loginInput.value)) {
      loginInput.style.borderColor = '';
      //получаем значение с поля логин
      login = loginInput.value;
      //записываем в localStorage данные пользователя который вошол и не вышел, чтоб после перезагрузки страницы оставался авторизован
      localStorage.setItem('gloDelivery', login); // ключ - gloDelivery, значение с login
      //после авторизации закрываем окно с формой
      toggleModalAuth();
      //remove чтобы очищать событие после авторизации (события не навешиваются по несколько раз)
      // удаляем слушание события с toggleModalAuth
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      //удаляем слушатель событий (submit) на отправку данных
      logInForm.removeEventListener('submit', logIn);
      //сбрасываем все значения формы по умолчанию чтобы очистить поля ввода
      logInForm.reset();
      //вызываем проверку авторизации
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
      // очищаем поле ввода если не валидно
      loginInput.value = '';
    }
  }

  // на клик по кнопке запускаем функцию toggleModalAuth
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  // на форму навешиваем слушатель событий (submit) на отправку данных и запускаем функцию logIn
  logInForm.addEventListener('submit', logIn);
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
  // console.log(restaurant);

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

  //переменная создания карточки (href убираем т.к. не будем переходить на другую страницу). При помощи data получаем со страницы необходимые елементы чтобы потом их передать в нужное место (createCardGood).
  const card = `
    <a class="card card-restaurant"
    data-products="${products}"
    data-info='${[name, price, stars, kitchen]}'
    >
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

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

// функция создания карточки в меню. Деструктурируем
function createCardGood({ description, image, name, price, id }) {
  // создаем div
  const card = document.createElement('div');
  // задаем класс для дива
  card.className = 'card';

  card.insertAdjacentHTML(
    'beforeend',
    `
    <img src="${image}" alt="${name}" class="card-image"/>
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
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
    <!-- /.card-text -->
  `
  );

  cardsMenu.insertAdjacentElement('beforeend', card);
}

// при клике на созданную карточку открываем этот ресторан (event нужен чтоб определить на какой имменно объект в карточке мы кликнули)
function openGoods(event) {
  const target = event.target;
  // console.log(event.target); //вывод в консоль места куда был клик

  //при клике внутри  карточки мы должны получить всю карточку

  // проверка на то что клик был по карточке а не за ее пределами
  if (login) {
    //при клике на карточку запускаем проверку на авторизацию

    const restaurant = target.closest('.card-restaurant'); // closest поднимается по родителя пока не наткнется на указанный (если не находит то возвращает null)
    console.log(restaurant);

    if (restaurant) {
      console.log(restaurant.dataset.info); // получили нужный массив только в виде строки. Теперь необходимо разделить на отдельные елементы и снова склеет в массив (split).
      const info = restaurant.dataset.info.split(',');
      console.log(info);

      const [name, price, stars, kitchen] = info; //масив для заглавия при переходе в ресторан

      // очищаем cardsMenu
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      // заполнение заглавия на странице ресторана
      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`; //"От " + price + " ₽";
      category.textContent = kitchen;

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

//отслеживаем клик по карточке для попадания товара в корзину
function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    // find - поиск по указанному условию
    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      // получаем значения в массив cart в виде объекта
      cart.push({
        id, //id: id,
        title, //title: title,
        cost, //cost: cost,
        count: 1,
      });
    }

    console.log(cart);
  }
}

function renderCart() {
  modalBody.textContent = ''; // когда мы кликаем на корзине она сначала очищается

  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('beforeend', itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
}

// функция изменения количества товаров при клике на + и -.
function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) food.count++; //если одна опирация то можно записать в одну строку без {}.

    renderCart(); // перезапуск
  }
}

//функция инициализации (запуска) проекта
function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant); //увидем 6 карточек тануки на странице
  }); // в then указываем кол-бек функцию кoтороя выполниться после того как нам вернется ответ с сервера. при помощи then обрабатываются промисы

  cartButton.addEventListener('click', function () {
    renderCart();
    toggleModal();
  });

  // кнопка отмены в корзине
  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener('click', toggleModal);

  // запускаем функцию openGoods при клике на карточку
  cardsRestaurants.addEventListener('click', openGoods);

  // при клике на лого в меню возврат на главную
  logo.addEventListener('click', returnMain);

  //добавляем слушание в поисковой строке на нажатие клавиши
  inputSearch.addEventListener('keydown', function (event) {
    // console.log(event.keyCode); // получаем код нажатой клавиши

    // если нажат enter
    if (event.keyCode === 13) {
      const target = event.target; // получаем в переменную событие именно с данного поля поиска
      // console.log(target.value); // получаем то что введено в поле поиска

      const value = target.value.toLowerCase().trim(); // получаем то что вбито в поиск, и по нему будем фильтровать

      target.value = '';

      if (!value || value.length < 2) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function () {
          target.style.backgroundColor = '';
        }, 2000);
        return;
      }

      // создаем масив в который будут попадать отфильтрованное по поиску
      const goods = [];

      getData('./db/partners.json').then(function (data) {
        console.log(data); // при нажатии ентер получаю масив в котором все наши 6 ресторанов

        // переберем полученный массив чтобы получить products
        const products = data.map(function (item) {
          return item.products;
        });

        // console.log(products);

        // снова переберем полученный массив чтобы сохранить данные в goods
        products.forEach(function (product) {
          getData(`./db/${product}`)
            .then(function (data) {
              console.log(data); // получаем с каждого магазина по массиву

              // собираем все 6 массивов в одну переменную (goods). ... - спред оператор

              goods.push(...data); // ... для того чтоб получить не 6 оттдельных массивов а один массив с 39 елементами

              const searchGoods = goods.filter(function (item) {
                return item.name.toLowerCase().includes(value);
              });

              console.log(searchGoods);

              cardsMenu.textContent = '';

              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');

              menu.classList.remove('hide');
              restaurantTitle.textContent = 'Результат поиска';
              rating.textContent = '';
              minPrice.textContent = '';
              category.textContent = '';

              return searchGoods;

              // перебирем goods и выводим на сттраницу
            })
            .then(function (data) {
              data.forEach(createCardGood);
            });
        });
      });
    }
  });

  // вызываем функцию при загрузке страницы чтобы произошла проверка в функции logIn
  checkAuth();

  //вызываем функцию для вставки карточки (сколько раз вызовем столько карточек и вставится)
  // createCardRestaurant();
  // createCardRestaurant();
  // createCardRestaurant();

  // swiper (свайпер написан в ООП)
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true,
    effect: 'flip',
    speed: 500,
  });
}

init();
