// const date = new Date();
// console.log(date);

// function foo() {
//   console.log('function declaration'); // ввызывается как до обьявления так и после
// }

// const bar = function() {
//   console.log('function expression'); // вызывается только после обьявления
// }

//menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

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
