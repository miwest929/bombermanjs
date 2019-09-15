let BLOCK_WIDTH = 18;
let BLOCK_HEIGHT = 18;

let getGameParameters = () => {
  const queryParams = new URLSearchParams(window.location.search);

  return {
    'debug': queryParams.get('debug'),
    'tilesprob': queryParams.get('tilesprob'),
    'powerprob': queryParams.get('powerprob')
  };
}

let randomWithBias = (prob) => {
  return Math.random() <= prob;
}

let renderBackground = function() {
  ctx.fillStyle = "rgb(91, 127, 71)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
