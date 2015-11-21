var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var centerX = (canvas.width / 2);
var centerY = (canvas.height / 2);
var COLS_MAP = 35;
var ROWS_MAP = 25;
var BLOCK_WIDTH = 20;
var BLOCK_HEIGHT = 20;
var index = 0;
var debug = {
  collision: false
};
debug.collision = true;

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
    14, 14, x, y, BLOCK_WIDTH, BLOCK_HEIGHT
  );
};

var renderMap = function(map, x, y) {
  var curX = x;
  var curY = y;
  var loc = {x: player.curTileY(), y: player.curTileX()};

  for(var rowIdx = 0, curY = y; rowIdx < ROWS_MAP; rowIdx++, curY += BLOCK_WIDTH) {
    for(var colIdx = 0, curX = x; colIdx < COLS_MAP; colIdx++, curX += BLOCK_HEIGHT) {
      if (map.map[rowIdx][colIdx] !== ' ') {
        renderBlock(curX, curY, blockTiles[ map.map[rowIdx][colIdx] ][0]);
      }

      if (debug.collision) {
        if (rowIdx === collideTileX && colIdx === collideTileY) {
          ctx.fillStyle = "red";
          ctx.fillRect(curX, curY, BLOCK_WIDTH, BLOCK_HEIGHT);
        }

        if (rowIdx === loc.x && colIdx === loc.y) {
          ctx.fillStyle = "green";
          ctx.fillRect(curX, curY, BLOCK_WIDTH, BLOCK_HEIGHT);
        }
      }

      if (rowIdx === player.curTileX() && colIdx === player.curTileY()) {
        ctx.drawImage(
          spritesRepo.fetch('bomberman').image,
          tiles[index].srcX,
          tiles[index].srcY,
          16, 32, player.x, player.y, BLOCK_WIDTH, BLOCK_HEIGHT
        );
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

// map is 50x40 tiles large
var map = new Map(COLS_MAP, ROWS_MAP);

var emptyPos = map.findEmpty();
var player = new Player(emptyPos.x + 7, emptyPos.y + 7, emptyPos.tileX, emptyPos.tileY);
var tiles = bombermanTiles['up'];
var collideTileX = undefined;
var collideTileY = undefined;

var getPlayerTile = function(player) {
  return {x: player.curTileX(), y: player.curTileY()};
};

var collidesWith = function(tileX, tileY, map) {
  // For debugging purposes...
  collideTileX = tileY + 1;
  collideTileY = tileX;

  return (map.map[tileY + 1][tileX] !== ' ');
};

var collidesLeft = function(player, map) {
  var location = getPlayerTile(player);
  var tileX = location.x;
  var tileY = location.y;

  return collidesWith(tileX - 1, tileY, map);
};

var collidesRight = function(player, map) {
  var location = getPlayerTile(player, map);
  var tileX = location.x;
  var tileY = location.y;

  return collidesWith(tileX + 1, tileY, map);
};

var collidesUp = function(player, map) {
  var location = getPlayerTile(player, map);
  var tileX = location.x;
  var tileY = location.y;

  return collidesWith(tileX, tileY - 1, map);
};

var collidesDown = function(player, map) {
  var location = getPlayerTile(player, map);
  var tileX = location.x;
  var tileY = location.y;

  return collidesWith(tileX, tileY + 1, map);
};

setInterval(function () {
  renderBackground();
  renderMap(map, 20, 20);

  if (keys['up']) {
    if (!collidesUp(player, map))
      player.moveUp();
    tiles = bombermanTiles['up'];
    index = (index + 1) % 3;
  }
  else if (keys['down']) {
    if (!collidesDown(player, map))
      player.moveDown();
    tiles = bombermanTiles['down'];
    index = (index + 1) % 3;
  }
  else if (keys['left']) {
    if (!collidesLeft(player, map))
      player.moveLeft();
    tiles = bombermanTiles['left'];
    index = (index + 1) % 3;
  }
  else if (keys['right']) {
    if (!collidesRight(player, map))
      player.moveRight();
    tiles = bombermanTiles['right'];
    index = (index + 1) % 3;
  }
}, 100);
