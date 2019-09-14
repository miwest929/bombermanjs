let getGameParameters = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const debug = queryParams.get('debug') == 'true';

  return {
    'debug': debug
  };
}

let randomWithBias = (prob) => {
  return Math.random() <= prob;
}

let renderBackground = function() {
  ctx.fillStyle = "rgb(91, 127, 71)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
