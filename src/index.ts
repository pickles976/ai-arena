import { GameObject } from './gameObject.js'
import { GameObjectList, GameObjectManager, GameStateManager, PAUSED, resetGameState, setBaseStart, setBaseUpdate, setCanvasElement, setDOMCallBacks, setGraphics, setPaused, realTime, setShipStart, setShipUpdate, framerateSet, ticksPerFrameSet, MS, setPhysCallBacks, TICKS_PER_FRAME } from './globals.js'
import { run, setGameState, stop } from './runner.js'
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
    }else{
        setPaused(true)
        console.log("Paused!")
    }
    
}

export var stepFrame = function(){
    setPaused(false)
    setTimeout(() => setPaused(true),MS)
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

export var stopGame = function(){
    stop()
}

export var restart = function(){
    resetGameState()
}

export var getGameState = function(){
    return Serializer.deserializeGameObjectList(getGameStateString())
}

export var getGameStateString = function(){
    return Serializer.minifyGameObjectList(GameObjectList)
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

export var setPhysicsCallbacks = function(value : Function){
    setPhysCallBacks(value)    
}

export var setRealTime = function(value : boolean){
    realTime(value)
}

export var setFramerate = function(value : number){
    framerateSet(value)
}

export var setTicksPerFrame = function(value : number){
    ticksPerFrameSet(value)
}

export var loadGameStateFromString = function(gameState : string){
    const objList : GameObject[] = Serializer.deminifyGameObjectList(gameState)
    console.log(objList)
    setGameState(objList)
}

export var getTicksPerFrame = function(){
    return TICKS_PER_FRAME
}