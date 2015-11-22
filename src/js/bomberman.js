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

// TODO: Make this configurable
debug.collision = false;

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

var getPlayerTile = function(player) {
  return {x: player.tileColIndex(), y: player.tileRowIndex()};
};

var renderMap = function(map, x, y) {
  var curX = x;
  var curY = y;
  var loc = getPlayerTile(player)

  // rows -> along y-axis
  // cols -> along x-axis
  for(var rowIdx = 0, curY = y; rowIdx < ROWS_MAP; rowIdx++, curY += BLOCK_WIDTH) {
    for(var colIdx = 0, curX = x; colIdx < COLS_MAP; colIdx++, curX += BLOCK_HEIGHT) {
      if (map.map[rowIdx][colIdx] !== ' ') {
        renderBlock(curX, curY, blockTiles[ map.map[rowIdx][colIdx] ][0]);
      }

      if (debug.collision) {
        if (rowIdx === collideTileX && colIdx === collideTileY) {
          console.log(`Collision Tile is at Row ${rowIdx} and Col ${colIdx}`)
          ctx.fillStyle = "red";
          ctx.fillRect(curX, curY, BLOCK_WIDTH, BLOCK_HEIGHT);
        }

        if (rowIdx === loc.y && colIdx === loc.x) {
          ctx.fillStyle = "green";

          // fillRect(x, y, width, height)
          ctx.fillRect(player.x, player.y, BLOCK_WIDTH, BLOCK_HEIGHT);
        }
      }

      if (rowIdx === loc.y && colIdx === loc.x) {
        console.log(`Player Tile is at Row ${loc.y} and Col ${loc.x}`)
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

var collidesWith = function(tileRow, tileCol, map) {
  // For debugging purposes...
  collideTileX = tileRow;
  collideTileY = tileCol;

  return (map.map[tileRow][tileCol] !== ' ');
};

var collidesLeft = function(player, map) {
  var location = getPlayerTile(player);
  var tileCol = location.x;
  var tileRow = location.y;

  return collidesWith(tileRow, tileCol - 1, map);
};

var collidesRight = function(player, map) {
  var location = getPlayerTile(player, map);
  var tileCol = location.x;
  var tileRow = location.y;

  return collidesWith(tileRow, tileCol + 1, map);
};

var collidesUp = function(player, map) {
  var location = getPlayerTile(player, map);
  var tileCol = location.x;
  var tileRow = location.y;

  return collidesWith(tileRow - 1, tileCol, map);
};

var collidesDown = function(player, map) {
  var location = getPlayerTile(player, map);
  var tileCol = location.x;
  var tileRow = location.y;

  return collidesWith(tileRow + 1, tileCol, map);
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
