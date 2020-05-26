// const date = new Date();
// console.log(date);

// function foo() {
//   console.log('function declaration'); // ввызывается как до обьявления так и после
// }

// const bar = function() {
//   console.log('function expression'); // вызывается только после обьявления
// }

//элементы
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');

// классы; запрос на сервер
const DBService = class {
  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }
  }

  getTestData = async () => {
    return await this.getData('test.json')
  }
}

const renderCard = response => {
  console.log(response);
  tvShowsList.textContent = '';

  response.results.forEach(item => {
    // console.log(item);
    const card = document.createElement('li');
    card.classList.add('tv-shows__item');
    card.innerHTML = `
      <a href="#" class="tv-card">
        <span class="tv-card__vote">8.1</span>
        <img
          class="tv-card__img"
          src="https://image.tmdb.org/t/p/w185_and_h278_bestv2/o9XEd15zRzef9SlOuJYPdS5HCdK.jpg"
          data-backdrop="https://image.tmdb.org/t/p/w185_and_h278_bestv2/lXWgVQ1whAEMz4Ju88UyPoveIKD.jpg"
          alt="Звёздные войны: Войны клонов"
        />
        <h4 class="tv-card__head">Звёздные войны: Войны клонов</h4>
      </a>
    `;

    tvShowsList.append(card);

  });
}

new DBService().getTestData().then(renderCard);

//открытие/закрытие меню
hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

leftMenu.addEventListener('click', event => {
  //если один аргумент то в стрелочной ф-ции скобки не пишут
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});


// открытие модалки
tvShowsList.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {
    document.body.style.overflow = 'hidden'; //отключили скрол бади 
    modal.classList.remove('hide');
  }
});

// закрытие модалки
modal.addEventListener('click', event => {

  if (event.target.closest('.cross') ||
    event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
});

// меняем изображение карточки
const changeImage = event => {
  const card = event.target.closest('.tv-shows__item');
  // console.log(target.matches('.tv-card__img'));
  // if (card) {
  //   const img = card.querySelector('.tv-card__img');
  //   const changeImg = img.dataset.backdrop;
  //   if (changeImg) {
  //     img.dataset.backdrop = img.src;
  //     img.src = changeImg;
  //   }
  // }

  //деструктуризация
  if (card) {
    const img = card.querySelector('.tv-card__img');
    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
    }
  }

};
tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);