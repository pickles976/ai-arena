import { GameObjectList, GameObjectManager, GameStateManager, PAUSED, resetGameState, setBaseStart, setBaseUpdate, setCanvasElement, setDOMCallBacks, setGraphics, setPaused, setShipStart, setShipUpdate } from './globals.js'
import { run, step } from './runner.js'
import { Serializer } from './serializer.js'

export var getGameInfo = function(){
    return JSON.parse(GameStateManager.serialize())
}

export var getShipsInfo = function(){
    return { "team0" : GameObjectManager.getShipsByTeam(0).filter((x) => x.toData()),
            "team1" : GameObjectManager.getShipsByTeam(1).filter((x) => x.toData())}
}

export var getBasesInfo = function(){
    return { "team0" : GameObjectManager.getBaseByTeam(0).toData(),
            "team1" : GameObjectManager.getBaseByTeam(1).toData()}
}

export var togglePause = function(){

    if(PAUSED){
        setPaused(false)
        console.log("Unpaused!")
        window.requestAnimationFrame(step);
    }else{
        setPaused(true)
        console.log("Paused!")
    }
    
}

export var stepFrame = function(){
    setPaused(false)
    window.requestAnimationFrame((function() {
        step()
        setPaused(true)
    }))
}

export var setBaseStartCode = function(team: number, code : string){
    
    setBaseStart(team,code)
}

export var setBaseUpdateCode = function(team: number,code : string){
    setBaseUpdate(team,code)
}

export var setShipUpdateCode = function(team: number,code : string){
    setShipUpdate(team,code)
}

export var setShipStartCode = function(team: number,code : string){
    setShipStart(team,code)
}

export var runGame = function(){
    run()
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

export var setGraphicsEnabled = function(option : boolean){
    setGraphics(option)
}

export var testPackage = function(){
    return "ai-arena package has loaded successfully!"
}

export var setUICallbacks = function(value : Function){
    setDOMCallBacks(value)    
}