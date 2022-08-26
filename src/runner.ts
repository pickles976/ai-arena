
const initializeGameState = function(){

    GAME_STARTED = true

    // INITALIZE GAME STATE MANAGER
    GameStateManager = new StateManager()

    // CREATE OUR SHIT
    GameObjectManager = new ObjectManager()
    GameObjectManagerProxy = createObjectManagerProxy(GameObjectManager)

    spawn(new Base(create_UUID(),new Vector2D(W/4,H/2),500,0))
    spawn(new Base(create_UUID(),new Vector2D(3*W/4,H/2),500,1))

    GameObjectManager.indexObjects(GameObjectList)

    spawn(new Ship(create_UUID(),new Vector2D(W/4,H/4),100,0))
    spawn(new Ship(create_UUID(),new Vector2D(3*W/4,3*H/4),100,1))

    // populate the game field
    GameObjectManager.start()

    GlobalRender = new Renderer(GlobalCanvas)
    GlobalRenderProxy = createRendererProxy(GlobalRender)

}

const resetGameState = function(){
    GAME_STARTED = false
    GameObjectList = []
    RenderQueue = {}
}


// 60 FPS
// 16.66ms/frame
/**
 * CONTROLS THE LOGIC FOR EACH FRAME
 */
const step = function(){

    if(!PAUSED){

    const frameStart = performance.now()

    updateField()
    render()

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

    RenderQueue = {}
}

const runGame = function(){
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

const setCanvasElement = function(canvasElement : HTMLCanvasElement){
    GlobalCanvas = canvasElement
    GlobalCanvas.width = W;
    GlobalCanvas.height = H;
}