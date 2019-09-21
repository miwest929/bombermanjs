const BombState = {
  LAID: "LAID",
  EXPLODED: "EXPLODED",
  DEAD: "DEAD"
}

class Bomb {
  // strength determines the blast radius of the bomb
  // 1 means explosion only extends one square
  // 2 means it extends 2 squares in all four directions
  constructor(x, y, strength, gameManager) {
    this.gameManager = gameManager;
    this.strength = strength;
    this.state = BombState.LAID;

    this.x = x;
    this.y = y;
    this.createAnimations();
    this.animation = this.bombAnim;
    this.animation.playLoop(200);
    this.extent = {};
    this.startFuse();
    this.objectId = null; // only null when not registered with the game manager
  }

  startFuse() {
    let that = this;
    setTimeout(() => {
      that.explodeBomb();
    }, 4000);
  }

  explodeBomb() {
    this.state = BombState.EXPLODED;
    this.animation.stop();

    let strengthAnimMap = {
      1: this.explode1Anim,
      2: this.explode2Anim,
      3: this.explode3Anim,
      4: this.explode4Anim,
      5: this.explode5Anim
    };

    this.extent = this.explosionExtent(this.x, this.y);

    this.animation = strengthAnimMap[this.strength];
    if (!this.animation) {
      this.animation = this.explode1Anim;
    }

    this.animation.play(75);
    this.gameManager.publish("bomb_exploded", {});
  }

  explosionExtent(x, y) {
    let r = Math.floor(y / BLOCK_HEIGHT);
    let c = Math.floor(x / BLOCK_WIDTH);

    let east = 1;
    while (this.gameManager.map[r][c-east] === ' ' && east <= this.strength) {
      east += 1;
    }

    let west = 1;
    while (this.gameManager.map[r][c+west] === ' ' && west <= this.strength) {
      west += 1;
    }

    let north = 1;
    while (this.gameManager.map[r-north][c] === ' ' && north <= this.strength) {
      north += 1;
    }

    let south = 1;
    while (this.gameManager.map[r+south][c] === ' ' && south <= this.strength) {
      south += 1;
    }

    return {
      east: Math.min(east, this.strength),
      west: Math.min(west, this.strength),
      north: Math.min(north, this.strength),
      south: Math.min(south, this.strength)
    };
  };

  createAnimations() {
    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 16);
    };
    this.bombAnim = createAnimation(unexplodeBomb, renderFn);

    let allExplodedFn = () => {
      this.state = BombState.DEAD;
    };


    // returns a render function
    let explodeRenderFn = (explosionSize) => {
      return (tiles, context) => {
        tiles[0].renderAt(context, this.x, this.y, 16, 16);

        for (let i = 1; i <= this.extent['east']; i++) {
          tiles[1].renderAt(context, this.x-i*16, this.y, 16, 16);
        }
        for (let i = 1; i <= this.extent['west']; i++) {
          tiles[1].renderAt(context, this.x+i*16, this.y, 16, 16);
        }
        for (let i = 1; i <= this.extent['north']; i++) {
          tiles[2].renderAt(context, this.x, this.y-i*16, 16, 16);
        }
        for (let i = 1; i <= this.extent['south']; i++) {
          tiles[2].renderAt(context, this.x, this.y+i*16, 16, 16);
        }
      };
    };
    let explodingTiles = [
      [coreExplosion[0], horizontalExplosion[0], verticalExplosion[0]],
      [coreExplosion[1], horizontalExplosion[1], verticalExplosion[1]],
      [coreExplosion[2], horizontalExplosion[2], verticalExplosion[2]],
      [coreExplosion[3], horizontalExplosion[3], verticalExplosion[3]],
      [coreExplosion[4], horizontalExplosion[4], verticalExplosion[4]],
      [coreExplosion[5], coreExplosion[5], coreExplosion[5]],
      [coreExplosion[6], coreExplosion[6], coreExplosion[6]],
      [coreExplosion[7], coreExplosion[7], coreExplosion[7]],
      [coreExplosion[8], coreExplosion[8], coreExplosion[8]],
      [coreExplosion[9], coreExplosion[9], coreExplosion[9]],
    ];

    this.explode1Anim = createAnimation(explodingTiles, explodeRenderFn(1));
    this.explode1Anim.onFinished = allExplodedFn;

    this.explode2Anim = createAnimation(explodingTiles, explodeRenderFn(2));
    this.explode2Anim.onFinished = allExplodedFn;

    this.explode3Anim = createAnimation(explodingTiles, explodeRenderFn(3));
    this.explode3Anim.onFinished = allExplodedFn;

    this.explode4Anim = createAnimation(explodingTiles, explodeRenderFn(4));
    this.explode4Anim.onFinished = allExplodedFn;

    this.explode5Anim = createAnimation(explodingTiles, explodeRenderFn(5));
    this.explode5Anim.onFinished = allExplodedFn;
  }

  boundingBox() {
    if (this.state == BombState.EXPLODED) {
      let reach = this.strength * 16
      let blastWidth = BLOCK_WIDTH * 0.75;
      return [
        new BoundingBox(this.x - reach, this.y, BLOCK_WIDTH+2*reach, BLOCK_HEIGHT*0.8),
        new BoundingBox(this.x, this.y - reach, BLOCK_WIDTH*0.8, (BLOCK_HEIGHT*0.8+2*reach))
      ];
    } else {
      return new BoundingBox(this.x, this.y, BLOCK_WIDTH, BLOCK_HEIGHT);
    }
  }

  collidesFn(gameManager, collidedObj) {
    if (!isBomb(collidedObj) && this.state === BombState.EXPLODED) {
      collidedObj.destroy(gameManager);
    }
  }

  // returns true if object is still alive
  //         false otherwise.
  // so if you no longer want this object to be
  // tracked by the game manager then return false
  update(gameManager) {
    if (this.state === BombState.DEAD) {
      return false;
    }

    gameManager.checkCollisionWith(
      this.objectId,
      NO_VELOCITY,
      (m, obj) => { this.collidesFn(m, obj); }
    )

    return true;
  }

  render(context, x, y) {
    if (this.state == BombState.EXPLODED) {
      this.animation.render(context);
    } else {
      this.animation.render(context);
    }
  }
}
