var Map = function(cols, rows) {
  this.cols = cols;
  this.rows = rows;
  this.map = Map.prototype.generate(cols, rows);
};

Map.prototype.findEmpty = function() {
  var randomRow = Math.floor(Math.random() * this.rows);
  var randomCol = Math.floor(Math.random() * this.cols);

  while (this.map[randomRow][randomCol] !== ' ') {
    randomRow = Math.floor(Math.random() * this.rows);
    randomCol = Math.floor(Math.random() * this.cols);
  }

  // Each tile is BLOCK_WIDTH x BLOCK_HEIGHT
  return {
    tileX: randomCol,
    tileY: randomRow,
    x: randomCol * BLOCK_WIDTH,
    y: randomRow * BLOCK_HEIGHT
  };
};

Map.prototype.generate = function(cols, rows) {
  var map = Map.prototype.blankMap(cols, rows);

  for(var rowIdx = 0; rowIdx < rows; rowIdx++) {
    // If the first or last row then ...
    if (rowIdx === 0 || rowIdx === (rows - 1)) {
      for (var colIdx = 0; colIdx < cols; colIdx++) { map[rowIdx][colIdx] = "HB"; }
    }
    else {
      map[rowIdx][0] = "HB";
      map[rowIdx][cols - 1] = "HB";

      for (var colIdx = 1; colIdx < (cols - 1); colIdx++) {
        if (colIdx % 5 === 0 && rowIdx % 3 === 0) {
          map[rowIdx][colIdx] = "HB"
        } else {
          var blockOrNot = Math.floor(Math.random()*4);

          if (blockOrNot === 1) { map[rowIdx][colIdx] = "B"; }
        }
      }
    }
  }

  return map;
}

Map.prototype.blankMap = function(cols, rows) {
  var newMap = [];

  for(var rowIdx = 0; rowIdx < rows; rowIdx++) {
    var newRow = [];
    for(var colIdx = 0; colIdx < cols; colIdx++) { newRow.push(' '); }

    newMap.push(newRow);
  }

  return newMap;
};
