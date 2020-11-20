import { Scene, GameObjects, Events, Math as MMath } from "phaser";
import { PawnHit, HitPayload } from "../component/PawnHit";
import PawnHealth from "../component/PawnHealth";
import Pawn from "../pawn/Pawn";
import Enemy from "../pawn/Enemy";
import Player from "../pawn/Player";

import { VampireTunnelsEvent } from "../events";

import EventLogger from "../EventLogger";

export default class MainScene extends Scene {
  gameEvents: Events.EventEmitter;
  player: Pawn;
  enemies: GameObjects.Group;

  constructor() {
    super("mainScene");
    this.gameEvents = new Events.EventEmitter();

    const gameReset = `game/${VampireTunnelsEvent.req_reset}`;
    this.gameEvents.on(gameReset, () => {
      this.scene.restart();
    });
  }

  preload() {}

  create() {
    let logger = new EventLogger();

    const particles = this.add.particles("red");

    // Spawn the enemies
    this.enemies = new GameObjects.Group(this);

    Array.apply(null, Array(10))
      .map((_, i) => i)
      .forEach((i) => {
        let name = `enemy=${i}`;

        logger.listen(this.gameEvents, name);

        let x = 400 + Math.floor(240 - Math.random() * 240 * i);
        let y = 100 + Math.floor(120 - Math.random() * 120 * i);

        let enemy = new Enemy(name, this, new MMath.Vector2(x, y), []);

        enemy.initResources(particles);
        enemy.initPlay();

        this.enemies.add(enemy.figure);
      });

    // Spawn the player

    let playerHealth = new PawnHealth({ health: 30 });
    playerHealth.listen(this.gameEvents, "player1");
    playerHealth.broadcast(this.gameEvents, "player1");

    this.player = new Player("player1", this, new MMath.Vector2(400, 300), [
      playerHealth
    ]);

    logger.listen(this.gameEvents, "player1");

    const playerHitsEnemy = this.physics.add.collider(
      this.player.figure,
      this.enemies
    );
    const playerHit = new PawnHit(playerHitsEnemy, { decHP: 10 });
    playerHit.broadcast(this.gameEvents, "player1");
    this.player.addComponent(playerHit);
  }

  public update(time: any, delta: any) {
    this.player.tick();
  }
}
