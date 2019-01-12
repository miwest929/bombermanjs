const DirectionState = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RGHT: "RIGHT",
  STILL: "STILL"
};

class Player {
  constructor(tiles, x, y, tileCol, tileRow) {
    this.tiles = tiles;
    this.x = x;
    this.y = y;
    this.tileRow = tileRow;
    this.tileCol = tileCol;
    this.baseSpeedIncrement = 0.16665;
    this.baseSpeed = 1.3335;
    this.directionState = DirectionState.STILL

    let renderFn = (tiles, context, x, y) => {
      tiles[0].renderAt(context, x, y, 16, 32);
    }

    let upMove1 = new Frame([tiles["up"][0]], renderFn);
    let upMove2 = new Frame([tiles["up"][1]], renderFn);
    let upMove3 = new Frame([tiles["up"][2]], renderFn);
    this.upAnim = new Animation([upMove1, upMove2, upMove3], true);

    let rightMove1 = new Frame([tiles["right"][0]], renderFn);
    let rightMove2 = new Frame([tiles["right"][1]], renderFn);
    let rightMove3 = new Frame([tiles["right"][2]], renderFn);
    this.rightAnim = new Animation([rightMove1, rightMove2, rightMove3], true);

    let downMove1 = new Frame([tiles["down"][0]], renderFn);
    let downMove2 = new Frame([tiles["down"][1]], renderFn);
    let downMove3 = new Frame([tiles["down"][2]], renderFn);
    this.downAnim = new Animation([downMove1, downMove2, downMove3], true);

    let leftMove1 = new Frame([tiles["left"][0]], renderFn);
    let leftMove2 = new Frame([tiles["left"][1]], renderFn);
    let leftMove3 = new Frame([tiles["left"][2]], renderFn);
    this.leftAnim = new Animation([leftMove1, leftMove2, leftMove3], true);

    this.animation = this.rightAnim;
    this.velocity = {x: 0, y: 0};
  }

  tileColIndex() {
    return Math.floor(this.tileCol);
  }

  tileRowIndex() {
    return Math.floor(this.tileRow);
  }

  changePlayerAnimation(newAnimation) {
    if (this.animation) {
      this.animation.stop();
    }

    this.animation = newAnimation;
    this.animation.play(125);
  }

  handleKeyInput(keys) {
    if (keys['up']) {
      this.moveUp();
    } else if (keys['down']) {
      this.moveDown();
    } else if (keys['left']) {
      this.moveLeft();
    } else if (keys['right']) {
      this.moveRight();
    } else {
      this.still();
    }
  }

  update(gameManager) {
    if (gameManager.checkForCollision("player", "map", this.velocity)) {
      this.still();
    } else {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }

  still() {
    this.directionState = DirectionState.STILL;
    this.velocity.x = 0;
    this.velocity.y = 0;
    if (this.animation) {
      this.animation.stop();
    }
  }

  moveUp() {
    if (this.directionState === DirectionState.UP) {
      return;
    }

    this.changePlayerAnimation(this.upAnim);
    this.directionState = DirectionState.UP;
    this.velocity.x = 0
    this.velocity.y = -this.baseSpeed;
    //this.tileRow += -this.baseSpeedIncrement;
  }

  moveDown() {
    if (this.directionState === DirectionState.DOWN) {
      return;
    }

    this.changePlayerAnimation(this.downAnim);
    this.directionState = DirectionState.DOWN;
    this.velocity.x = 0
    this.velocity.y = this.baseSpeed;
    //this.tileRow += this.baseSpeedIncrement;
  }

  moveLeft() {
    if (this.directionState === DirectionState.LEFT) {
      return;
    }
    this.changePlayerAnimation(this.leftAnim);
    this.directionState = DirectionState.LEFT;
    this.velocity.y = 0;
    this.velocity.x = -this.baseSpeed;
    //this.tileCol += -this.baseSpeedIncrement;
  }

  moveRight() {
    if (this.directionState === DirectionState.RIGHT) {
      return;
    }
    this.changePlayerAnimation(this.rightAnim);
    this.directionState = DirectionState.RIGHT;
    this.velocity.y = 0;
    this.velocity.x = this.baseSpeed;
    //this.tileCol += this.baseSpeedIncrement;
  }

  boundingBox() {
    return new BoundingBox(this.x+(BLOCK_WIDTH/5), this.y+(BLOCK_HEIGHT/5), BLOCK_WIDTH/4*3, BLOCK_HEIGHT/4*3);
  }

  render(context) {
    this.animation.render(context, this.x, this.y);
  }
}
