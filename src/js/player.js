const DirectionState = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RGHT: "RIGHT",
  STILL: "STILL"
};

class Player {
  constructor(x, y, gameManager) {
    this.gameManager = gameManager;
    this.x = x;
    this.y = y;
    this.baseSpeed = 1.0;
    this.directionState = DirectionState.STILL

    this.createAnimations();
    this.animation = this.rightAnim;
    this.velocity = {x: 0, y: 0};

    // power up attributes
    this.maxBombsAtOnce = 1;
    this.bombStrength = 1;
    this.bombBlastLength = 1;
    this.currentBombLaidCount = 0;

    this.gameManager.registerObserver("bomb_exploded", () => {
      this.currentBombLaidCount -= 1;
    });
  }

  createAnimations() {
    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 32);
    }
    this.upAnim = createAnimation(moveUp, renderFn, true);
    this.rightAnim = createAnimation(moveRight, renderFn, true);
    this.downAnim = createAnimation(moveDown, renderFn, true);
    this.leftAnim = createAnimation(moveLeft, renderFn, true);
  }

  changePlayerAnimation(newAnimation) {
    if (this.animation) {
      this.animation.stop();
    }

    this.animation = newAnimation;
    this.animation.play(125);
  }

  handleKeyInput(keyboard) {
    if (keyboard.isPressed('up')) {
      this.moveUp();
    } else if (keyboard.isPressed('down')) {
      this.moveDown();
    } else if (keyboard.isPressed('left')) {
      this.moveLeft();
    } else if (keyboard.isPressed('right')) {
      this.moveRight();
    } else if (keyboard.wasReleasedRecently('space')) {
      this.layBomb();
    } else {
      this.still();
    }
  }

  update(gameManager) {
    if (gameManager.checkCollisionWith("player", this.velocity)) {
      this.still();
    } else {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }

    return true;
  }

  layBomb() {
    if (this.currentBombLaidCount < this.maxBombsAtOnce) {
      this.currentBombLaidCount += 1;
      let bomb = new Bomb(this.x, this.y, this.bombStrength, this.gameManager);
      let key = "bomb." + this.x + "." + this.y;
      gameManager.placeObject(bomb, key, this.x + (BLOCK_WIDTH/2), this.y + (BLOCK_HEIGHT/2));
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
  }

  moveDown() {
    if (this.directionState === DirectionState.DOWN) {
      return;
    }

    this.changePlayerAnimation(this.downAnim);
    this.directionState = DirectionState.DOWN;
    this.velocity.x = 0
    this.velocity.y = this.baseSpeed;
  }

  moveLeft() {
    if (this.directionState === DirectionState.LEFT) {
      return;
    }
    this.changePlayerAnimation(this.leftAnim);
    this.directionState = DirectionState.LEFT;
    this.velocity.y = 0;
    this.velocity.x = -this.baseSpeed;
  }

  moveRight() {
    if (this.directionState === DirectionState.RIGHT) {
      return;
    }
    this.changePlayerAnimation(this.rightAnim);
    this.directionState = DirectionState.RIGHT;
    this.velocity.y = 0;
    this.velocity.x = this.baseSpeed;
  }

  boundingBox() {
    return new BoundingBox(this.x+(BLOCK_WIDTH/8), this.y+(BLOCK_HEIGHT/8), BLOCK_WIDTH/4*3, BLOCK_HEIGHT/4*3);
  }

  render(context) {
    this.animation.render(context, this.x, this.y);
  }
}
