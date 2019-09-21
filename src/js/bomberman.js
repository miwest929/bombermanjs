let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let centerX = (canvas.width / 2);
let centerY = (canvas.height / 2);
let NO_VELOCITY = {x: 0, y: 0};

let gameManager = new GameManager(ctx, getGameParameters());

let keyboard = new KeyManager();
document.onkeydown = (e) => { keyboard.processKeyDownEvent(e); }
document.onkeyup = (e) => { keyboard.processKeyUpEvent(e); }

let blockTiles = {
  "B": new Tile(spritesRepo.fetch('stages').image, 0, 14, BLOCK_WIDTH, BLOCK_HEIGHT),
  "HB": new Tile(spritesRepo.fetch('stages').image, 85, 14, BLOCK_WIDTH, BLOCK_HEIGHT)
};
gameManager.addTiles("blocks", blockTiles);

let COLS_MAP = 61;
let ROWS_MAP = 31;
let map = new Map(COLS_MAP, ROWS_MAP, blockTiles, gameManager.tilesProb);
gameManager.registerMap(map, blockTiles);

let emptyPos = map.findEmpty();
let player = new Player(emptyPos.x-4, emptyPos.y, gameManager);
gameManager.register(player); //, "player");

emptyPos = map.findEmpty();
let aiPlayer = new AiPlayer(emptyPos.x-4, emptyPos.y, gameManager);
gameManager.register(aiPlayer); //, "aiplayer.1");

let main = function() {
  renderFpsDisplay();
  let currentTime = performance.now();
  render();
  console.log(`render took ${performance.now() - currentTime} ms`);
  update();
  console.log(`update took ${performance.now() - currentTime} ms`);

  window.requestAnimationFrame(main);
}

let render = function() {
  renderBackground();
  gameManager.renderWorld(ctx);
}

let renderFpsDisplay = () => {
  let currentTime = performance.now();
  let fps = computeFps(currentTime);
  prevTime = currentTime;
  let fpsElement = document.getElementById("fps");
  fpsElement.innerHTML = `Frames Per Second = ${fps}`;
};

let update = function() {
  player.handleKeyInput(keyboard);
  gameManager.handleKeyInput(keyboard);
  gameManager.updateWorld();
  player.update(gameManager);
  aiPlayer.update(gameManager);
}

let prevTime = performance.now();
let computeFps = (currentTime) => {
  let fpsAsFloat = 1000 / (currentTime - prevTime);
  return Math.trunc(fpsAsFloat + 0.5);
};

main();
