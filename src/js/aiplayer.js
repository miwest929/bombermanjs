class AiPlayer extends Player {
  constructor (x, y, gameManager) {
    super(x, y, gameManager);
    this.directionState = DirectionState.UP;
    this.velocity = {x: 0, y: -this.baseSpeed};
    this.moveFn = this.moveRandomly();
  }

  createAnimations() {
    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x+5, this.y-16, 16, 23);
    };
    let onEachFn = () => { this.performMove() };
    this.upAnim = createAnimation(aiMoveUp, renderFn, onEachFn);
    this.rightAnim = createAnimation(aiMoveRight, renderFn, onEachFn);
    this.downAnim = createAnimation(aiMoveDown, renderFn, onEachFn);
    this.leftAnim = createAnimation(aiMoveLeft, renderFn, onEachFn);
    this.deathAnim = createAnimation(aiDeath, renderFn, onEachFn);
    this.deathAnim.onFinished = () => { this.deathSequenceFinished() };
  }

  moveRandomly() {
    let rndMove = Math.floor(Math.random() * 4) + 1;
    let moveMap = {
      1: this.moveUp,
      2: this.moveDown,
      3: this.moveLeft,
      4: this.moveRight
    };

    return moveMap[rndMove];
  }

  endGame() {
    this.gameManager.endGameWon();
  }

  update(gameManager) {
    if (this.playerState === PlayerState.DEAD) {
      return false;
    } else if (this.playerState === PlayerState.DIEING) {
      this.velocity = {x: 0, y: 0};
      this.moveFn = () => {};
      return true;
    }

    let collisionFn = (gameManager, obj) => {
      if (isPowerUp(obj)) {
        this.consumePowerUp(obj);
      } else {
        this.moveFn = this.moveRandomly();
      }
    };

    if (gameManager.checkCollisionWith(this.objectId, this.velocity, collisionFn)) {
      this.still();
    }

    this.moveFn();
    return true;
  }

  handleKeyInput(keyboard) {
  }
}
