var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var centerX = (canvas.width / 2);
var centerY = (canvas.height / 2);

var direction = "up";
var index = 0;
var moveX = 0;
var moveY = -5;
var processKeyEvent = function(e) {
  e = e || window.event;

  if (e.keyCode == '38') {   // up arrow
    moveX = 0;
    moveY = -5;
    index = 0;
    direction = "up";
  }
  else if (e.keyCode == '40') { // down arrow
    moveX = 0;
    moveY = 5;
    index = 0;
    direction = "down";
  }
  else if (e.keyCode == '37') { // left arrow
    moveX = -5;
    moveY = 0;
    index = 0;
    direction = "left";
  }
  else if (e.keyCode == '39') { // right arrow
    moveX = 5;
    moveY = 0;
    index = 0;
    direction = "right";
  }
};
document.onkeydown = processKeyEvent;

var renderBackground = function() {
  ctx.fillStyle = "rgb(200, 200, 200)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var spritesRepo = new SpriteRepository([
  './src/img/bomberman.png'
]);

var tiles = {
  "up": [{srcX: 0, srcY: 0}, {srcX: 16, srcY: 0}, {srcX: 32, srcY: 0}],
  "right": [{srcX: 0, srcY: 32}, {srcX: 16, srcY: 32}, {srcX: 32, srcY: 32}],
  "down": [{srcX: 0, srcY: 64}, {srcX: 16, srcY: 64}, {srcX: 32, srcY: 64}],
  "left": [{srcX: 0, srcY: 96}, {srcX: 16, srcY: 96}, {srcX: 32, srcY: 96}]
};
var playerX = centerX;
var playerY = centerY;

setInterval(function () {
  renderBackground();

  console.log(`X: ${playerX}, Y: ${playerY}`);
  ctx.drawImage(
    spritesRepo.fetch('bomberman').image,
    tiles[direction][index].srcX,
    tiles[direction][index].srcY,
    16, 32, playerX, playerY, 16, 32
  );

  index = (index + 1) % 3;

  playerX += moveX;
  playerY += moveY;
}, 100);
