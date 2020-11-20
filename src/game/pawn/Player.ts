import Pawn from "./Pawn";

import { GameObjects, Scene, Math as MMath } from "phaser";

export default class Player extends Pawn {
  protected initSprites(scene: Scene, spawn: MMath.Vector2) {
    this.figure = scene.add.rectangle(spawn.x, spawn.y, 45, 45, 0x00ff00, 1.0);
    this.figure.name = this.name;

    scene.physics.add.existing(this.figure);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(1, 1);
    this.body.setVelocity(0, 0);
    this.body.setAllowGravity(false);
  }

  kill() {
    console.log("kill");
    this.figure.fillColor = 0x888888;

    this.body.setAllowGravity(true);
    this.body.setBounce(0.5, 0.5);
    this.body.setAllowRotation(true);
    this.body.setAngularVelocity(920);
    this.body.setAngularDrag(420);
  }
}
