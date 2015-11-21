var Player = function(startX, startY, tileX, tileY) {
  this.x = startX;
  this.y = startY;
  this.tileX = tileX;
  this.tileY = tileY;
  this.baseSpeedIncrement = 0.33;
  this.baseSpeed = 5.0;
};

Player.prototype.curTileX = function() {
  return Math.floor(this.tileX);
}

Player.prototype.curTileY = function() {
  return Math.floor(this.tileY);
}

Player.prototype.moveUp = function() {
  this.y += -this.baseSpeed;
  this.tileY += -this.baseSpeedIncrement;
}

Player.prototype.moveDown = function() {
  this.y += this.baseSpeed;
  this.tileY += this.baseSpeedIncrement;
}

Player.prototype.moveLeft = function() {
  this.x += -this.baseSpeed;
  this.tileX += -this.baseSpeedIncrement;
  console.log(`tileX: ${this.tileX}, tileY: ${this.tileY}`)
}

Player.prototype.moveRight = function() {
  this.x += this.baseSpeed;
  this.tileX += this.baseSpeedIncrement;

  console.log(`tileX: ${this.tileX}, tileY: ${this.tileY}`)
}
