var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var centerX = (canvas.width / 2);
var centerY = (canvas.height / 2);
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

var spritesRepo = new SpriteRepository([
  './src/img/bomberman.png',
  './src/img/stages.png'
]);

let bombermanImg = spritesRepo.fetch('bomberman').image
var bombermanTiles = {
  "up": [
    new Tile(bombermanImg, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 16, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 32, 0, BLOCK_WIDTH, BLOCK_HEIGHT)
  ],
  "right": [
    new Tile(bombermanImg, 0, 32, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 16, 32, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 32, 32, BLOCK_WIDTH, BLOCK_HEIGHT)
  ],
  "down": [
    new Tile(bombermanImg, 0, 64, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 16, 64, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 32, 64, BLOCK_WIDTH, BLOCK_HEIGHT)
  ],
  "left": [
    new Tile(bombermanImg, 0, 96, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 16, 96, BLOCK_WIDTH, BLOCK_HEIGHT),
    new Tile(bombermanImg, 32, 96, BLOCK_WIDTH, BLOCK_HEIGHT)
  ]
};

var blockTiles = {
  "B": new Tile(spritesRepo.fetch('stages').image, 0, 14, BLOCK_WIDTH, BLOCK_HEIGHT),
  "HB": new Tile(spritesRepo.fetch('stages').image, 85, 14, BLOCK_WIDTH, BLOCK_HEIGHT)
};

let gameManager = new GameManager(ctx, false);

// map is 50x40 tiles large
console.log("creating new Map");
let COLS_MAP = 35;
let ROWS_MAP = 25;
let map = new Map(COLS_MAP, ROWS_MAP, blockTiles);
gameManager.register(map, "map");

var emptyPos = map.findEmpty();
var player = new Player(bombermanTiles, emptyPos.x, emptyPos.y, emptyPos.tileX, emptyPos.tileY);
gameManager.register(player, "player");
var tiles = bombermanTiles['up'];
var collideTileX = undefined;
var collideTileY = undefined;

var main = function() {
  render();
  update();

  window.requestAnimationFrame(main);
}

var render = function() {
  renderBackground();
  gameManager.renderWorld(ctx);
}

var update = function() {
  player.handleKeyInput(keys);
  player.update(gameManager);
}

main();
