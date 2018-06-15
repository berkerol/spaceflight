let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let star = {
  colors: ['#FFFFFF', '#EEEEEE', '#DDDDDD', '#CCCCCC', '#BBBBBB', '#AAAAAA'],
  lineCap: 'round',
  shadowBlur: 10,
  highestDepth: 0.1,
  highestLength: 6,
  highestLineWidth: 2.5,
  highestSpeed: 4,
  lowestDepth: 0.05,
  lowestLength: 4,
  lowestLineWidth: 1.5,
  lowestSpeed: 2,
  probability: 0.3,
  spawnRadius: 30,
  speed: 3
};

let stars = [];

ctx.lineCap = star.lineCap;
ctx.shadowBlur = star.shadowBlur;
draw();
window.addEventListener('resize', resizeHandler);

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let s of stars) {
    drawStar(s);
  }
  createStars();
  removeStars();
  window.requestAnimationFrame(draw);
}

function drawStar (s) {
  ctx.lineWidth = s.lineWidth;
  ctx.shadowColor = s.color;
  ctx.strokeStyle = s.color;
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(s.x + s.speedX / star.speed * s.length, s.y + s.speedY / star.speed * s.length);
  ctx.stroke();
  ctx.closePath();
}

function createStars () {
  if (Math.random() < star.probability) {
    let angle = Math.random() * Math.PI * 2;
    stars.push({
      x: Math.cos(angle) * star.spawnRadius + canvas.width / 2,
      y: Math.sin(angle) * star.spawnRadius + canvas.height / 2,
      color: star.colors[Math.floor(Math.random() * star.colors.length)],
      depth: star.lowestDepth + Math.random() * (star.highestDepth - star.lowestDepth),
      length: star.lowestLength + Math.random() * (star.highestLength - star.lowestLength),
      lineWidth: star.lowestLineWidth + Math.random() * (star.highestLineWidth - star.lowestLineWidth),
      speedX: Math.cos(angle) * (star.lowestSpeed + Math.random() * (star.highestSpeed - star.lowestSpeed)),
      speedY: Math.sin(angle) * (star.lowestSpeed + Math.random() * (star.highestSpeed - star.lowestSpeed))
    });
  }
}

function removeStars () {
  for (let i = stars.length - 1; i >= 0; i--) {
    let s = stars[i];
    if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) {
      stars.splice(i, 1);
    } else {
      s.x += s.speedX;
      s.y += s.speedY;
      s.length += s.depth;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
