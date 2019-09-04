class Map {
  constructor(cols, rows, tiles) {
    this.cols = cols;
    this.rows = rows;
    this.map = this.generate(cols, rows);
    this.tiles = tiles;
  }

  //placeBomb(row, col, bomb) {
  //  this.map[row][col] = {type: 'BOMB', obj: bomb};
  //}

  render(context) {
    for(var rowIdx = 0, curY = 0; rowIdx < ROWS_MAP; rowIdx++, curY += BLOCK_WIDTH) {
      for(var colIdx = 0, curX = 0; colIdx < COLS_MAP; colIdx++, curX += BLOCK_HEIGHT) {
        //if (this.map[rowIdx][colIdx] == 'BOMB') {
        if (this.map[rowIdx][colIdx] !== ' ') {
          this.renderBlock(context, curX, curY, this.tiles[ this.map[rowIdx][colIdx] ]);
        }
      }
    }
  }

  renderBlock(context, x, y, tile) {
    tile.renderAt(context, x, y, 14, 14);
  }

  boundingBox() {
    let boxes = [];

    this.map.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell === 'HB' || cell === 'B') {
          let bb = new BoundingBox(
            cIdx * BLOCK_HEIGHT,
            rIdx * BLOCK_WIDTH,
            BLOCK_WIDTH-1,
            BLOCK_HEIGHT-1
          );
          boxes.push(bb);
        }
      });
    });

    return boxes;
  }

  findEmpty() {
    let randomRow = Math.floor(Math.random() * this.rows);
    let randomCol = Math.floor(Math.random() * this.cols);

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
          } else {
            let blockOrNot = Math.floor(Math.random()*3);

            if (blockOrNot === 1) { map[rowIdx][colIdx] = "B"; }
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
