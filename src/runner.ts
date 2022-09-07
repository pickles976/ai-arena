import { checkForCollisions } from './collisions.js'
import { DummyRenderer } from './dummyRenderer.js'
import { GameObject } from './gameObject.js'
import { clearRenderQueue, DOMCallbacks, GameObjectList, GameObjectManager, GAME_STARTED, GlobalCanvas, GlobalRender, GRAPHICS_ENABLED, H, MS, PAUSED, PhysCallbacks, REALTIME, RenderQueue, resetGameState, setGameObjectList, setGameObjectManager, setGameStarted, setGameStateManager, setNodeJS, setRenderer, sortGameObjectList, spawn, STREAMING, TICKS_PER_FRAME, W } from './globals.js'
import { ObjectManager } from './objectManager.js'
import { Base, Ship } from './objects.js'
import { Vector2D } from './physics.js'
import { Renderer } from './renderer.js'
import { StateManager } from './stateManager.js'
import { clamp, create_UUID } from './utils.js'

let requestFrameID : number = null
let physicsTimeout : NodeJS.Timeout[] = []
let renderTimeout : NodeJS.Timeout = null

export const setGameState = function(goList : GameObject[]){
    clearPhysTimeouts()
    setGameObjectList(goList)
    GameObjectManager.indexObjects(GameObjectList)
}

export const initializeGameState = function(){

    setGameStarted(true)

    // INITALIZE GAME STATE MANAGER
    setGameStateManager(new StateManager())

    // CREATE OUR SHIT
    setGameObjectManager(new ObjectManager())

    spawn(new Base(create_UUID(),new Vector2D(W/4,H/2),500,0))
    spawn(new Base(create_UUID(),new Vector2D(3*W/4,H/2),500,1))

    GameObjectManager.indexObjects(GameObjectList)

    spawn(new Ship(create_UUID(),new Vector2D(W/4,H/4),new Vector2D(0,0),new Vector2D(0,0),100,0))
    spawn(new Ship(create_UUID(),new Vector2D(3*W/4,3*H/4),new Vector2D(0,0),new Vector2D(0,0),100,1))

    // populate the game field
    GameObjectManager.start()

    if (GRAPHICS_ENABLED)
        setRenderer(new Renderer(H,W,GlobalCanvas))
    else
        // @ts-ignore
        setRenderer(new DummyRenderer())

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

        clearRenderQueue()
        updateField()
        PhysCallbacks()

    }

    let elapsed = performance.now() - frameStart
    // console.log(`Physics step took ${elapsed}ms`)
    // console.log(clamp((MS/TICKS_PER_FRAME) - elapsed,0,1000))
    physicsTimeout.shift()
    physicsTimeout.push(setTimeout(physicsLoop,clamp(MS - elapsed,0,1000)))

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
    if (!STREAMING){
        for(let i = GameObjectList.length - 1; i >= 0; i--){
            const value = GameObjectList[i]

            if(value.type === "SHIP" && value instanceof Ship)
                value.update()
            else if(value.type === "BASE" && value instanceof Base)
                value.update()
        }
    }

}

/**
 * Renders a frame
 */
const render = function(){

    // call the rendering functions for each object. This doesn't actually render,
    // it queues up rendering calls in the queue
    for(let i = 0; i < GameObjectList.length; i++){
        if(GameObjectList[i] != null)
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
        setupLoops()
    }
}

export const setupLoops = function(){
    clearTimeouts()
    // set multiple timeouts over interval. So one timeout at 16ms, one at 32ms, etc
    for(let i = 0; i < TICKS_PER_FRAME; i++){
        physicsTimeout.push(setTimeout(physicsLoop,(MS / TICKS_PER_FRAME) * i))
    }
    renderLoop()
}

const clearTimeouts = function(){
    clearPhysTimeouts()
    clearRenderTimeouts()
}

const clearRenderTimeouts = function(){
    if(requestFrameID != null)
        cancelAnimationFrame(requestFrameID)

    if(renderTimeout != null)
        clearTimeout(renderTimeout)
}

const clearPhysTimeouts = function(){
    for (let timeout of physicsTimeout){
        clearTimeout(timeout)
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