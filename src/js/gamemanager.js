/*
The gameManager stores the map
each cell in the map references an object registered with the GameManager
*/
let blankMap = (cols, rows) => {
  let newMap = [];

  for(let rowIdx = 0; rowIdx < rows; rowIdx++) {
    let newRow = [];
    for(let colIdx = 0; colIdx < cols; colIdx++) { newRow.push(' '); }

    newMap.push(newRow);
  }

  return newMap;
}

/*
  Every registered game object is expected to implement the following interface:
    - update
    - render
    - boundingBox
    - destroy [logic for destroying the object. ends in unregistering from manager]
*/
class GameManager {
  constructor(ctx, params) {
    this.ctx = ctx;
    this.objects = {};
    this.events = [];
    this.tiles = {};

    // Configurables
    this.debugMode = params['debug'] === 'true';
    this.powerProb = parseFloat(params['powerprob'] || "0.3");
    this.tilesProb = parseFloat(params['tilesprob'] || "0.45");

    // initially the map is empty
    this.mapRows = 0;
    this.mapCols = 0;
    this.map = [];

    this.observers = {};
    this.isGameOver = false;

    this.registerObserver("block_destroyed", (props) => {
      let powerUp = createRandomPowerUp(this, props.x, props.y);
      if (powerUp) {
        let key = this.createRandomObjectId('powerup');
        this.placeObject(powerUp, key, props.x, props.y);
      }
    });
  }

  createRandomObjectId(prefix) {
    let rnd = Math.floor(Math.random() * 9999) + 1000;
    let key = `${prefix}.${rnd}`;
    while (key in this.objects) {
      rnd = Math.floor(Math.random() * 9999) + 1000;
      key = `${prefix}.${rnd}`;
    }

    return key;
  }

  registerMap(map, tiles) {
    this.mapRows = map.rows;
    this.mapCols = map.cols;

    let grid = map.map;
    this.map = blankMap(map.cols, map.rows);
    for(var ri = 0, curY = 0; ri < map.rows; ri++, curY += BLOCK_WIDTH) {
      for(var ci = 0, curX = 0; ci < map.cols; ci++, curX += BLOCK_HEIGHT) {
         let block = null;
         if (grid[ri][ci] == 'B') {
           block = new Block(this, curX, curY);
         } else if (grid[ri][ci] == 'HB') {
           block = new HardBlock(this, curX, curY);
         }

         if (block) {
           let key = "block." + ri + "." + ci;
           this.register(block, key);
           this.map[ri][ci] = key;
         }
      }
    }
  }

  placeObject(obj, key, x, y) {
    let row = Math.floor(y / BLOCK_HEIGHT);
    let col = Math.floor(x / BLOCK_WIDTH);
    this.map[row][col] = key;
    this.register(obj, key);
  }

  // adjust given x to be align with closest col
  adjustedX(x) {
    return Math.floor(x / BLOCK_WIDTH) * BLOCK_WIDTH;
  }

  // adjust given y to be align with closest row
  adjustedY(y) {
    return Math.floor(y / BLOCK_HEIGHT) * BLOCK_HEIGHT;
  }

  publish(event_name, props) {
    props = props || {};
    let observers = this.observers[event_name] || [];
    for (let i = 0; i < observers.length; i++) {
      observers[i](props);
    }
  }

  registerObserver(event_name, notifyFn) {
    if (!this.observers[event_name]) {
      this.observers[event_name] = [notifyFn];
    } else {
      this.observers[event_name].push(notifyFn);
    }
  }

  register(gameObject, key) {
    gameObject.objectId = key;
    this.objects[key] = gameObject;
  }

  unregister(key) {
    this.objects[key].objectId = null;
    delete this.objects[key];
  }

  registerEvent(happensFn, consequenceFn) {
    this.events.push({
      happensFn: happensFn,
      consequenceFn: consequenceFn
    });
  }

  getObject(key) {
    return this.objects[key];
  }

  updateWorld() {
    for (let key in this.objects) {
      if (this.objects[key]) {
        let objStatus = this.objects[key].update(this);
        if (!objStatus) {
          this.unregister(key);
        }
      }
    }
  }

  renderWorld(ctx) {
    for(var ri = 0, curY = 0; ri < this.mapRows; ri++, curY += BLOCK_WIDTH) {
      for(var ci = 0, curX = 0; ci < this.mapCols; ci++, curX += BLOCK_HEIGHT) {
        let key = this.map[ri][ci];
        if (key !== ' ' && this.objects[key]) {
          this.objects[key].render(ctx); //, curX, curY);
        } else {
          this.map[ri][ci] = ' ';
        }
      }
    }

    if (this.objects['player']) {
      this.objects['player'].render(ctx);
    }

    if (this.isGameOver) {
      this.renderGameOverDialog();
    }
  }

  renderGameOverDialog() {
    let dialogWidth = 300;
    let dialogHeight = 100;
    let borderWidth = 5;
    let upperLeftX = centerX-(dialogWidth/2);
    let upperLeftY = centerY-(dialogHeight/2);

    ctx.fillStyle = "white";
    ctx.fillRect(upperLeftX, upperLeftY, dialogWidth, dialogHeight);

    ctx.beginPath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = "black";
    ctx.rect(upperLeftX, upperLeftY, dialogWidth, dialogHeight);
    ctx.stroke();

    ctx.font = "30px tahoma";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", upperLeftX + 65, upperLeftY+45);
    ctx.font = "15px tahoma";
    ctx.fillStyle = "red";
    ctx.fillText("Press ENTER to continue", upperLeftX + 65, upperLeftY+65);
  }

  executeEvents() {
    this.events.forEach((e) => {
      if (e.happensFn(this)) {
        e.consequenceFn(this);
      }
    });
  }

  addTiles(key, tiles) {
    this.tiles[key] = tiles;
  }

  getTiles(key) {
    return this.tiles[key];
  }

  // reset every registered game object
  reset() {
    for (let key in this.objects) {
      let object = this.objects[key];

      if (object.constructor === Array) {
        object.forEach((obj) => {
          obj.reset();
        });
      } else {
        object.reset();
      }
    }
  }

  // Did object with key 'objKey' collide with
  // any other object?
  checkCollisionWith(objKey, velocity, collisionFn) {
    let _collisionFn = collisionFn || (() => {})
    let hasCollided = false;

    for (let otherKey in this.objects) {
      if (objKey === otherKey) {
        continue;
      }

      if (this.checkForCollision(objKey, otherKey, velocity)) {
        _collisionFn(this, this.objects[otherKey]);
        hasCollided = true;
      }
    }

    return hasCollided;
  }

  // Did the two specified objects collide with each other?
  // 'velocity' argument is for gameObjectOne.
  checkForCollision(gameObjectOneKey, gameObjectTwoKey, velocity) {
    let gameObjectOne = this.objects[gameObjectOneKey];
    let gameObjectTwo = this.objects[gameObjectTwoKey];

    if (!(gameObjectOne && gameObjectTwo)) {
      console.log(`[checkForCollision] Warning: Game object with key of either '${gameObjectOneKey}' or '${gameObjectTwoKey}' does not exist.`);
      return;
    }

    let bbOne = gameObjectOne.boundingBox(); // must be a scalar
    // a null boundingBox indicates that object shouldn't
    // collide with anything
    if (!bbOne) {
      return;
    }

    let bbTwo = gameObjectTwo.boundingBox(); // can be an array of BoundingBox
    // a null boundingBox indicates that object shouldn't
    // collide with anything
    if (!bbTwo) {
      return;
    }

    let bbOneArr;
    if (bbOne.constructor === Array) {
      bbOneArr = bbOne;
    } else {
      bbOneArr = [bbOne];
    }

    let bbTwoArr;
    if (bbTwo.constructor === Array) {
      bbTwoArr = bbTwo;
    } else {
      bbTwoArr = [bbTwo];
    }

    // Take current velocity into account when checking for collisions.
    for (let idx = 0; idx < bbOneArr.length; idx++) {
      bbOneArr[idx] = bbOneArr[idx].offsetBy(velocity);
    }

    for (let bbOneIndex = 0; bbOneIndex < bbOneArr.length; bbOneIndex++) {
      for (let bbTwoIndex = 0; bbTwoIndex < bbTwoArr.length; bbTwoIndex++) {
        let bbOne = bbOneArr[bbOneIndex];
        let bbTwo = bbTwoArr[bbTwoIndex];

        // Check if BoundingBox is invalid so we don't get a false positive.
        if (isNaN(bbTwo.x) || isNaN(bbTwo.y) || isNaN(bbTwo.width) || isNaN(bbTwo.height)) {
          continue;
        }

        if (this.checkBoundingBoxCollision(bbOne, bbTwo)) {
          if (this.debugMode) {
            if (gameObjectOneKey === 'player') {
              bbOne.log(gameObjectOneKey);
              bbTwo.log(gameObjectTwoKey);
            }

            ctx.fillStyle = 'red';
            ctx.fillRect(bbOne.x, bbOne.y, bbOne.width, bbOne.height);

            ctx.fillStyle = 'green';
            ctx.fillRect(bbTwo.x, bbTwo.y, bbTwo.width, bbTwo.height);
          }

          return true;
        }
      }
    }

    return false;
  }

  checkBoundingBoxCollision(bbOne, bbTwo) {
    let xLeftOne = bbOne.x;
    let xLeftTwo = bbTwo.x;
    let xRightOne = bbOne.x + bbOne.width;
    let xRightTwo = bbTwo.x + bbTwo.width;

    let yTopOne = bbOne.y;
    let yTopTwo = bbTwo.y;
    let yBottomOne = bbOne.y + bbOne.height;
    let yBottomTwo = bbTwo.y + bbTwo.height;

    // a is left of b
    if (xRightOne < xLeftTwo) {
      return false;
    }

    // a is right of b
    if (xLeftOne > xRightTwo) {
      return false;
    }

    // a is above b
    if (yBottomOne < yTopTwo) {
      return false;
    }

    // a is below b
    if (yTopOne > yBottomTwo) {
      return false;
    }

    return true; // boxes overlap
  }

  handleKeyInput(keyboard) {
    if (keyboard.isPressed('enter')) {
      if (this.isGameOver) {
        this.resetLevel();
      }
    } else if (keyboard.wasReleasedRecently('d')) {
      this.debugMode = !this.debugMode;
    }
  }

  endGame() {
    this.isGameOver = true;
  }

  resetLevel() {
    // TODO: doesn't work. On reset Player sprite is rendered is wrong position
    let map = new Map(COLS_MAP, ROWS_MAP, blockTiles);
    this.registerMap(map);
    let emptyPos = map.findEmpty();
    let player = new Player(emptyPos.x, emptyPos.y, this);
    gameManager.register(player, "player");
    this.isGameOver = false;
  }
}

class BoundingBox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  offsetBy(velocity) {
    this.x += velocity.x;
    this.y += velocity.y;

    return this;
  }

  log(prefix) {
    console.log(`${prefix}: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`);
  }
}
