var Tile = function(sprite, startX, startY, tileWidth, tileHeight) {
  this.sprite = sprite;
  this.startX = startX;
  this.startY = startY;
  this.width = tileWidth;
  this.height = tileHeight;
};

var Sprite = function() {
  this.loaded = false;
  this.image = Sprite.prototype.createImageObject();
};

Sprite.prototype.createImageObject = function() {
  var img = new Image();
  img.onload = function() {
    console.log(`Successfully loaded '${this.src}'`);
    this.loaded = true;
  };
  img.onerror = function() {
    console.log(`Failed to load '${this.src}'`);
    this.loaded = true;
  };

  return img;
}

var SpriteRepository = function (spritePaths) {
  var sprites = [];

  spritePaths.forEach( function(path) {
    var spriteKey = SpriteRepository.prototype.extractName(path);
    sprites[spriteKey] = new Sprite(); //SpriteRepository.prototype.createImageObject();
    sprites[spriteKey].image.src = path;
  });

  this.sprites = sprites;
}

SpriteRepository.prototype.fetch = function(key) {
  return this.sprites[key];
};

SpriteRepository.prototype.extractName = function(path) {
  if (path[0] === '.' )
    path = path.slice(1);

  return ( path.split('.')[0].split('/').pop() );
};

SpriteRepository.prototype.asTiles = function(spriteKey, startX, startY, tileWidth, tileHeight, regionWidth, regionHeight) {
  var tiles = [];
  var curX = startX;
  var curY = startY;
  var sprite = this.sprites[spriteKey];
  /*
  img	Specifies the image, canvas, or video element to use
  sx	Optional. The x coordinate where to start clipping
  sy	Optional. The y coordinate where to start clipping
  swidth	Optional. The width of the clipped image
  sheight Optional. The height of the clipped image
  */
  for(var curY = startY; curY < (startY + regionHeight); curY += tileHeight) {
    for(var curX = startX; curX < (startX + regionWidth); curX += tileWidth) {
      tiles.push( new Tile(sprite, curX, curY, tileWidth, tileHeight) );
    }
  }

  return tiles;
};
