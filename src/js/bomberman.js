var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var centerX = (canvas.width / 2);
var centerY = (canvas.height / 2);
var index = 0;

var keys = {}
var processKeyDownEvent = function(e) {
  e = e || window.event;

  // up arrow
  if (e.keyCode == '38') { keys['up'] = true; }
  // down arrow
  else if (e.keyCode == '40') { keys['down'] = true; }
  // left arrow
  else if (e.keyCode == '37') { keys['left'] = true; }
  // right arrow
  else if (e.keyCode == '39') { keys['right'] = true; }
};
document.onkeydown = processKeyDownEvent;

var processKeyUpEvent = function(e) {
  e = e || window.event;

   // up arrow
  if (e.keyCode == '38') { keys['up'] = false; }
   // down arrow
  else if (e.keyCode == '40') { keys['down'] = false; }
  // left arrow
  else if (e.keyCode == '37') { keys['left'] = false; }
  // right arrow
  else if (e.keyCode == '39') { keys['right'] = false; }
};
document.onkeyup = processKeyUpEvent;

var renderBackground = function() {
  ctx.fillStyle = "rgb(200, 200, 200)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var renderBlock = function(x, y, tile) {
  ctx.drawImage(
    spritesRepo.fetch('stages').image,
    tile.srcX,
    tile.srcY,
    14, 14, x, y, 14, 14
  );
};

var renderMap = function(map, x, y) {
  var curX = x;
  var curY = y;

  for(var rowIdx = 0, curY = y; rowIdx < 40; rowIdx++, curY += 14) {
    for(var colIdx = 0, curX = x; colIdx < 50; colIdx++, curX += 14) {
      if (map.map[rowIdx][colIdx] !== ' ') {
        renderBlock(curX, curY, blockTiles[ map.map[rowIdx][colIdx] ][0]);
      }
    }
  }
};

var spritesRepo = new SpriteRepository([
  './src/img/bomberman.png',
  './src/img/stages.png'
]);

var bombermanTiles = {
  "up": [{srcX: 0, srcY: 0}, {srcX: 16, srcY: 0}, {srcX: 32, srcY: 0}],
  "right": [{srcX: 0, srcY: 32}, {srcX: 16, srcY: 32}, {srcX: 32, srcY: 32}],
  "down": [{srcX: 0, srcY: 64}, {srcX: 16, srcY: 64}, {srcX: 32, srcY: 64}],
  "left": [{srcX: 0, srcY: 96}, {srcX: 16, srcY: 96}, {srcX: 32, srcY: 96}]
};

var blockTiles = {
  "B": [{srcX: 0, srcY: 14}],
  "HB": [{srcX: 85, srcY: 14}]
};

var player = new Player(centerX, centerY);
var tiles = bombermanTiles['up'];
var map = new Map(50, 40);
setInterval(function () {
  renderBackground();
  renderMap(map, 20, 20);

  if (keys['up']) {
    player.moveUp();
    tiles = bombermanTiles['up'];
    index = (index + 1) % 3;
  }
  else if (keys['down']) {
    player.moveDown();
    tiles = bombermanTiles['down'];
    index = (index + 1) % 3;
  }
  else if (keys['left']) {
    player.moveLeft();
    tiles = bombermanTiles['left'];
    index = (index + 1) % 3;
  }
  else if (keys['right']) {
    player.moveRight();
    tiles = bombermanTiles['right'];
    index = (index + 1) % 3;
  }

  ctx.drawImage(
    spritesRepo.fetch('bomberman').image,
    tiles[index].srcX,
    tiles[index].srcY,
    16, 32, player.x, player.y, 16, 32
  );
}, 100);
