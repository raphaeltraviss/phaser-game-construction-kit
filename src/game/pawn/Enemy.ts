import Pawn from "./Pawn";

import { GameObjects } from "phaser";

export default class Enemy extends Pawn {
  emitter: GameObjects.Particles.ParticleEmitter;

  initResources(particleSystem: GameObjects.Particles.ParticleEmitterManager) {
    this.emitter = particleSystem.createEmitter({
      speed: 10,
      scale: { start: 0.5, end: 0 },
      blendMode: "ADD",
      lifespan: 300,
      frequency: 22
    });
  }

  initPlay() {
    this.body.setVelocity(100, 200);

    this.emitter.startFollow(this.figure);
  }
}
