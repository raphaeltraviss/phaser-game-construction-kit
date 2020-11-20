import Phaser from "phaser";
import MainScene from "./scene/MainScene";

export default {
  type: Phaser.AUTO,
  autoFocus: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  title: "PhaserJS Game Construction Kit",
  url: "https://github.com/raphaeltraviss/phaser-game-construction-kit",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 980
      }
    }
  },
  scene: [MainScene]
};
