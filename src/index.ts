const getGameInfo = function(){
    return GameStateManager.serialize()
}

const getShipsInfo = function(){
    return { "team0" : GameObjectManager.getShipsByTeam(0).filter((x) => x.toString()),
            "team1" : GameObjectManager.getShipsByTeam(1).filter((x) => x.toString())}
}

const togglePause = function(){

    if(PAUSED){
        PAUSED = false
        console.log("Unpaused!")
        window.requestAnimationFrame(step);
    }else{
        PAUSED = true
        console.log("Paused!")
    }
    
}

const stepFrame = function(){
    PAUSED = false
    window.requestAnimationFrame((function() {
        step()
        PAUSED = true
    }))
}

const setBaseStartCode = function(code : string){
    BaseStartCode = code
}

const setBaseUpdateCode = function(code : string){
    BaseUpdateCode = code
}

const setShipStartCode = function(code : string){
    ShipStartCode = code
}

const setShipUpdateCode = function(code : string){
    ShipUpdateCode = code
}

const run = function(){
    runGame()
}

const restart = function(){
    resetGameState()
}

const getGameState = function(){
    return Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList))
}

const setCanvas = function(element : HTMLCanvasElement){
    setCanvasElement(element)
}

const testPackage = function(){
    return "success!"
}