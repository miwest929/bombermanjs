var Player = function(startX, startY) {
  this.x = startX;
  this.y = startY;
  this.baseSpeed = 4.6;
};

Player.prototype.moveUp = function() {
  this.x += 0;
  this.y += -this.baseSpeed;
}

Player.prototype.moveDown = function() {
  this.x += 0;
  this.y += this.baseSpeed;
}

Player.prototype.moveLeft = function() {
  this.x += -this.baseSpeed;
  this.y += 0;
}

Player.prototype.moveRight = function() {
  this.x += this.baseSpeed;
  this.y += 0;
}
