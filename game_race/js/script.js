const HEIGHT_ENEMY = 100;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');

const music = new Audio('./music/corona.mp3');

car.classList.add('car');

start.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 2.5,
};

const enemys = [
  '../images/enemy1.png',
  '../images/enemy2.png',
  '../images/enemy3.png',
  '../images/enemy4.png',
  '../images/enemy5.png',
  '../images/enemy6.png',
];

function getQuantityElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

function startGame() {
  music.play();

  gameArea.style.minHeight =
    Math.floor(
      (document.documentElement.clientHeight - HEIGHT_ENEMY) / HEIGHT_ENEMY
    ) * HEIGHT_ENEMY;
  start.classList.add('hide');
  gameArea.innerHTML = '';
  car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';

  for (let i = 0; i < getQuantityElements(HEIGHT_ENEMY); i++) {
    const line = document.createElement('div');
    line.classList = 'line';
    line.style.top = i * HEIGHT_ENEMY + 'px';
    line.style.height = HEIGHT_ENEMY / 2 + 'px';
    line.y = i * HEIGHT_ENEMY;
    gameArea.append(line);
  }

  for (
    let i = 0;
    i < getQuantityElements(HEIGHT_ENEMY * setting.traffic);
    i++
  ) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ENEMY * setting.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url(${
      enemys[Math.floor(Math.random() * enemys.length)]
    }) center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score++;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x += setting.speed;
    }

    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
}

function startRun(e) {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
}

function stopRun(e) {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(line => {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ENEMY;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      setting.start = false;
      music.currentTime = 0;
      music.pause();
      console.warn('DTP');
      start.classList.remove('hide');
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ENEMY * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}
