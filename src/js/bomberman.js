var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var centerX = (canvas.width / 2);
var centerY = (canvas.height / 2);
let gameManager = new GameManager(ctx, true);

class Block {
  constructor(manager, x, y) {
    this.gameManager = manager;
    this.x = x;
    this.y = y;
    this.shouldDestroy = false;

    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 32);
    }
    this.destroyAnim = createAnimation(blockDestroy, renderFn, false);
  }

  destroy() {
    this.shouldDestroy = true;
  }

  update() {
    return true;
  }

  render(ctx) {
    if (this.shouldDestroy) {
      this.destroyAnim.render(ctx);
    } else {
      blockTile.renderAt(ctx, this.x, this.y, 16, 16);
    }
  }

  boundingBox() {
    return new BoundingBox(this.x, this.y, 19, 19);
  }
}

class HardBlock {
  constructor(manager, x, y) {
    this.gameManager = manager;
    this.x = x;
    this.y = y;
  }

  render(ctx) {
    hardBlock.renderAt(ctx, this.x, this.y, 16, 16);
  }

  update() {
    return true;
  }

  boundingBox() {
    return new BoundingBox(this.x, this.y, 19, 19);
  }
}

class KeyManager {
  constructor() {
    // every key has following attrs: state, releasedLastAt
    this.keys = {};
  }

  keyCode(name) {
    let keyNameMap = {
      "up": "38",
      "down": "40",
      "left": "37",
      "right": "39",
      "space": "32"
    };

    return keyNameMap[name];
  }

  wasReleasedRecently(key, millisecondsAgo) {
    let code = this.keyCode(key);
    if (!this.keys[code]) {
      return false;
    }

    // key is still pressed (hasn't been released yet)
    if (this.keys[code].state) {
      return false;
    }

    return (this.timeNowInMilliseconds() - this.keys[code].lastReleasedAt) <= millisecondsAgo;
  }

  isPressed(key) {
    let code = this.keyCode(key);
    if (!this.keys[code]) {
      return false;
    }

    return this.keys[code].state;
  }

  processKeyDownEvent(e) {
    e = e || window.event;

    if (!(e.keyCode in this.keys)) {
      this.keys[e.keyCode] = {state: true, lastReleasedAt: null};
    } else {
      this.keys[e.keyCode].state = true;
      this.keys[e.keyCode].lastReleasedAt = null;
    }
  }

  processKeyUpEvent(e) {
    e = e || window.event;

    if (!(e.keyCode in this.keys)) {
      this.keys[e.keyCode] = {state: false, lastReleasedAt: this.timeNowInMilliseconds()};
    } else {
      this.keys[e.keyCode].state = false;
      this.keys[e.keyCode].lastReleasedAt = this.timeNowInMilliseconds()
    }
  }

  timeNowInMilliseconds() {
    return new Date().getTime();
  }
}
keyboard = new KeyManager();
document.onkeydown = (e) => { keyboard.processKeyDownEvent(e); }
document.onkeyup = (e) => { keyboard.processKeyUpEvent(e); }

var renderBackground = function() {
  ctx.fillStyle = "rgb(91, 127, 71)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var blockTiles = {
  "B": new Tile(spritesRepo.fetch('stages').image, 0, 14, BLOCK_WIDTH, BLOCK_HEIGHT),
  "HB": new Tile(spritesRepo.fetch('stages').image, 85, 14, BLOCK_WIDTH, BLOCK_HEIGHT)
};
gameManager.addTiles("blocks", blockTiles);

// map is 50x40 tiles large
console.log("creating new Map");
let COLS_MAP = 35;
let ROWS_MAP = 25;
let map = new Map(COLS_MAP, ROWS_MAP, blockTiles);
gameManager.registerMap(map, blockTiles);

var emptyPos = map.findEmpty();
var player = new Player(emptyPos.x, emptyPos.y, gameManager);
gameManager.register(player, "player");

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
  player.handleKeyInput(keyboard);
  gameManager.updateWorld();
  player.update(gameManager);
}

main();
