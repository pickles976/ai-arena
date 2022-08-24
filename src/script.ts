
function initializeGameState(){

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

    // get the canvas
    // @ts-ignore
    const gameCanvas : HTMLCanvasElement = document.getElementById("game-canvas")
    gameCanvas.width = W;
    gameCanvas.height = H;

    GlobalRender = new Renderer(gameCanvas)
    GlobalRenderProxy = createRendererProxy(GlobalRender)

}


// 60 FPS
// 16.66ms/frame
/**
 * CONTROLS THE LOGIC FOR EACH FRAME
 */
function step(){

    if(!PAUSED){

    const frameStart = performance.now()

    updateField()
    render()
    drawInfoPanels()

    let elapsed = performance.now() - frameStart
    console.log(elapsed)
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
function updateField(){

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
function render(){

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

initializeGameState()
window.requestAnimationFrame(step);