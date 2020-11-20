import { assign, Machine } from "xstate";

export interface HealthContext {
  // hit points
  hp: number;
  currentColor: number;
}

export interface HealthStateSchema {
  states: {
    vulnerable: {};
    invulnerable: {
      states: {
        base: {};
        bright: {};
      };
    };
    dead: {};
  };
}

export type HealthEvent = { type: "HEAL" | "DAMAGE"; hp: number };

interface HealthConfig {
  health: number;
  baseColor: number;
  flashColor: number;
  deadColor: number;
  flashMillis: number;
  invulnMillis: number;
}

// @TODO: type this with HealthEvent instead of any
const applyHP = assign<HealthContext, any>({
  hp: (ctx, ev) => (ev.type === "HEAL" ? ctx.hp + ev.hp : ctx.hp - ev.hp)
});

export const createPawnHealthChart = (config: Partial<HealthConfig>) => {
  const setBright = assign<HealthContext, any>({
    currentColor: config.flashColor
  });

  const removeBright = assign<HealthContext, any>({
    currentColor: config.baseColor
  });

  const setDead = assign<HealthContext, any>({
    hp: 0,
    currentColor: config.deadColor
  });

  return Machine<HealthContext, HealthStateSchema, HealthEvent>(
    {
      initial: "vulnerable",
      context: {
        hp: config.health === undefined ? 30 : config.health,
        currentColor: config.baseColor
      },
      states: {
        vulnerable: {
          on: {
            DAMAGE: [
              {
                target: "invulnerable",
                cond: (ctx, ev: any) => ctx.hp - ev.hp > 0,
                actions: [applyHP]
              },
              {
                target: "dead",
                cond: (ctx, ev: any) => ctx.hp - ev.hp <= 0,
                actions: [setDead]
              }
            ],
            HEAL: {
              actions: [applyHP]
            }
          }
        },
        invulnerable: {
          initial: "base",
          after: {
            [config.invulnMillis]: {
              target: "vulnerable",
              actions: [removeBright]
            }
          },
          on: {
            HEAL: {
              actions: [applyHP]
            }
          },
          states: {
            bright: {
              after: {
                [config.flashMillis]: {
                  target: "base",
                  actions: [removeBright]
                }
              }
            },
            base: {
              after: {
                [config.flashMillis]: {
                  target: "bright",
                  actions: [setBright]
                }
              }
            }
          }
        },
        dead: {
          after: {
            4000: {
              actions: ["resetGame"]
            }
          }
        }
      }
    },
    {
      actions: {
        resetGame: () => {}
      }
    }
  );
};
