// const date = new Date();
// console.log(date);

// function foo() {
//   console.log('function declaration'); // ввызывается как до обьявления так и после
// }

// const bar = function() {
//   console.log('function expression'); // вызывается только после обьявления
// }
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
// const SERVER = 'https://api.themoviedb.org/3/';
// const API_KEY = 'f48226d3071e8f05afa99e20323348ef';

//элементы
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
// const tvCardVote = document.querySelector(".tv-card__vote");
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';

// классы; запрос на сервер
class DBService {
  constructor() {
    this.SERVER = 'https://api.themoviedb.org/3/';
    this.API_KEY = 'f48226d3071e8f05afa99e20323348ef';
  }

  getData = async url => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`);
    }
  };

  getTestData = () => {
    return this.getData('test.json');
  };

  getTestCard = () => {
    return this.getData('card.json');
  };

  getSearchResult = query => {
    // return this.getData(
    //   `${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`
    // );
    return this.getData(
      this.SERVER +
        'search/tv?api_key=' +
        this.API_KEY +
        '&language=ru-RU&query=' +
        query
    );
  };

  getTvShow = id => {
    // return this.getData(this.SERVER + 'tv/' + id + '?api_key=' +
    // this.API_KEY + '&language=ru-RU');
    return this.getData(
      `${this.SERVER}tv/${id}?api_key=${this.API_KEY}&language=ru-RU`
    );
  };
}

// console.log(new DBService().getSearchResult('Няня'));

const renderCard = response => {
  // console.log(response);
  tvShowsList.textContent = '';

  response.results.forEach(item => {
    //деструктурируем item
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg';

    // ДЗ если нет backdrop то не выводить его
    // ДЗ если нет voteElem - не выводим span tv-card__vote
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');
    card.idTV = id;
    card.classList.add('tv-shows__item');
    card.innerHTML = `
      <a href="#" id='${id}' class="tv-card">
        ${voteElem}
        <img
          class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}"
        />
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;

    loading.remove();
    tvShowsList.append(card);
  });
};

// получаем данные введенные в поиск и отправляем запрос на сервер
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
  // tvShows.append(loading);
  // new DBService().getSearchResult(value).then(renderCard);
});

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
    // console.log(card);
    new DBService()
      .getTvShow(card.id)
      .then(data => {
        // console.log(data);

        tvCardImg.src = IMG_URL + data.poster_path;
        modalTitle.textContent = data.name;
        // genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');

        // genresList.textContent = '';
        // for (const item of data.genres) {
        //   genresList.innerHTML += `<li>${item.name}</li>`;
        // }

        genresList.textContent = '';
        data.genres.forEach(item => {
          genresList.innerHTML += `<li>${item.name}</li>`;
        });
        rating.textContent = data.vote_average;
        description.textContent = data.overview;
        modalLink.href = data.homepage;
      })
      .then(() => {
        document.body.style.overflow = 'hidden'; //отключили скрол бади
        modal.classList.remove('hide');
      });
  }
});

// закрытие модалки
modal.addEventListener('click', event => {
  if (
    event.target.closest('.cross') ||
    event.target.classList.contains('modal')
  ) {
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
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};
tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);
