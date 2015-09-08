var Player = function(startX, startY) {
  this.x = startX;
  this.y = startY;
  this.moveX = 0;
  this.moveY = 0;
};

Player.prototype.moveUp = function() {
  this.x += 0;
  this.y += -5;
}

Player.prototype.moveDown = function() {
  this.x += 0;
  this.y += 5;
}

Player.prototype.moveLeft = function() {
  this.x += -5;
  this.y += 0;
}

Player.prototype.moveRight = function() {
  this.x += 5;
  this.y += 0;
}
