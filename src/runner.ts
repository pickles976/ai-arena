import e from 'express'
import { checkForCollisions } from './collisions.js'
import { clearRenderQueue, DOMCallbacks, GameObjectList, GameObjectManager, GAME_STARTED, GlobalCanvas, GlobalRender, GRAPHICS_ENABLED, H, MS, PAUSED, RenderQueue, resetGameState, setGameObjectManager, setGameStarted, setGameStateManager, setRenderer, ShipUpdateCode, sortGameObjectList, spawn, W } from './globals.js'
import { ObjectManager } from './objectManager.js'
import { Base, Ship } from './objects.js'
import { Vector2D } from './physics.js'
import { Renderer } from './renderer.js'
import { StateManager } from './stateManager.js'
import { create_UUID, sleep } from './utils.js'


export const initializeGameState = function(){

    setGameStarted(true)

    // INITALIZE GAME STATE MANAGER
    setGameStateManager(new StateManager())

    // CREATE OUR SHIT
    setGameObjectManager(new ObjectManager())

    spawn(new Base(create_UUID(),new Vector2D(W/4,H/2),500,0))
    spawn(new Base(create_UUID(),new Vector2D(3*W/4,H/2),500,1))

    GameObjectManager.indexObjects(GameObjectList)

    spawn(new Ship(create_UUID(),new Vector2D(W/4,H/4),100,0))
    spawn(new Ship(create_UUID(),new Vector2D(3*W/4,3*H/4),100,1))

    // populate the game field
    GameObjectManager.start()

    setRenderer(new Renderer(GlobalCanvas))

}

// 60 FPS
// 16.66ms/frame
/**
 * CONTROLS THE LOGIC FOR EACH FRAME
 */
export const step = function(){

    if(!PAUSED){

    const frameStart = performance.now()

    updateField()
    DOMCallbacks()

    if (GRAPHICS_ENABLED){
        render()
    }

    clearRenderQueue()

    let elapsed = performance.now() - frameStart
    // console.log(elapsed)
    sleep(MS - elapsed)
    window.requestAnimationFrame(step);

    }

}

/**
 * Runs in order:
 * 
 * Dead object collection
 * Point-mass simulation
 * Collisions
 * Queue up "dumb" object spawning
 * AI Logic
 * 
 */
const updateField = function(){

    // SORT BY X POSITION (ALLOWS US TO DO COLLISION CHECKS)
    sortGameObjectList()

    // COLLECT DEAD OBJECTS, SIMULATE ALIVE ONES
    for(let i = GameObjectList.length - 1; i >= 0; i--){

        const value = GameObjectList[i]

        if(value.type === "DEAD")
            GameObjectList.splice(i,1)
        else
            value.simulate(MS)
    }

    checkWinCondition()

    // SORT BY X POSITION
    sortGameObjectList()

    checkForCollisions(GameObjectList)

    // manage the game objects
    GameObjectManager.update()

    // RUN AI LOGIC
    for(let i = GameObjectList.length - 1; i >= 0; i--){
        const value = GameObjectList[i]

        if(value.type === "SHIP" && value instanceof Ship)
            value.update()
        else if(value.type === "BASE" && value instanceof Base)
            value.update()
    }

}

/**
 * Renders a frame
 */
const render = function(){

    // call the rendering functions for each object. This doesn't actually render,
    // it queues up rendering calls in the queue
    for(let i = 0; i < GameObjectList.length; i++){
        GameObjectList[i].render(GlobalRender)
    }

    GlobalRender.newFrame()

    // render by depth
    for (const [key,value] of Object.entries(RenderQueue)){
        for (const renderFunc of value){
            renderFunc.next()
        }
    }
}

export const run = function(){
    if (GAME_STARTED === false){
        initializeGameState()
        window.requestAnimationFrame(step);
    }
}

const checkWinCondition = function(){
    if(GameObjectManager.getBaseByTeam(0) === undefined){
        alert("Team 1 has won!")
        resetGameState()

    } else if(GameObjectManager.getBaseByTeam(1) === undefined){
        alert("Team 0 has won!")
        resetGameState()
    }
}