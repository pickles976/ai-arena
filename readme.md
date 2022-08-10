# Game Engine 

## Renderer

The renderer is a wrapper around the Canvas2D. There is a single Global rendering object that has some helper functions that wrap
the Canvas2D primitives. The way asteroids are drawn, the GlobalRenderer is passed into the render() function, and then within the asteroid
we can call all of the lovely functions we want.