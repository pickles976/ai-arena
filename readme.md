# An Asteroids-Like N-Body Physics Game

A small game written in Typescript and hosted here:

https://ai-arena.com/

Users write code in Javascript which is run in a sandbox. The Sandbox has access to proxies of gameobjects. User code controls the units in the game. The goal is to collect resources and destroy the enemy base.

## TODO:
- [ ] Update public and private methods

## Vanilla js user code injection (NOT SAFE)

https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/

# Game Engine 

## Game Field

Toroidal space, screen wraparound on both axes. 

## Renderer

The renderer is a wrapper around Canvas2D. There is a single Global rendering object that has some helper functions that wrap
the Canvas2D primitives. The way asteroids are drawn, the GlobalRenderer is passed into the render() function, and then within the asteroid we can call all of the lovely functions we want.

## RenderQueue

The renderer functions all call coroutines which are immediately deferred and passed into the RenderQueue. The RenderQueue is an object with integers for keys and lists of these deferred functions for values. This way we can render in layers, and defer our rendering calls until all game logic has concluded.

## ObjectManager

The ObjectManager class indexes all of the game objects each frame and provides functions to query the gamestate. It also uses deferred coroutines to schedule the respawning of gameObjects after some specified number of elapsed frames.

## Physics

Physics is handled by the Circle class. Circles were chosen since they are the easiest to perform collision checks for. Both the simulation of point-mass dynamics and collision-checking is handled from within the Circle class. Currently mass and radius of a circle is tightly coupled. This is problematic on things like the Base, which is static. Collisions are handled via a sweep-and-prune algo that sorts the GameObjectList every frame and checks for rough overlap on the x-axis, then for overlap. Checking for collisions via CircleOverlap is handled similarly. After sorting, the X values of all gameObjects are cached into an array. A virtual circle is compared against the X array, and the indices are used to return an array of collided-with gameObjects.

## Proxy Manager

Handles the conversion of native gameObjects into proxies that can be safely interacted with by the user.

# Config options:

Example:

```javascript
setConfig({
    canvas: document.getElementById("game-canvas"),
    graphics: true,
    ticksPerFrame: 2,
    framerate: 60,
    streaming: false,
    nodejs: false,
    userCodeTimeout: 1.0,
    seed: 1234
})
```

## Running in browser:

```javascript
setConfig({
    graphics: false,
    ticksPerFrame: 8,
    framerate: 30,
    nodejs: true,
    seed: 1234
})
```

## Running in Nodejs:

```javascript
setConfig({
    canvas: document.getElementById("game-canvas"),
    graphics: true,
    ticksPerFrame: 2,
    framerate: 60,
    seed: 1234
})
```
