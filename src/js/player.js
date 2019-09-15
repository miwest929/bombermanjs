const DirectionState = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RGHT: "RIGHT",
  STILL: "STILL"
};

const PlayerState = {
  ALIVE: "ALIVE",
  DIEING: "DIEING",
  DEAD: "DEAD"
};

const PowerUp = {
  ACCELERATOR: "ACCELERATOR",
  EXPLOSION_EXPANDER: "EXPLOSION_EXPANDER",
  EXTRA_BOMB: "EXTRA_BOMB",
  MAXIMUM_EXPLOSION: "MAXIMUM_EXPLOSION",
  SKULL: "SKULL"
};

MOVE_ANIMATION_SPEED = 100;

class Player {
  constructor(x, y, gameManager) {
    this.gameManager = gameManager;
    this.x = x;
    this.y = y;
    this.baseSpeed = 6;
    this.directionState = DirectionState.STILL
    this.playerState = PlayerState.ALIVE;

    this.createAnimations();
    this.animation = this.rightAnim;
    this.velocity = {x: 0, y: 0};
    this.lives = 1;

    // power up attributes
    this.maxBombsAtOnce = 1;
    this.bombStrength = 1;
    this.bombBlastLength = 1;
    this.currentBombLaidCount = 0;

    this.gameManager.registerObserver("bomb_exploded", () => {
      this.currentBombLaidCount -= 1;
    });
  }

  deathSequenceFinished() {
    this.playerState = PlayerState.DEAD;
    this.lives -= 1;

    if (this.lives <= 0) {
      this.gameManager.endGame();
    }
  }

  performMove() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  createAnimations() {
    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x+5, this.y-16, 16, 32);
    };
    let onEachFn = () => { this.performMove() };

    this.upAnim = createAnimation(moveUp, renderFn, onEachFn);
    this.rightAnim = createAnimation(moveRight, renderFn, onEachFn);
    this.downAnim = createAnimation(moveDown, renderFn, onEachFn);
    this.leftAnim = createAnimation(moveLeft, renderFn, onEachFn);
    this.deathAnim = createAnimation(PLAYER_DEATH, renderFn, onEachFn);
    this.deathAnim.onFinished = () => { this.deathSequenceFinished() };
  }

  changePlayerAnimation(newAnimation, speedInMs, shouldLoop) {
    if (this.animation) {
      this.animation.stop();
    }

    this.animation = newAnimation;
    if (shouldLoop) {
      this.animation.play(speedInMs);
    } else {
      this.animation.play(speedInMs);
    }
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
    }
  }

  consumePowerUp(powerUp) {
    console.log(`CONSUMED POWERUP ${powerUp}`);
    if (powerUp === PowerUp.ACCELERATOR) {
      this.baseSpeed += 0.5;
    } else if (powerUp === PowerUp.EXPLOSION_EXPANDER) {
      this.bombStrength += 1;
    } else if (powerUp === PowerUp.EXTRA_BOMB) {
      this.maxBombsAtOnce += 1;
    } else if (powerUp === PowerUp.MAXIMUM_EXPLOSION) {
      this.bombStrength = 5;
    } else if (powerUp === PowerUp.SKULL) {
    }
  }

  destroy(gameManager) {
    if (this.playerState === PlayerState.ALIVE) {
      this.changePlayerAnimation(this.deathAnim, 200, false);
      this.playerState = PlayerState.DIEING;
    }
  }

  update(gameManager) {
    if (this.playerState === PlayerState.DEAD) {
      return false;
    } else if (this.playerState === PlayerState.DIEING) {
      return true;
    }

    let that = this;
    let collisionFn = (gameManager, obj) => {
      if (obj.powerUp) {
        that.consumePowerUp(obj.powerUp);
      } else {
        that.still();
      }
    };
    if (gameManager.checkCollisionWith("player", this.velocity, collisionFn)) {
      this.still();
    }

    return true;
  }

  // TODO: It's weird that the Player object decides what the bomb's objectId is
  bombObjectId() {
    return `bomb.${Math.floor(this.x)}.${Math.floor(this.y)}`;
  }

  layBomb() {
    if (this.currentBombLaidCount < this.maxBombsAtOnce) {
      this.currentBombLaidCount += 1;

      let x = this.x + (BLOCK_WIDTH / 2);
      let y = this.y + (BLOCK_HEIGHT / 2);

      // HACK to get the bomb to be neatly placed in middle of cell
      x = gameManager.adjustedX(x);
      y = gameManager.adjustedY(y);
      let bomb = new Bomb(x, y, this.bombStrength, this.gameManager);
      gameManager.placeObject(bomb, this.bombObjectId(), x, y);
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
    if (this.animation.inProgress()) {
      return;
    }

    this.changePlayerAnimation(this.upAnim, MOVE_ANIMATION_SPEED, true);
    this.directionState = DirectionState.UP;
    this.velocity.x = 0
    this.velocity.y = -this.baseSpeed;
  }

  moveDown() {
    if (this.animation.inProgress()) {
      return;
    }

    this.changePlayerAnimation(this.downAnim, MOVE_ANIMATION_SPEED, true);
    this.directionState = DirectionState.DOWN;
    this.velocity.x = 0
    this.velocity.y = this.baseSpeed;
  }

  moveLeft() {
    if (this.animation.inProgress()) {
      return;
    }
    this.changePlayerAnimation(this.leftAnim, MOVE_ANIMATION_SPEED, true);
    this.directionState = DirectionState.LEFT;
    this.velocity.y = 0;
    this.velocity.x = -this.baseSpeed;
  }

  moveRight() {
    if (this.animation.inProgress()) {
      return;
    }
    this.changePlayerAnimation(this.rightAnim, MOVE_ANIMATION_SPEED, true);
    this.directionState = DirectionState.RIGHT;
    this.velocity.y = 0;
    this.velocity.x = this.baseSpeed;
  }

  boundingBox() {
    return new BoundingBox(this.x+5, this.y+1, 16, 15);//BLOCK_WIDTH-1, BLOCK_HEIGHT-1);
  }

  render(context) {
    this.animation.render(context, this.x, this.y);
  }
}
