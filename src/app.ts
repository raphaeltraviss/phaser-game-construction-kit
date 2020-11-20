import Phaser from "phaser";
import gameConfig from "./game/gameConfig.js";

let game;

function newGame() {
  if (game) return;
  game = new Phaser.Game(gameConfig);
}

function destroyGame() {
  if (!game) return;
  game.destroy(true);
  game.runDestroy();
  game = null;
}

if (module.hot) {
  module.hot.dispose(destroyGame);
  module.hot.accept(newGame);
}

if (!game) newGame();
