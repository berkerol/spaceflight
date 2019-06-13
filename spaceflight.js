/* global performance FPSMeter */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const getTime = typeof performance === 'function' ? performance.now : Date.now;
const FRAME_DURATION = 1000 / 58;
let then = getTime();
let acc = 0;
const meter = new FPSMeter({
  left: canvas.width - 130 + 'px',
  top: 'auto',
  bottom: '12px',
  theme: 'colorful',
  heat: 1,
  graph: 1
});

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

const star = {
  colors: [[255, 255, 255], [240, 240, 240], [225, 225, 225], [210, 210, 210], [195, 195, 195], [180, 180, 180]],
  shadowBlur: 20,
  highestAlphaIncrease: 0.015,
  highestRadius: 2,
  highestProximity: 1.5,
  lowestAlphaIncrease: 0.005,
  lowestRadius: 1,
  lowestProximity: 0.5,
  depthMultiplier: 0.005,
  speedMultiplier: 6,
  probability: 0.8
};

const stars = [];

draw();
document.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  const now = getTime();
  let ms = now - then;
  let frames = 0;
  then = now;
  if (ms < 1000) {
    acc += ms;
    while (acc >= FRAME_DURATION) {
      frames++;
      acc -= FRAME_DURATION;
    }
  } else {
    ms = 0;
  }
  meter.tick();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowBlur = star.shadowBlur;
  for (const s of stars) {
    drawStar(s);
  }
  createStars();
  removeStars(frames);
  window.requestAnimationFrame(draw);
}

function drawStar (s) {
  const color = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.alpha})`;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
  ctx.fill();
}

function createStars () {
  if (Math.random() < star.probability) {
    const proximity = star.lowestProximity + Math.random() * (star.highestProximity - star.lowestProximity);
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: star.lowestRadius + Math.random() * (star.highestRadius - star.lowestRadius),
      color: star.colors[Math.floor(Math.random() * star.colors.length)],
      alpha: 0,
      alphaIncrease: star.lowestAlphaIncrease + Math.random() * (star.highestAlphaIncrease - star.lowestAlphaIncrease),
      depth: star.depthMultiplier * proximity,
      speed: star.speedMultiplier * proximity
    });
  }
}

function removeStars (frames) {
  for (let i = stars.length - 1; i >= 0; i--) {
    const s = stars[i];
    if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) {
      stars.splice(i, 1);
    } else {
      s.x += (s.x - mouse.x) / canvas.width * s.speed * frames;
      s.y += (s.y - mouse.y) / canvas.height * s.speed * frames;
      s.radius += s.depth * frames;
      s.alpha = Math.min(s.alpha + s.alphaIncrease * frames, 1.0);
    }
  }
}

function mouseMoveHandler (e) {
  mouse.x = e.clientX - canvas.offsetLeft;
  mouse.y = e.clientY - canvas.offsetTop;
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
