import { interpret, Interpreter, EventObject } from "xstate";
import { Events, Physics } from "phaser";

import {
  VampireTunnelsEventEmitter,
  VampireTunnelsEvent,
  EventSource
} from "../events";
import Pawn from "../pawn/Pawn";
import { Component } from "./Component";
import { HitPayload } from "../types";
import {
  HitContext,
  HitStateSchema,
  createPawnHitChart
} from "../statechart/pawnHitChart";

export type HitState = Interpreter<HitContext, HitStateSchema, EventObject>;

export class PawnHit implements EventSource, Component<Pawn> {
  output_events?: Events.EventEmitter;
  output_target?: string;

  service?: HitState;

  collider: Physics.Arcade.Collider;
  collisionWentAwayCount = 0;
  didSeeCollision = false;

  payload: HitPayload;

  // this component takes ownership of the collider, and is responsible
  // to dispose of it when done.
  constructor(collider: Physics.Arcade.Collider, payload: HitPayload) {
    this.collider = collider;
    this.payload = payload;

    this.broadcast = this.broadcast.bind(this);
    this.update = this.update.bind(this);

    this.handleCollide = this.handleCollide.bind(this);
    this.checkSeparated = this.checkSeparated.bind(this);
    this.broadcastHit = this.broadcastHit.bind(this);

    const state = createPawnHitChart({}).withConfig({
      actions: {
        onJoin: this.broadcastHit
      }
    });

    this.service = interpret(state);
    this.service.start();
  }

  attach(owner: Pawn) {
    this.collider.collideCallback = this.handleCollide;
    this.collider.callbackContext = this;

    this.output_target = owner.name;
  }

  update(owner: Pawn) {
    this.checkSeparated();
  }

  detach(owner: Pawn) {}

  broadcast(event_bus: VampireTunnelsEventEmitter, target_name: string) {
    this.output_events = event_bus;
    this.output_target = target_name;
  }

  // Every frame, if we are in the joined state, check to see if we've seen a
  // collision that frame.  If not, increment a counter.  Wait at least five
  // frames to consider use "separated"
  // Since this is part of my component logic and not the game engine, this
  // could become unreliable if the framerate drops too low.
  private checkSeparated() {
    if (this.service.state.value === "joined") {
      if (!this.didSeeCollision) {
        if (this.collisionWentAwayCount < 5) {
          this.collisionWentAwayCount += 1;
        } else {
          this.service.send("SEPARATE");
          this.collisionWentAwayCount = 0;
        }
      }
    }

    this.didSeeCollision = false;
  }

  // When a collision registers, mark it as "seen" and set "seen since" to zero.
  private handleCollide(obj1, obj2) {
    if (!this.output_target) return;

    if (obj1.name !== this.output_target && obj2.name !== this.output_target)
      return;

    this.didSeeCollision = true;
    this.collisionWentAwayCount = 0;

    this.service.send("JOIN", this.payload);
  }

  private broadcastHit(ctx, ev) {
    if (!this.output_events) return;

    const reqHit = `${this.output_target}/${VampireTunnelsEvent.req_hit}`;
    this.output_events.emit(reqHit, this.payload);
  }
}
