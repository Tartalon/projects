// запрет на навешивание событий пока не загрузиться весь html. Весь код пишем в данной функции
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  const btnOpenModal = document.querySelector('#btnOpenModal');
  const modalBlock = document.querySelector('#modalBlock');
  const modalWrap = document.querySelector('.modal');
  const closeModal = document.querySelector('#closeModal');
  const questionTitle = document.querySelector('#question');
  const formAnswers = document.querySelector('#formAnswers');
  const burgerBtn = document.getElementById('burger');

  // переменная которая бедет получать ширину экрана клиента
  let clientWidth = document.documentElement.clientWidth;

  if (clientWidth < 768) {
    burgerBtn.style.display = 'flex';
  } else {
    burgerBtn.style.display = 'none';
  }

  //навешиваем обработчик событий на window
  window.addEventListener('resize', function () {
    clientWidth = document.documentElement.clientWidth;

    // при ширене окна у клиента меньше 768px появляется бургер меню
    if (clientWidth < 768) {
      burgerBtn.style.display = 'flex';
    } else {
      burgerBtn.style.display = 'none';
    }
  });

  burgerBtn.addEventListener('click', function () {
    modalBlock.classList.add('d-block'); // d-block - display: block.
    playTest();
  });

  btnOpenModal.addEventListener('click', () => {
    modalBlock.classList.add('d-block'); // d-block - display: block.
    playTest();
  });

  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
  });

  // при клике вне модального окна модалка закрывается (делегирование)
  document.addEventListener('click', function (event) {
    if (
      !event.target.closest('.modal-dialog') &&
      !event.target.closest('.openModalButton') &&
      !event.target.closest('.burger')
    ) {
      modalBlock.classList.remove('d-block');
    }
  });

  const playTest = () => {
    const renderQuestions = () => {
      questionTitle.textContent = 'Какого цвета бургер вы хотите?';

      formAnswers.innerHTML = `
        <div class="answers-item d-flex flex-column">
          <input type="radio" id="answerItem1" name="answer" class="d-none">
          <label for="answerItem1" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="./image/burger.png" alt="burger">
            <span>Стандарт</span>
          </label>
        </div>
      `;
    };
    renderQuestions();
  };
});
