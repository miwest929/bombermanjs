var Map = function(cols, rows) {

  // map is 50x40 tiles large
  this.colCount = cols;
  this.rowCount = rows;
  this.map = Map.prototype.generate(cols, rows);
  console.log("INSIDE MAP CONSTRUCTURE.....");
  console.log(this.map);
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
        var blockOrNot = Math.floor(Math.random()*2);

        if (blockOrNot === 1) { map[rowIdx][colIdx] = "B"; }
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
