var Player = function(startX, startY, tileX, tileY) {
  this.x = startX;
  this.y = startY;
  this.tileX = tileX;
  this.tileY = tileY;
  this.baseSpeedIncrement = 0.33;
  this.baseSpeed = 4.6;
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
}

Player.prototype.moveRight = function() {
  this.x += this.baseSpeed;
  this.tileX += this.baseSpeedIncrement;
}
