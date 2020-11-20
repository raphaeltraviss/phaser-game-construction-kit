import { HitPayload } from "./component/PawnHit";
import Phaser from "phaser";

type VampireTunnelsEventEmitter = Phaser.Events.EventEmitter;

enum VampireTunnelsEvent {
  req_vector = "move_to",
  req_strike = "strike_at",
  strike_finished = "strike_finished",
  req_cast = "cast_at",
  req_hit = "hit_with",
  select_particle = "select_particle",
  put_particle = "put_particle",
  req_pause = "pause_game",
  req_reset = "reset_game"
}

enum SceneEvent {
  pre_update = "preupdate"
}

class VampireTunnelsChangeset<Payload> {
  op_name: VampireTunnelsEvent;
  target_name: string;
  payload: Payload;

  constructor(target_name: string, payload: Payload) {
    this.target_name = target_name;
    this.payload = payload;
  }
}

class ReqVector extends VampireTunnelsChangeset<Phaser.Math.Vector2> {
  op_name = VampireTunnelsEvent.req_vector;
}
class ReqStrike extends VampireTunnelsChangeset<Phaser.Math.Vector2> {
  op_name = VampireTunnelsEvent.req_strike;
}
class StrikeFinished extends VampireTunnelsChangeset<undefined> {
  op_name = VampireTunnelsEvent.strike_finished;
}
class ReqCast extends VampireTunnelsChangeset<Phaser.Math.Vector2> {
  op_name = VampireTunnelsEvent.req_cast;
}
class ReqHit extends VampireTunnelsChangeset<HitPayload> {
  op_name = VampireTunnelsEvent.req_hit;
}
class SelectParticle extends VampireTunnelsChangeset<number> {
  op_name = VampireTunnelsEvent.select_particle;
}
class PutParticle extends VampireTunnelsChangeset<Phaser.Math.Vector2> {
  op_name = VampireTunnelsEvent.put_particle;
}
class ReqPause extends VampireTunnelsChangeset<undefined> {
  op_name = VampireTunnelsEvent.req_pause;
}
class ReqReset extends VampireTunnelsChangeset<undefined> {
  op_name = VampireTunnelsEvent.req_reset;
}

export interface EventSink {
  listen(event_bus: Phaser.Events.EventEmitter, target_name: string);
}

export interface EventSource {
  broadcast(event_bus: Phaser.Events.EventEmitter, target_name: string);
}

export {
  VampireTunnelsEventEmitter,
  VampireTunnelsChangeset,
  VampireTunnelsEvent,
  SceneEvent,
  ReqVector,
  ReqStrike,
  StrikeFinished,
  ReqCast,
  ReqHit,
  SelectParticle,
  PutParticle,
  ReqPause,
  ReqReset
};
