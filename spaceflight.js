let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

let star = {
  colors: ['#FFFFFF', '#EEEEEE', '#DDDDDD', '#CCCCCC', '#BBBBBB', '#AAAAAA'],
  shadowBlur: 10,
  highestRadius: 2,
  highestProximity: 1.5,
  lowestRadius: 1,
  lowestProximity: 0.5,
  depthMultiplier: 0.005,
  speedMultiplier: 6,
  probability: 0.8
};

let stars = [];

draw();
document.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  ctx.shadowBlur = star.shadowBlur;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let s of stars) {
    drawStar(s);
  }
  createStars();
  removeStars();
  window.requestAnimationFrame(draw);
}

function drawStar (s) {
  ctx.shadowColor = s.color;
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function createStars () {
  if (Math.random() < star.probability) {
    let proximity = star.lowestProximity + Math.random() * (star.highestProximity - star.lowestProximity);
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: star.lowestRadius + Math.random() * (star.highestRadius - star.lowestRadius),
      color: star.colors[Math.floor(Math.random() * star.colors.length)],
      depth: star.depthMultiplier * proximity,
      speed: star.speedMultiplier * proximity
    });
  }
}

function removeStars () {
  for (let i = stars.length - 1; i >= 0; i--) {
    let s = stars[i];
    if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) {
      stars.splice(i, 1);
    } else {
      s.x += (s.x - mouse.x) / canvas.width * s.speed;
      s.y += (s.y - mouse.y) / canvas.height * s.speed;
      s.radius += s.depth;
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
