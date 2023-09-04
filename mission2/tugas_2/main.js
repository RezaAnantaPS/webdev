//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//luffy
let luffyWidth = 88;
let luffyHeight = 94;
let luffyX = 50;
let luffyY = boardHeight - luffyHeight;
let luffyImg;

let luffy = {
  x: luffyX,
  y: luffyY,
  width: luffyWidth,
  height: luffyHeight,
};

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 50;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let gameOverImg = new Image();
gameOverImg.src = "assets/img/game-over.png";
let score = 0;

let jumpFrames = []; // Array untuk gambar animasi loncat
let runFrames = []; // Array untuk gambar animasi berlari
let duckFrames = []; // Array untuk gambar animasi merunduk
let numFrames = 3; // Jumlah frame animasi

// Variabel yang mengontrol loncatan
let isJumping = false;
let jumpHeight = 130;
let jumpDuration = 300;
let jumpStartTime;

// Inisialisasi gambar-gambar animasi
for (let i = 1; i <= numFrames; i++) {
  let jumpFrame = new Image();
  jumpFrame.src = `assets/img/jump_${i}.png`;
  jumpFrames.push(jumpFrame);

  let runFrame = new Image();
  runFrame.src = `assets/img/run_${i}.png`;
  runFrames.push(runFrame);

  let duckFrame = new Image();
  duckFrame.src = `assets/img/duck_${i}.png`;
  duckFrames.push(duckFrame);
}

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");

  luffyImg = new Image();
  luffyImg.src = "assets/img/run_1.png";
  luffyImg.onload = function () {
    context.drawImage(luffyImg, luffy.x, luffy.y, luffy.width, luffy.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "assets/img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "assets/img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "assets/img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000);
  document.addEventListener("keydown", moveluffy);
};

let frameInterval = 100;
let currentFrame = 0;
let lastFrameTime = Date.now();
let frameCount = 0;
let ducking = false;

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    velocityX = 0;
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(luffyImg, luffy.x, luffy.y, luffy.width, luffy.height);

    let gameOverX = (boardWidth - gameOverImg.width) / 2;
    let gameOverY = (boardHeight - gameOverImg.height) / 2;
    context.drawImage(gameOverImg, gameOverX, gameOverY);

    context.fillStyle = "white";
    context.font = "36px Arial";
    let scoreText = "Score: " + score;
    let scoreWidth = context.measureText(scoreText).width;
    let scoreX = (boardWidth - scoreWidth) / 2;
    let scoreY = gameOverY + gameOverImg.height + 30;
    context.fillText(scoreText, scoreX, scoreY);

    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //luffy
  velocityY += gravity;
  luffy.y = Math.min(luffy.y + velocityY, luffyY);

  // Animasi berlari
  let currentTime = Date.now();
  if (isRunning && currentTime - lastFrameTime > frameInterval) {
    currentFrame = (currentFrame + 1) % numFrames;
    lastFrameTime = currentTime;
  }
  context.drawImage(
    runFrames[currentFrame],
    luffy.x,
    luffy.y,
    luffy.width,
    luffy.height
  );

  // Animasi loncat
  if (isJumping) {
    let elapsedTime = currentTime - jumpStartTime;
    if (elapsedTime < jumpDuration) {
      luffy.y = luffyY - jumpHeight * (elapsedTime / jumpDuration);
    } else {
      luffy.y = luffyY;
      isJumping = false;
      isRunning = true;
    }
  }

  // Animasi merunduk
  if (ducking) {
    context.drawImage(duckFrames[0], luffy.x, luffy.y, luffy.width, luffy.height);
  }

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(luffy, cactus)) {
      gameOver = true;
      luffyImg.src = "assets/img/death.png";
      luffyImg.onload = function () {
        context.drawImage(luffyImg, luffy.x, luffy.y, luffy.width, luffy.height);
      };
    }
  }

  //score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score, 5, 20);
}

function moveluffy(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && !isJumping && !ducking) {
    // Jump
    isJumping = true;
    isRunning = false;
    jumpStartTime = Date.now();
    velocityY = -10;
  } else if (e.code == "ArrowDown" && luffy.y == luffyY) {
    // Duck
    ducking = true;
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random();

  if (placeCactusChance > 0.9) {
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift();
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
