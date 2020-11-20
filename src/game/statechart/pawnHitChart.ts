import { Machine } from "xstate";
import { HitPayload } from "../types";

export interface HitContext {
  payload: HitPayload;
}

export interface HitStateSchema {
  states: {
    joined: {};
    separated: {};
  };
}

export interface HitConfig {}

export type HitEvent = { type: "JOIN" | "SEPARATE"; payload: HitPayload };

export const createPawnHitChart = (config: Partial<HitConfig>) =>
  Machine<HitContext, HitStateSchema, HitEvent>(
    {
      initial: "separated",
      states: {
        separated: {
          on: {
            JOIN: {
              target: "joined",
              actions: ["onJoin"]
            }
          }
        },
        joined: {
          entry: "onJoin",
          on: {
            SEPARATE: {
              target: "separated",
              actions: ["onSeparate"]
            },
            JOIN: {
              target: "joined",
              internal: true
            }
          }
        }
      }
    },
    {
      actions: {
        onSeparate: () => {},
        onJoin: () => {}
      }
    }
  );
