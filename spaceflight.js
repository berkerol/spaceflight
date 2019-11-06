/* global canvas ctx animation addPause addResize loop paintCircle generateRandomNumber generateRandomInteger */
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

addPause();
addResize();
document.addEventListener('mousemove', mouseMoveHandler);

loop(function (frames) {
  ctx.shadowBlur = star.shadowBlur;
  for (const s of stars) {
    const color = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.alpha})`;
    ctx.shadowColor = color;
    paintCircle(s.x, s.y, s.radius, color);
  }
  createStars();
  removeStars(frames);
});

function createStars () {
  if (Math.random() < star.probability) {
    const proximity = generateRandomNumber(star.lowestProximity, star.highestProximity);
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: generateRandomNumber(star.lowestRadius, star.highestRadius),
      color: star.colors[generateRandomInteger(star.colors.length)],
      alpha: 0,
      alphaIncrease: generateRandomNumber(star.lowestAlphaIncrease, star.highestAlphaIncrease),
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
      s.alpha = Math.min(s.alpha + s.alphaIncrease * frames, 1);
    }
  }
}

function mouseMoveHandler (e) {
  if (animation !== undefined) {
    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
  }
}
