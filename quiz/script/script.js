// запрет на навешивание событий пока не загрузиться весь html. Весь код пишем в данной функции
// глобальный обработчик событий, который отслеживает загрузку контента
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  const btnOpenModal = document.querySelector('#btnOpenModal');
  const modalBlock = document.querySelector('#modalBlock');
  const modalWrap = document.querySelector('.modal');
  const closeModal = document.querySelector('#closeModal');
  const questionTitle = document.querySelector('#question');
  const formAnswers = document.querySelector('#formAnswers');
  const burgerBtn = document.getElementById('burger');
  const nextButton = document.getElementById('next');
  const prevButton = document.getElementById('prev');
  const modalDialog = document.querySelector('.modal-dialog');
  const sendButton = document.getElementById('send');

  const modalTitle = document.querySelector('.modal-title');

  // объект в котором вопросы и ответы
  const questions = [
    {
      question: 'Какого цвета бургер?',
      answers: [
        {
          title: 'Стандарт',
          url: './image/burger.png',
        },
        {
          title: 'Черный',
          url: './image/burgerBlack.png',
        },
      ],
      type: 'radio',
    },
    {
      question: 'Из какого мяса котлета?',
      answers: [
        {
          title: 'Курица',
          url: './image/chickenMeat.png',
        },
        {
          title: 'Говядина',
          url: './image/beefMeat.png',
        },
        {
          title: 'Свинина',
          url: './image/porkMeat.png',
        },
      ],
      type: 'radio',
    },
    {
      question: 'Дополнительные ингредиенты?',
      answers: [
        {
          title: 'Помидор',
          url: './image/tomato.png',
        },
        {
          title: 'Огурец',
          url: './image/cucumber.png',
        },
        {
          title: 'Салат',
          url: './image/salad.png',
        },
        {
          title: 'Лук',
          url: './image/onion.png',
        },
      ],
      type: 'checkbox',
    },
    {
      question: 'Добавить соус?',
      answers: [
        {
          title: 'Чесночный',
          url: './image/sauce1.png',
        },
        {
          title: 'Томатный',
          url: './image/sauce2.png',
        },
        {
          title: 'Горчичный',
          url: './image/sauce3.png',
        },
      ],
      type: 'radio',
    },
  ];

  // анимация на появление модалки
  let count = -100;
  // чтобы остановить анимацию используется clearInterval (через переменную).

  // убираем моргание при вызове модалки (тюкю начальное значение top: 0;)
  modalDialog.style.top = count + '%';
  const animateModal = () => {
    modalDialog.style.top = count + '%';
    count += 7;

    if (count < 0) {
      requestAnimationFrame(animateModal);
    } else {
      count = -100;
    }

    // if (count >= 0) {
    //   clearInterval(interval);

    //   // count на -100 чтоб не приходилось перезагружать окно
    //   count = -100;
    // }
  };

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

  // обработчики открытия/закрытия модалки
  btnOpenModal.addEventListener('click', () => {
    requestAnimationFrame(animateModal); // меньше грузит браузер чем setInterval
    // interval = setInterval(animateModal, 5);
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

  // запуск текста
  const playTest = () => {
    //объект куда будут складываться ответы
    const finelAnswers = [];
    const obj = {};

    let numberQuestion = 0;

    // рендерим отвуты
    const renderAnswers = index => {
      questions[index].answers.forEach(answer => {
        const answerItem = document.createElement('div');

        answerItem.classList.add(
          'answers-item',
          'd-flex',
          'justify-content-center'
        );

        answerItem.innerHTML = `
          <input type = "${questions[index].type}"
          id = "${answer.title}"
          name = "answer"
          class = "d-none" value="${answer.title}">
          <label
          for = "${answer.title}"
          class = "d-flex flex-column justify-content-between" >
          <img class="answerImg" src="${answer.url}" alt="burger">
          <span>${answer.title}</span>
          </label>
        `;

        // console.log(questions[index].type);
        formAnswers.appendChild(answerItem);
      });
    };

    // функция рендеринга вопросов + ответов
    const renderQuestions = indexQuestion => {
      formAnswers.innerHTML = '';

      // if (numberQuestion === 0) {
      //   prevButton.style.display = 'none';
      // } else {
      //   prevButton.style.display = 'inline-block';
      // }

      // if (questions.length - 1 == numberQuestion) {
      //   nextButton.style.display = 'none';
      // } else {
      //   nextButton.style.display = 'inline-block';
      // }

      if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
        questionTitle.textContent = `${questions[indexQuestion].question}`;
        renderAnswers(indexQuestion);

        nextButton.classList.remove('d-none');
        prevButton.classList.remove('d-none');
        sendButton.classList.add('d-none');
      }

      if (numberQuestion === 0) {
        prevButton.classList.add('d-none');
      }

      if (numberQuestion === questions.length) {
        questionTitle.textContent = '';
        modalTitle.textContent = '';

        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
        sendButton.classList.remove('d-none');

        formAnswers.innerHTML = `
        <div class="form-group">
          <label for="numberPhone">Ваш номер телефона?</label>
          <input type="phone" class="form-control" id="numberPhone">
        </div>
        `;
      }

      if (numberQuestion === questions.length + 1) {
        formAnswers.textContent = 'Спасибо за пройденный тест!';

        for (let key in obj) {
          // console.log(key, obj[key]);
          let newObj = {};
          newObj[key] = obj[key];
          finelAnswers.push(newObj);
        }

        setTimeout(() => {
          modalBlock.classList.remove('d-block');
        }, 2000);
      }
    };

    // запуск рендеринга
    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      const inputs = [...formAnswers.elements].filter(
        input => input.checked || input.id === 'numberPhone'
      );
      // console.log(inputs);

      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] = input.value;
        }

        if (numberQuestion === questions.length) {
          obj['Номер телефона'] = input.value;
        }
      });

      // console.log(finelAnswers);
      // console.log(obj);
    };

    // на onclick обработчик вешается только раз при клике, а при addEventListener при каждом клике  плюсуется
    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    };
    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    };

    sendButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      console.log(finelAnswers);
    };
  };
});
