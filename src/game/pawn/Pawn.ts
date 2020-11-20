import { Component } from "../component/Component";

import { GameObjects, Math as MMath, Scene, Physics } from "phaser";
import { NonRelativeModuleNameResolutionCache } from "typescript";

export default class Pawn {
  figure: GameObjects.Rectangle;
  name: string;
  components: Component<Pawn>[];

  get body(): Physics.Arcade.Body {
    return <Physics.Arcade.Body>this.figure.body;
  }

  // Pawn conformance

  addComponent(component: Component<any>) {
    component.attach(this);
    this.components.push(component);
  }

  initResources(resource: any) {}

  initPlay() {}

  kill() {
    this.figure.setActive(false);
  }

  tick() {
    this.components.forEach((c) => {
      c.update(this);
    });
  }

  constructor(
    name: string,
    scene: Scene,
    spawnPoint: MMath.Vector2,
    components: Component<Pawn>[]
  ) {
    this.name = name;
    this.components = components;

    this.kill = this.kill.bind(this);

    this.initSprites.call(this, scene, spawnPoint);
    this.initComponents.call(this);
  }

  protected initSprites(scene: Scene, spawn: MMath.Vector2) {
    this.figure = scene.add.rectangle(spawn.x, spawn.y, 30, 30, 0xff0000, 1.0);
    this.figure.name = this.name;

    scene.physics.add.existing(this.figure);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(1, 1);
  }

  protected initComponents() {
    this.components.forEach((c) => {
      c.attach(this);
    });
  }
}
