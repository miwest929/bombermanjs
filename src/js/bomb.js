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
    this.animation.play(200);
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
    this.animation = this.explode2Anim;
    this.animation.play(75);
    this.gameManager.publish("bomb_exploded");
  }

  createAnimations() {
    let renderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 16);
    };
    this.bombAnim = createAnimation(unexplodeBomb, renderFn, true);

    let allExplodedFn = () => {
      this.state = BombState.DEAD;
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
    let explode1RenderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 16);
      tiles[1].renderAt(context, this.x-16, this.y, 16, 16);
      tiles[1].renderAt(context, this.x+16, this.y, 16, 16);
      tiles[2].renderAt(context, this.x, this.y-16, 16, 16);
      tiles[2].renderAt(context, this.x, this.y+16, 16, 16);
    };
    this.explode1Anim = createAnimation(explodingTiles, explode1RenderFn, false);
    this.explode1Anim.onFinished = allExplodedFn;

    let explode2RenderFn = (tiles, context) => {
      tiles[0].renderAt(context, this.x, this.y, 16, 16);
      tiles[1].renderAt(context, this.x-16, this.y, 16, 16);
      tiles[1].renderAt(context, this.x+16, this.y, 16, 16);
      tiles[1].renderAt(context, this.x-32, this.y, 16, 16);
      tiles[1].renderAt(context, this.x+32, this.y, 16, 16);
      tiles[2].renderAt(context, this.x, this.y-16, 16, 16);
      tiles[2].renderAt(context, this.x, this.y+16, 16, 16);
      tiles[2].renderAt(context, this.x, this.y-32, 16, 16);
      tiles[2].renderAt(context, this.x, this.y+32, 16, 16);
    };
    this.explode2Anim = createAnimation(explodingTiles, explode2RenderFn, false);
    this.explode2Anim.onFinished = allExplodedFn;

    //this.horizontalExplosionAnim = createAnimation(horizontalExplosion, renderFn, false);
    //this.verticalExplosionAnim = createAnimation(verticalExplosion, renderFn, false);
    //this.rightHorizontalExplosionAnim = createAnimation(rightHorizontalExplosion, renderFn, false);
    //this.leftHorizontalExplosionAnim = createAnimation(leftHorizontalExplosion, renderFn, false);
    //this.rightVerticalExplosionAnim = createAnimation(rightVerticalExplosion, renderFn, false);
    //this.leftVerticalExplosionAnim = createAnimation(leftVerticalExplosion, renderFn, false);
  }

  boundingBox() {
    if (this.state == BombState.EXPLODED) {
      let reach = this.strength * 16
      return new BoundingBox(this.x - reach, this.y, (BLOCK_WIDTH+2*reach)*0.8, BLOCK_HEIGHT*0.8);
    } else {
      return null;
    }
  }

  collidesFn(collidedObj) {
    console.log(`Explosion collided with '${collidedObj}'`);
  }

  // returns true if object is still alive
  //         false otherwise.
  // so if you no longer want this object to be
  // tracked by the game manager then return false
  update(gameManager) {
    if (this.state === BombState.DEAD) {
      return false;
    }

    gameManager.checkCollisionWith(this.objectId, NO_VELOCITY, this.collidesFn)

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
