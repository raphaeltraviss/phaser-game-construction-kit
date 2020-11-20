import { interpret, Interpreter, EventObject } from "xstate";
import {
  HealthStateSchema,
  HealthContext,
  createPawnHealthChart
} from "../statechart/pawnHealthChart";
import { Events } from "phaser";
import {
  VampireTunnelsEventEmitter,
  VampireTunnelsEvent,
  EventSource,
  EventSink
} from "../events";
import Pawn from "../pawn/Pawn";
import { Component } from "./Component";

export type HealthState = Interpreter<
  HealthContext,
  HealthStateSchema,
  EventObject
>;

export class InputConfig {
  keybinding: String;
}

// Superset of component config and pawnHealthChart config
type Options = {
  health: number;
  endGame: boolean;
  forceBack: boolean;
  invulnMillis: number;
  flashMillis: number;
  flashColor: number;
  baseColor: number;
  deadColor: number;
};

const brightTint = 0xffffff;
const baseTint = 0x00ff00;

const defaultOptions: Options = {
  health: 30,
  invulnMillis: 2000,
  flashMillis: 30,
  baseColor: baseTint,
  flashColor: brightTint,
  deadColor: 0x888888,
  endGame: false,
  forceBack: true
};

export type PawnHealthOptions = Partial<Options>;

export default class PawnHealth
  implements EventSource, EventSink, Component<Pawn> {
  is_destroyed: boolean = false;
  last_seen_destroyed: boolean = false;

  output_events?: Events.EventEmitter;
  output_target?: string;

  config: PawnHealthOptions;
  service?: HealthState;

  lastSeenState: string;

  get nextColor(): number {
    return this.service ? this.service.state.context.currentColor : baseTint;
  }

  get nextState(): string {
    if (!this.service) return "";

    let value = this.service.state.value;
    if (typeof value === "object") {
      value = Object.keys(this.service.state.value)[0];
    }

    return value;
  }

  constructor(suppliedOptions: PawnHealthOptions = {}) {
    this.config = { ...defaultOptions, ...suppliedOptions };

    this.listen = this.listen.bind(this);
    this.broadcast = this.broadcast.bind(this);

    this.attach = this.attach.bind(this);
    this.update = this.update.bind(this);
    this.detach = this.attach.bind(this);

    this.handleHit = this.handleHit.bind(this);
    this.handleGameEnd = this.handleGameEnd.bind(this);

    const state = createPawnHealthChart(this.config);

    this.service = interpret(state);
    this.service.start();
  }

  listen(event_bus: VampireTunnelsEventEmitter, target_name: string) {
    const damaged = `${target_name}/${VampireTunnelsEvent.req_hit}`;
    event_bus.on(damaged, this.handleHit);
  }

  broadcast(event_bus: VampireTunnelsEventEmitter, target_name: string) {
    this.output_events = event_bus;
    this.output_target = target_name;
  }

  attach(owner: Pawn) {}

  update(owner: Pawn) {
    // We can' use actions here, because we only want to kill the
    // pawn during the update loop.
    if (owner.figure.fillColor !== this.nextColor) {
      owner.figure.fillColor = this.nextColor;
    }
    if (this.lastSeenState !== "dead" && this.nextState === "dead") {
      owner.kill();
    }

    this.lastSeenState = this.nextState;
  }

  detach(owner: Pawn) {}

  private handleHit(payload) {
    this.service.send("DAMAGE", { hp: payload.decHP });
  }

  private handleGameEnd() {
    if (!this.output_events || !this.config.endGame) return;

    const endGame = `game/${VampireTunnelsEvent.req_reset}`;
    this.output_events.emit(endGame);
  }
}
