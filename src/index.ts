export var getGameInfo = function(){
    return GameStateManager.serialize()
}

export var getShipsInfo = function(){
    return { "team0" : GameObjectManager.getShipsByTeam(0).filter((x) => x.toString()),
            "team1" : GameObjectManager.getShipsByTeam(1).filter((x) => x.toString())}
}

export var togglePause = function(){

    if(PAUSED){
        PAUSED = false
        console.log("Unpaused!")
        window.requestAnimationFrame(step);
    }else{
        PAUSED = true
        console.log("Paused!")
    }
    
}

export var stepFrame = function(){
    PAUSED = false
    window.requestAnimationFrame((function() {
        step()
        PAUSED = true
    }))
}

export var setBaseStartCode = function(code : string){
    BaseStartCode = code
}

export var setBaseUpdateCode = function(code : string){
    BaseUpdateCode = code
}

export var setShipStartCode = function(code : string){
    ShipStartCode = code
}

export var setShipUpdateCode = function(code : string){
    ShipUpdateCode = code
}

export var run = function(){
    runGame()
}

export var restart = function(){
    resetGameState()
}

export var getGameState = function(){
    return Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList))
}

export var setCanvas = function(element : HTMLCanvasElement){
    setCanvasElement(element)
}

export var testPackage = function(){
    return "success!"
}

export var setGraphicsEnabled = function(option : boolean){
    GRAPHICS_ENABLED = option
}