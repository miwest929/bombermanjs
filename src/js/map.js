class Map {
  constructor(cols, rows, tiles) {
    this.cols = cols;
    this.rows = rows;
    this.map = this.generate(cols, rows);
    this.tiles = tiles;
  }

  renderBlock(context, x, y, tile) {
    tile.renderAt(context, x, y, 14, 14);
  }

  findEmpty() {
    let isValidStarting = (row, col) => {
      if (this.map[row][col] !== ' ') {
        return false;
      }

      // don't start in a cell that is boxed in
      return this.map[row-1][col] == ' ' || this.map[row+1][col] == ' ' ||
        this.map[row][col-1] == ' ' || this.map[row][col+1] == ' ';
    };
    let randomRow = 0;
    let randomCol = 0;
    while (!isValidStarting(randomRow, randomCol)) {
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
  }

  generate(cols, rows) {
    let map = this.blankMap(cols, rows);

    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      if (rowIdx === 0 || rowIdx === (rows - 1)) {
        for (let colIdx = 0; colIdx < cols; colIdx++) { map[rowIdx][colIdx] = "HB"; }
      } else {
        map[rowIdx][0] = "HB";
        map[rowIdx][cols - 1] = "HB";

        for (let colIdx = 1; colIdx < (cols - 1); colIdx++) {
          if (colIdx % 2 === 0 && rowIdx % 2 === 0) {
            map[rowIdx][colIdx] = "HB"
          } else if (randomWithBias(0.45)) {
            map[rowIdx][colIdx] = "B";
          }
        }
      }
    }

    return map;
  }

  blankMap(cols, rows) {
    let newMap = [];

    for(let rowIdx = 0; rowIdx < rows; rowIdx++) {
      let newRow = [];
      for(let colIdx = 0; colIdx < cols; colIdx++) { newRow.push(' '); }

      newMap.push(newRow);
    }

    return newMap;
  }
}
