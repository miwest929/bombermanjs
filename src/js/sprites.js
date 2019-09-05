let spritesRepo = new SpriteRepository([
  './src/img/bomberman.png',
  './src/img/stages.png',
  './src/img/bombs.png'
]);
let bombImg = spritesRepo.fetch('bombs').image;
let bombermanImg = spritesRepo.fetch('bomberman').image;
let stagesImg = spritesRepo.fetch('stages').image;

// block tiles
let BLOCK_WIDTH = 20;
let BLOCK_HEIGHT = 20;
let blockTile = new Tile(stagesImg, 0, 14, BLOCK_WIDTH, BLOCK_HEIGHT);
let hardBlock = new Tile(stagesImg, 85, 14, BLOCK_WIDTH, BLOCK_HEIGHT);

//// block destroyed

//// end of block destroyed
//let stagesImg = spritesRepo.fetch('stages').image;
let blockDestroy = [
  new Tile(stagesImg, 0, 28, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 17, 28, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 34, 28, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 51, 28, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 68, 28, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 85, 28, BLOCK_WIDTH, BLOCK_HEIGHT),
];
// end of block tiles

// player animations
let moveUp = [
  new Tile(bombermanImg, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 16, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 32, 0, BLOCK_WIDTH, BLOCK_HEIGHT)
];
let moveRight = [
  new Tile(bombermanImg, 0, 32, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 16, 32, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 32, 32, BLOCK_WIDTH, BLOCK_HEIGHT)
];
let moveDown = [
  new Tile(bombermanImg, 0, 64, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 16, 64, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 32, 64, BLOCK_WIDTH, BLOCK_HEIGHT)
];
let moveLeft = [
  new Tile(bombermanImg, 0, 96, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 16, 96, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(bombermanImg, 32, 96, BLOCK_WIDTH, BLOCK_HEIGHT)
];
// end of player animations

// bomb animations
let BOMB_TILE_WIDTH = BOMB_TILE_HEIGHT = 16;
let unexplodeBomb = [
  new Tile(bombImg, 0, 0, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 17, 0, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 34, 0, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 51, 0, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
let coreExplosion = [
  new Tile(bombImg, 102, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 102, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 102, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 102, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 102, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
let horizontalExplosion = [
  new Tile(bombImg, 85, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 85, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 85, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 85, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 85, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
let verticalExplosion = [
  new Tile(bombImg, 68, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 68, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 68, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 68, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 68, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
let rightHorizontalExplosion = [
  new Tile(bombImg, 51, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 51, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 51, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 51, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 51, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
let leftHorizontalExplosion = [
  new Tile(bombImg, 34, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 34, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 34, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 34, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 34, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
let rightVerticalExplosion = [
  new Tile(bombImg, 17, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 17, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 17, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 17, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 17, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
let leftVerticalExplosion = [
  new Tile(bombImg, 0, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 0, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 0, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 0, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 0, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 17, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 34, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 51, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 68, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT),
  new Tile(bombImg, 119, 85, BOMB_TILE_WIDTH, BOMB_TILE_HEIGHT)
];
// end of bomb animations
