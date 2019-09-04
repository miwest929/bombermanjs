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

class GameManager {
  constructor(ctx, debugMode) {
    this.ctx = ctx;
    this.objects = {};
    this.events = [];
    this.tiles = {};
    this.debugMode = debugMode;

    // initially the map is empty
    this.mapRows = 0;
    this.mapCols = 0;
    this.map = [];
  }

  registerMap(map, tiles) {
    this.mapRows = map.rows;
    this.mapCols = map.cols;

    let grid = map.map;
    this.map = blankMap(map.cols, map.rows);
    for(var ri = 0, curY = 0; ri < map.rows; ri++, curY += BLOCK_WIDTH) {
      for(var ci = 0, curX = 0; ci < map.cols; ci++, curX += BLOCK_HEIGHT) {
         let tile = tiles['HB'];
         if (grid[ri][ci] == 'B') {
           tile = tiles['B'];
         }

         let block = new Block(tile, curX, curY);
         if (grid[ri][ci] != ' ') {
           let key = "block." + ri + "." + ci;
           this.register(block, key);
           this.map[ri][ci] = key;
         }
      }
    }
  }

  placeObject(obj, key, x, y) { //row, col) {
    let row = Math.floor(y / BLOCK_HEIGHT);
    let col = Math.floor(x / BLOCK_WIDTH);
    this.register(obj, key);
    this.map[row][col] = key;
  }

  register(gameObject, key) {
    this.objects[key] = gameObject;
  }

  registerCollection(gameObject, collectionKey) {
    this.objects[collectionKey] = this.objects[collectionKey] || [];

    this.objects[collectionKey].push(gameObject);
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

  renderWorld(ctx) {
    for(var ri = 0, curY = 0; ri < this.mapRows; ri++, curY += BLOCK_WIDTH) {
      for(var ci = 0, curX = 0; ci < this.mapCols; ci++, curX += BLOCK_HEIGHT) {
        let key = this.map[ri][ci];
        if (key !== ' ') {
          this.objects[key].render(ctx); //, curX, curY);
        }
      }
    }

    this.objects['player'].render(ctx);
    /*for (let key in this.objects) {
      let object = this.objects[key];

      if (object.constructor === Array) {
        object.forEach((o) => {
          o.render(ctx);
        });
      } else {
        object.render(ctx);
      }
    }*/
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

  checkForCollisionInCollection(gameObjectOneKey, gameObjectCollectionKey, collectionIndex, velocity) {
    let gameObjectCollection = this.objects[gameObjectCollectionKey];
    let gameObjectOne = this.objects[gameObjectOneKey];
    let gameObjectTwo = gameObjectCollection[collectionIndex];

    let bbOne = gameObjectOne.boundingBox(); // must be a scalar
    let bbTwo = gameObjectTwo.boundingBox(); // can be an array of BoundingBox

    bbOne.offsetBy(velocity);

    if (this.checkBoundingBoxCollision(bbOne, bbTwo)) {
      return true;
    }

    return false;
  }

  checkCollisionWith(objKey, velocity) {
    for (let otherKey in this.objects) {
      if (objKey === otherKey) {
        continue;
      }

      if (this.checkForCollision(objKey, otherKey, velocity)) {
        return true;
      }
    }

    return false;
  }

  // 'velocity' argument is for gameObjectOne.
  checkForCollision(gameObjectOneKey, gameObjectTwoKey, velocity) {
    let gameObjectOne = this.objects[gameObjectOneKey];
    let gameObjectTwo = this.objects[gameObjectTwoKey];

    if (!(gameObjectOne && gameObjectTwo)) {
      console.log(`[checkForCollision] Warning: Game object with key of either '${gameObjectOneKey}' or '${gameObjectTwoKey} does not exist.'`);
      return;
    }

    let bbOne = gameObjectOne.boundingBox(); // must be a scalar

    if (bbOne.constructor !== BoundingBox) {
      console.log("[checkForCollision] Warning: bbOne must be an instance of BoundingBox.");
      return;
    }

    // Take current velocity into account when checking for collisions.
    bbOne.offsetBy(velocity);

    let bbTwo = gameObjectTwo.boundingBox(); // can be an array of BoundingBox

    let bbTwoArr;
    if (bbTwo.constructor === Array) {
      bbTwoArr = bbTwo;
    } else {
      bbTwoArr = [bbTwo];
    }

    for (let bbTwoIndex = 0; bbTwoIndex < bbTwoArr.length; bbTwoIndex++) {
      let bbTwo = bbTwoArr[bbTwoIndex];

      // Check if BoundingBox is invalid so we don't get a false positive.
      if (isNaN(bbTwo.x) || isNaN(bbTwo.y) || isNaN(bbTwo.width) || isNaN(bbTwo.height)) {
        continue;
      }

      if (this.checkBoundingBoxCollision(bbOne, bbTwo)) {
        if (this.debugMode) {
          ctx.fillStyle = 'red';
          ctx.fillRect(bbOne.x, bbOne.y, bbOne.width, bbOne.height);

          ctx.fillStyle = 'green';
          ctx.fillRect(bbTwo.x, bbTwo.y, bbTwo.width, bbTwo.height);
        }

        return true;
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
}
