# User code injection

https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/

Serialization after several frames is used to check for memory attacks.  
Promise races are used to defuse infinite loops.

# Game Engine 

## Game Field

Toroidal space, screen wraparound on both axes. 

## Renderer

The renderer is a wrapper around the Canvas2D. There is a single Global rendering object that has some helper functions that wrap
the Canvas2D primitives. The way asteroids are drawn, the GlobalRenderer is passed into the render() function, and then within the asteroid
we can call all of the lovely functions we want.

## RenderQueue

The renderer functions all call coroutines which are immediately deferred and passed into the RenderQueue. The RenderQueue is an object with integers
for keys and lists of these deferred functions for values. This way we can render in layers, and defer our rendering calls until all game logic has concluded.

## ObjectManager

The ObjectManager class indexes all of the game objects each frame and provides functions to query the gamestate. It also uses deferred coroutines to 
schedule the respawning of gameObjects after some specified number of elapsed frames. 

## Physics

Physics is handled by the Circle class. Circles were chosen since they are the easiest to perform collision checks for. Both the simulation of point-mass dynamics and collision-checking is handled from within the Circle class. Currently mass and radius of a circle is tightly coupled. This could end up being problematic but I 
haven't had any issues yet so whatever. Collisions are handled via a sweep-and-prune algo that sorts the GameObjectList every frame and checks for rough overlap on the x-axis, 
then for overlap. Checking for collisions via CircleOverlap is handled similarly. After sorting, the X values of all gameObjects are cached into an array. A virtual
circle is compared against the X array, and the indices are used to return an array of collided-with gameObjects.

## TODO:

- [x] n-body physics
- [x] full game engine
- [x] Inject user AI code
- [x] Convert to Typescript
- [x] Safely sandbox user AI code
- [ ] Clean up and add single entrypoint
- [ ] Allow users to write code in browser
- [ ] Port to Node.js
- [ ] Sync via websockets
- [ ] Add client prediction
- [ ] Add IDE to page
- [ ] Allow user to send code to backend
- [ ] Add database w/ user auth
- [ ] Port game to Rust
- [ ] Upgrade to 3D