// spritesRepo.fetch("grid.png").asTiles(24, 24, 32, 32, 4);
class SpriteRepository {
  constructor(spritePaths) {
    this.sprites = [];

    spritePaths.forEach((path) => {
      let spriteKey = this.extractName(path);
      this.sprites[spriteKey] = new Sprite();
      this.sprites[spriteKey].image.src = path;
    });
  }

  fetch(key) {
    return this.sprites[key];
  }

  extractName(path) {
    if (path[0] === '.' )
      path = path.slice(1);

    return ( path.split('.')[0].split('/').pop() );
  }
}

class Sprite {
  constructor() {
    this.loaded = false;
    this.image = this.createImageObject();
  }

  asTiles(startX, startY, tileWidth, tileHeight) {
    let tiles = [];
    let curX = startX;
    let curY = startY;

    /*
    img  Specifies the image, canvas, or video element to use
    sx  Optional. The x coordinate where to start clipping
    sy  Optional. The y coordinate where to start clipping
    swidth  Optional. The width of the clipped image
    sheight Optional. The height of the clipped image
    */
    for(; curY < (startY + this.image.height); curY += tileHeight) {
      for(; curX < (startX + this.image.width); curX += tileWidth) {
        tiles.push( new Tile(this.image, curX, curY, tileWidth, tileHeight) );
      }
    }

    return tiles;
  }

  createImageObject() {
    let img = new Image();
    img.onload = () => {
      console.log(`Successfully loaded '${img.src}'`);
      this.loaded = true;
    };
    img.onerror = () => {
      console.log(`Failed to load '${img.src}'`);
      this.loaded = true;
    };

    return img;
  }
}

class Tile {
  constructor(sprite, startX, startY, tileWidth, tileHeight) {
    this.sprite = sprite;
    this.startX = startX;
    this.startY = startY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  renderAt(context, x, y, renderedWidth, renderedHeight) {
    context.drawImage(
      this.sprite,
      this.startX,
      this.startY,
      renderedWidth,
      renderedHeight,
      x,
      y,
      this.tileWidth,
      this.tileHeight
    );
  }
}

class Frame {
  constructor(tiles, renderFn) {
    this.tiles = tiles;
    this.renderFn = renderFn;
  }

  render(context, x, y) {
    this.renderFn(this.tiles, context, x, y);
  }
}

//let renderFn = (tiles, context, x, y) => {
//  tiles[0].renderAt(context, x, y, 16, 32);
//}
let createAnimation = (tiles, renderFn, shouldLoop) => {
  let frames = [];
  for (let i = 0; i < tiles.length; i++) {
    frames.push(new Frame([tiles[i]], renderFn));
  }
  return new Animation(frames, shouldLoop);
}

class Animation {
  constructor(frames, shouldLoop) {
    this.frames = frames;
    this.currentFrameIndex = 0;
    this.ANIMATION_COMPLETED = -1;
    this.currentTimer = null;
    this.shouldLoop = shouldLoop;
  }

  play(speed) {
    this.currentTimer = setInterval(() => {
      if (this.shouldLoop) {
        this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
      } else {
        this.currentFrameIndex += 1;
        if (this.currentFrameIndex === this.frames.length) {
          this.currentFrameIndex = this.ANIMATION_COMPLETED;
          this.stop();
        }
      }
    }, speed);
  }

  stop() {
    if (this.currentTimer) {
      window.clearInterval(this.currentTimer);
    }
  }

  render(context, x, y) {
    if (this.currentFrameIndex !== this.ANIMATION_COMPLETED) {
      this.frames[this.currentFrameIndex].render(context, x, y);
    }
  }
}
