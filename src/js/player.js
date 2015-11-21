var Player = function(startX, startY, tileCol, tileRow) {
  this.x = startX;
  this.y = startY;
  this.tileCol = tileCol;
  this.tileRow = tileRow;
  this.baseSpeedIncrement = 0.3333;
  this.baseSpeed = 6.667;
};

Player.prototype.tileColIndex = function() {
  return Math.floor(this.tileCol);
}

Player.prototype.tileRowIndex = function() {
  return Math.floor(this.tileRow);
}

Player.prototype.moveUp = function() {
  this.y += -this.baseSpeed;
  this.tileRow += -this.baseSpeedIncrement;
}

Player.prototype.moveDown = function() {
  this.y += this.baseSpeed;
  this.tileRow += this.baseSpeedIncrement;
}

Player.prototype.moveLeft = function() {
  this.x += -this.baseSpeed;
  this.tileCol += -this.baseSpeedIncrement;
}

Player.prototype.moveRight = function() {
  this.x += this.baseSpeed;
  this.tileCol += this.baseSpeedIncrement;
}
