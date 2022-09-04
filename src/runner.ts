import { checkForCollisions } from './collisions.js'
import { clearRenderQueue, DOMCallbacks, GameObjectList, GameObjectManager, GAME_STARTED, GlobalCanvas, GlobalRender, GRAPHICS_ENABLED, H, MS, PAUSED, REALTIME, RenderQueue, resetGameState, setGameObjectManager, setGameStarted, setGameStateManager, setRenderer, sortGameObjectList, spawn, TICKS_PER_FRAME, W } from './globals.js'
import { ObjectManager } from './objectManager.js'
import { Base, Ship } from './objects.js'
import { Vector2D } from './physics.js'
import { Renderer } from './renderer.js'
import { StateManager } from './stateManager.js'
import { clamp, create_UUID, sleep } from './utils.js'

let requestFrameID : number = null
let physicsTimeout : NodeJS.Timeout = null
let renderTimeout : NodeJS.Timeout = null

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

export const renderLoop = function(){

    if (GRAPHICS_ENABLED){
        try {

            const frameStart = performance.now()
            if(!PAUSED && GAME_STARTED){
                render()
                clearRenderQueue()
                DOMCallbacks()
            }

            let elapsed = performance.now() - frameStart
            // console.log(`Render step took ${elapsed}ms`)

            renderTimeout = setTimeout(()=>requestFrameID = window.requestAnimationFrame(renderLoop),clamp(MS - elapsed,0,1000))

        } 
        catch (e)
        {
            alert(`Failed to render \n Error: ${e}`)
        }
    }
}

// 60 FPS
// 16.66ms/frame
/**
 * CONTROLS THE LOGIC FOR EACH FRAME
 */
export const physicsLoop = function(){

    const frameStart = performance.now()

    if(!PAUSED && GAME_STARTED){

        const frameStart = performance.now()

        clearRenderQueue()
        updateField()

    }

    let elapsed = performance.now() - frameStart
    // console.log(`Physics step took ${elapsed}ms`)
    physicsTimeout = setTimeout(physicsLoop,clamp((MS/TICKS_PER_FRAME) - elapsed,0,1000))

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

        if(requestFrameID != null)
            cancelAnimationFrame(requestFrameID)

        if(renderTimeout != null)
            clearTimeout(renderTimeout)

        if(physicsTimeout != null)
            clearTimeout(physicsTimeout)

        physicsLoop()
        renderLoop()
    }
}

export const stop = function(){
    setGameStarted(false)
    resetGameState()
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