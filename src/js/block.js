const BlockState = {
  NORMAL: "NORMAL",
  DISINTEGRATE: "DISINTEGRATE",
  DEAD: "DEAD",
};

const PowerUpState = {
  LIVE: "LIVE",
  HIDDEN: "HIDDEN", // power up is in process of disappearing (blinking)
  DISAPPEARED: "DISAPPEARED" // power up has expired
};

const PowerUpType = {
  ACCELERATOR: "ACCELERATOR",
  EXPLOSION_EXPANDER: "EXPLOSION_EXPANDER",
  EXTRA_BOMB: "EXTRA_BOMB",
  MAXIMUM_EXPLOSION: "MAXIMUM_EXPLOSION",
  SKULL: "SKULL"
};

let createRandomPowerUp = (manager, x, y) => {
  if (randomWithBias(manager.powerProb)) {
    let randomPowerUp = Math.floor(Math.random() * 5);
    if (randomPowerUp === 0) {
      return new PowerUp(manager, x, y, PowerUpType.ACCELERATOR);
    } else if (randomPowerUp === 1) {
      return new PowerUp(manager, x, y, PowerUpType.EXPLOSION_EXPANDER);
    } else if (randomPowerUp === 2) {
      return new PowerUp(manager, x, y, PowerUpType.EXTRA_BOMB);
    } else if (randomPowerUp === 3) {
      return new PowerUp(manager, x, y, PowerUpType.MAXIMUM_EXPLOSION);
    } else if (randomPowerUp === 4) {
      return new PowerUp(manager, x, y, PowerUpType.SKULL);
    }
  }

  return null;
};

class PowerUp {
  constructor(manager, x, y, powerUpType) {
    this.manager = manager;
    this.x = x;
    this.y = y;
    this.state = PowerUpState.LIVE;
    this.powerUpType = powerUpType;
    this.tile = this.getPowerUpTile(powerUpType);
    this.isDestroyed = false;

    this.age = 0; // how many 500ms has passed since this power up started existing
    this.ageCounter = setInterval(() => {
      this.age += 1;

      // after 5 seconds (age == 10) start disappearing act
      if (this.age === 10) {
        this.state = PowerUpState.HIDDEN;
      } else if (this.age === 12) {
        this.state = PowerUpState.LIVE;
      } else if (this.age === 14) {
        this.state = PowerUpState.HIDDEN;
      } else if (this.age === 15) {
        this.state = PowerUpState.LIVE;
      } else if (this.age === 16) {
        this.state = PowerUpState.HIDDEN;
      } else if (this.age === 17) {
        this.state = PowerUpState.LIVE;
      } else if (this.age === 18) {
        this.state = PowerUpState.HIDDEN;
      } else if (this.age > 18) {
        this.destroy();
      }
    }, 500);
  }

  destroy() {
    this.isDestroyed = true;
    this.state = PowerUpState.DISAPPEARED;
  }

  getPowerUpTile(powerUpType) {
    if (powerUpType === PowerUpType.ACCELERATOR) {
      return accelerator;
    } else if (powerUpType === PowerUpType.EXPLOSION_EXPANDER) {
      return explosionExpander;
    } else if (powerUpType  === PowerUpType.EXTRA_BOMB) {
      return extraBomb;
    } else if (powerUpType  === PowerUpType.MAXIMUM_EXPLOSION) {
      return maximumExplosion;
    } else if (powerUpType  === PowerUpType.SKULL) {
      return skull;
    } else {
      // invalid powerUp
      return null;
    }
  }

  update(manager) {
    return !this.isDestroyed;
  }

  render(ctx) {
    if (this.state === PowerUpState.LIVE) {
      this.tile.renderAt(ctx, this.x, this.y, 16, 16);
    }
  }

  boundingBox() {
    let quarterWidth = BLOCK_WIDTH / 4;
    let quarterHeight = BLOCK_HEIGHT / 4;
    return new BoundingBox(this.x + quarterWidth, this.y + quarterHeight, 2*quarterWidth, 2*quarterHeight);
  }
}

class Block {
  constructor(manager, x, y) {
    this.gameManager = manager;
    this.x = x;
    this.y = y;
    this.blockState = BlockState.NORMAL;

    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 16);
    }
    this.destroyAnim = createAnimation(blockDestroy, renderFn);
    this.destroyAnim.onFinished = () => { this.blockState = BlockState.DEAD; };
  }

  destroy() {
    if (this.blockState !== BlockState.DISINTEGRATE) {
      this.blockState = BlockState.DISINTEGRATE;
      this.destroyAnim.play(125);
    }
  }

  update() {
    if (this.blockState == BlockState.DEAD) {
      this.gameManager.publish("block_destroyed", {x: this.x, y: this.y});
      return false;
    }

    return true;
  }

  render(ctx) {
    if (this.blockState === BlockState.DISINTEGRATE) {
      this.destroyAnim.render(ctx);
    } else {
      blockTile.renderAt(ctx, this.x, this.y, 16, 16);
    }
  }

  boundingBox() {
    return new BoundingBox(this.x, this.y, BLOCK_WIDTH, BLOCK_HEIGHT);
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
    return new BoundingBox(this.x, this.y, BLOCK_WIDTH, BLOCK_HEIGHT);
  }
}
