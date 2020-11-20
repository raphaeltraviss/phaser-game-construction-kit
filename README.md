# Phaser Game Contruction Kit

This kit will allow you to quickly create a PhaserJS 2D game that runs in the browser. It contains a set of components for basic things (health, hit, input, movement, animation).

## How do I run this?

```
git clone https://github.com/raphaeltraviss/phaser-game-construction-kit.git
cd phaser-game-construction-kit
npm install
npm start
```

## Why is this useful?

Phaser contains the raw game engine, and expects you to build your own game logic on top of it. This is a great opportunity for your creativity to flourish in that space, but there also seems to be a lack of guidance on viable game architectures.

Phaser examples are typically focused on demonstrating specific features, and there is a need to develop some systems-level architecture that encompasses the entire system.

## How does it work?

We provide our own Pawn classes that wrap the PhaserJS GameObject. These Pawn classes contain their own convenience setup code, as well as an interface for the game Components to mutate them.

The Component classes are where the magic happens: each contains an executable state chart, and event handlers that listen for events on a global event bus for game events.

When a component discovers an event that it's interested in, it transitions its internal state, and queues a Pawn mutation to happen during the next update cycle.

## Why is this beautiful?

#### Async will save us

The beauty of this system is that it's entirely event-driven, meaning that the Component processing, state transitions, and queuing of mutations happens between `update` calls.

The mutations to the Pawn classes are queued, meaning that if multiple events are happening between frames, the mutations they cause can be collapsed, cancelled, or optimized to remain efficient once `update` is called.

Since the Pawn mutations are queued, you can maintain a strict order of "this thing should be mutated before that thing", without compromising the integrity of your game architecture--Phaser GCK can bend and stretch to meet these requirements.

#### Event sourcing will save us

Since the mutations are based on a series of events, you can replay/remove those events at any time, to implement Component tests, "time travel" (undo) features, and easily save not only the current state of the game, but the events that led up to that.

If someone runs into a bug, you can dump the event log to a JSON string, and send it back to your crash reporter, so that you can recreate that exact same scenario in your local dev environment.

#### Separation of concerns will save us

The Pawn classes are architecturally different from the Component classes, which are architecturally different from the state charts they execute.

When I looked at other Entity/Component systems, they seemed to be mainly about moving code to different files, and I wanted something better for Phaser GCK.

#### State charts will save us

Based on https://github.com/davidkpiano/xstate state charts, the actual behavior of the Component classes can be easily changed, modified, extended, or swapped out with completely different state charts, and the Component code will remain predictable and bug-free.

The state charts can be visualized (see https://xstate.js.org/viz/), if you ever need to explain the different component states to new teammates, or refresh your own knowledge after a long break.

## What's the story behind this thing?

I was building a game called Vampire Tunnels (https://ramzda.itch.io/vampire-tunnels), and although I was making progress, I found myself constantly debuggingnasty event handler and update loop code, and developing the game wasn't fun any more.

In making GCK, I've created an envirmonment that has restored the fun and excitement of my game dev hobby, and I hope that it will do the same for you!
