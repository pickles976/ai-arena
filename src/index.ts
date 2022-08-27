export const getGameInfo = function(){
    return GameStateManager.serialize()
}

export const getShipsInfo = function(){
    return { "team0" : GameObjectManager.getShipsByTeam(0).filter((x) => x.toString()),
            "team1" : GameObjectManager.getShipsByTeam(1).filter((x) => x.toString())}
}

export const togglePause = function(){

    if(PAUSED){
        PAUSED = false
        console.log("Unpaused!")
        window.requestAnimationFrame(step);
    }else{
        PAUSED = true
        console.log("Paused!")
    }
    
}

export const stepFrame = function(){
    PAUSED = false
    window.requestAnimationFrame((function() {
        step()
        PAUSED = true
    }))
}

export const setBaseStartCode = function(code : string){
    BaseStartCode = code
}

export const setBaseUpdateCode = function(code : string){
    BaseUpdateCode = code
}

export const setShipStartCode = function(code : string){
    ShipStartCode = code
}

export const setShipUpdateCode = function(code : string){
    ShipUpdateCode = code
}

export const run = function(){
    runGame()
}

export const restart = function(){
    resetGameState()
}

export const getGameState = function(){
    return Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList))
}

export const setCanvas = function(element : HTMLCanvasElement){
    setCanvasElement(element)
}

export const testPackage = function(){
    return "success!"
}

export const setGraphicsEnabled = function(option : boolean){
    GRAPHICS_ENABLED = option
}

// module.exports = {
//     setGraphicsEnabled,
//     testPackage,
//     setCanvas,
//     getGameState,
//     restart,
//     run,
//     setShipUpdateCode,
//     setShipStartCode,
//     setBaseStartCode,
//     setBaseUpdateCode,
//     stepFrame,
//     togglePause,
//     getShipsInfo,
//     getGameInfo

// }