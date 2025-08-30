const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
let score = 0;
let best = 0;
let gameOver = false;

// Load images
const bgImg = new Image();
bgImg.src = "../images/bg.png";

const birdImg = new Image();
birdImg.src = "../images/bird.png";

const pipeImg = new Image();
pipeImg.src = "../images/pipe.png";

const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 24,
  gravity: 0.3,
  jump: 5,
  speed: 0,
  draw() {
    ctx.drawImage(birdImg, this.x, this.y, this.w, this.h);
  },
  update() {
    this.speed += this.gravity;
    this.y += this.speed;

    if (this.y + this.h >= canvas.height) {
      this.y = canvas.height - this.h;
      gameOver = true;
    }
  },
  flap() {
    this.speed = -this.jump;
  },
  reset() {
    this.y = 150;
    this.speed = 0;
  }
};

const pipes = [];
const gap = 120;

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    // Top pipe (flipped)
    ctx.save();
    ctx.translate(p.x + 50, p.top);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImg, -50, 0, 50, p.top);
    ctx.restore();

    // Bottom pipe
    ctx.drawImage(pipeImg, p.x, p.top + gap, 50, canvas.height - p.top - gap);
  }
}

function updatePipes() {
  if (frames % 90 === 0) {
    let top = Math.random() * (canvas.height - gap - 100) + 50;
    pipes.push({x: canvas.width, top: top, passed: false});
  }
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    // collision check
    if (
      bird.x < p.x + 50 &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.top + gap)
    ) {
      gameOver = true;
    }

    // score check
    if (!p.passed && p.x + 50 < bird.x) {
      score++;
      p.passed = true;
    }

    // remove old pipes
    if (p.x + 50 < 0) {
      pipes.splice(i, 1);
      i--;
    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Best: " + best, 10, 55);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2 - 40, canvas.height / 2 + 10);
  ctx.fillText("Tap / Press to Restart", canvas.width / 2 - 100, canvas.height / 2 + 50);
}

function resetGame() {
  score = 0;
  pipes.length = 0;
  bird.reset();
  frames = 0;
  gameOver = false;
}

function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  drawPipes();
  bird.draw();
  drawScore();

  if (gameOver) {
    drawGameOver();
  }
}

function update() {
  if (!gameOver) {
    bird.update();
    updatePipes();
    frames++;
  } else {
    if (score > best) best = score;
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function flapOrRestart() {
  if (gameOver) {
    resetGame();
  } else {
    bird.flap();
  }
}

window.addEventListener("keydown", flapOrRestart);
window.addEventListener("touchstart", flapOrRestart);

loop();
