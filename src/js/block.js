const BlockState = {
  NORMAL: "NORMAL",
  DISINTEGRATE: "DISINTEGRATE",
  DEAD: "DEAD",
  POWERUP: "POWERUP",
};

class Block {
  constructor(manager, x, y) {
    this.gameManager = manager;
    this.x = x;
    this.y = y;
    this.blockState = BlockState.NORMAL;
    this.powerUp = null;
    this.powerUpTile = null;

    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 16);
    }
    let disintegrateFn = () => {
      if (randomWithBias(0.3)) {
        this.blockState = BlockState.POWERUP;
        let randomPowerUp = Math.floor(Math.random() * 5);
        if (randomPowerUp === 0) {
          this.powerUp = PowerUp.ACCELERATOR;
          this.powerUpTile = accelerator;
        } else if (randomPowerUp === 1) {
          this.powerUp = PowerUp.EXPLOSION_EXPANDER;
          this.powerUpTile = explosionExpander;
        } else if (randomPowerUp === 2) {
          this.powerUp = PowerUp.EXTRA_BOMB;
          this.powerUpTile = extraBomb;
        } else if (randomPowerUp === 3) {
          this.powerUp = PowerUp.MAXIMUM_EXPLOSION;
          this.powerUpTile = maximumExplosion;
        } else if (randomPowerUp === 4) {
          this.powerUp = PowerUp.SKULL;
          this.powerUpTile = skull;
        }
      } else {
        this.blockState = BlockState.DEAD;
      }
    };
    this.destroyAnim = createAnimation(blockDestroy, renderFn, false);
    this.destroyAnim.onFinished = disintegrateFn;
  }

  destroy() {
    if (this.blockState !== BlockState.DISINTEGRATE) {
      this.blockState = BlockState.DISINTEGRATE;
      this.destroyAnim.play(125);
    }
  }

  update() {
    if (this.blockState == BlockState.DEAD) {
      return false;
    }

    return true;
  }

  render(ctx) {
    if (this.blockState === BlockState.DISINTEGRATE) {
      this.destroyAnim.render(ctx);
    } else if (this.blockState == BlockState.POWERUP) {
      this.powerUpTile.renderAt(ctx, this.x, this.y, 16, 16);
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

  // object that refuse to die should return false
  destroy() {
  }

  update() {
    return true;
  }

  boundingBox() {
    return new BoundingBox(this.x, this.y, 19, 19);
  }
}
