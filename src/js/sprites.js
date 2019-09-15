let spritesRepo = new SpriteRepository([
  './src/img/bomberman.png',
  './src/img/stages.png',
  './src/img/bombs.png',
  './src/img/SB_Accelerator.png',
  './src/img/SB_Explosion_Expander.png',
  './src/img/SB_Extra_Bomb.png',
  './src/img/SB_Maximum_Explosion.png',
  './src/img/SB_Skull.png',
  './src/img/otherbombers.png'
]);
let bombImg = spritesRepo.fetch('bombs').image;
let bombermanImg = spritesRepo.fetch('bomberman').image;
let stagesImg = spritesRepo.fetch('stages').image;
let acceleratorImg = spritesRepo.fetch('SB_Accelerator').image;
let explosionExpanderImg = spritesRepo.fetch('SB_Explosion_Expander').image;
let extraBombImg = spritesRepo.fetch('SB_Extra_Bomb').image;
let maximumExplosionImg = spritesRepo.fetch('SB_Maximum_Explosion').image;
let skullImg = spritesRepo.fetch('SB_Skull').image;
let otherBombersImg = spritesRepo.fetch('otherbombers').image;

// power ups
let accelerator = new Tile(acceleratorImg, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
let explosionExpander = new Tile(explosionExpanderImg, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
let extraBomb = new Tile(extraBombImg, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
let maximumExplosion = new Tile(maximumExplosionImg, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
let skull = new Tile(skullImg, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
// end of power ups

// block tiles
let blockTile = new Tile(stagesImg, 0, 14, BLOCK_WIDTH, BLOCK_HEIGHT);
let hardBlock = new Tile(stagesImg, 85, 14, BLOCK_WIDTH, BLOCK_HEIGHT);

//// block destroyed
let blockDestroy = [
  new Tile(stagesImg, 0, 31, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 17, 31, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 34, 31, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 51, 31, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 68, 31, BLOCK_WIDTH, BLOCK_HEIGHT),
  new Tile(stagesImg, 85, 31, BLOCK_WIDTH, BLOCK_HEIGHT),
];
//// end of block destroyed
// end of block tiles

// player animations
let PLAYER_WIDTH = 16;
let PLAYER_HEIGHT = 32;
let moveUp = [
  new Tile(bombermanImg, 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 16, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 32, 0, PLAYER_WIDTH, PLAYER_HEIGHT)
];
let moveRight = [
  new Tile(bombermanImg, 0, 32, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 16, 32, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 32, 32, PLAYER_WIDTH, PLAYER_HEIGHT)
];
let moveDown = [
  new Tile(bombermanImg, 0, 64, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 16, 64, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 32, 64, PLAYER_WIDTH, PLAYER_HEIGHT)
];
let moveLeft = [
  new Tile(bombermanImg, 0, 96, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 16, 96, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 32, 96, PLAYER_WIDTH, PLAYER_HEIGHT)
];
let PLAYER_DEATH = [
  new Tile(bombermanImg, 0, 356, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 16, 356, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 32, 356, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 48, 356, PLAYER_WIDTH, PLAYER_HEIGHT),
  new Tile(bombermanImg, 64, 356, PLAYER_WIDTH, PLAYER_HEIGHT)
];
// end of player animations

let createPlayerTile = (img, imgX, imgY) => {
  return new Tile(img, imgX, imgY, PLAYER_WIDTH, PLAYER_HEIGHT);
};

// start of ai player animations
let aiMoveUp = [
  createPlayerTile(otherBombersImg, 212, 21),
  createPlayerTile(otherBombersImg, 228, 21),
  createPlayerTile(otherBombersImg, 244, 21)
];
let aiMoveRight = [
  createPlayerTile(otherBombersImg, 261, 47),
  createPlayerTile(otherBombersImg, 278, 47),
  createPlayerTile(otherBombersImg, 293, 47)
];
let aiMoveDown = [
  createPlayerTile(otherBombersImg, 206, 103),
  createPlayerTile(otherBombersImg, 226, 103),
  createPlayerTile(otherBombersImg, 247, 103)
];
let aiMoveLeft = [
  createPlayerTile(otherBombersImg, 158, 44),
  createPlayerTile(otherBombersImg, 173, 44),
  createPlayerTile(otherBombersImg, 244, 44)
];
let aiDeath = [
  createPlayerTile(otherBombersImg, 185, 75),
  createPlayerTile(otherBombersImg, 204, 75),
  createPlayerTile(otherBombersImg, 221, 75),
  createPlayerTile(otherBombersImg, 238, 75),
  createPlayerTile(otherBombersImg, 255, 75),
  createPlayerTile(otherBombersImg, 273, 75),
];
// end of ai player animations

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
