import { GameObject } from './gameObject.js'
import { GameObjectList, GameObjectManager, GameStateManager, PAUSED, resetGameState, setBaseStart, setBaseUpdate, setCanvasElement, setDOMCallBacks, setGraphics, setPaused, realTime, setShipStart, setShipUpdate, framerateSet, ticksPerFrameSet, MS, setPhysCallBacks, TICKS_PER_FRAME, setIsStreaming, setNodeJS, setGameEndCallback } from './globals.js'
import { run, setGameState, setupLoops, stop } from './runner.js'
import { Serializer } from './serializer.js'

export var getGameInfo = function(){
    return JSON.parse(GameStateManager.serialize())
}

export var getGameInfoString = function(){
    return GameStateManager.serialize()
}

export var getShipsInfo = function(){
    return { "team0" : GameObjectManager.getShipsByTeam(0).filter((x) => x.toData()),
            "team1" : GameObjectManager.getShipsByTeam(1).filter((x) => x.toData())}
}

export var getBasesInfo = function(){
    return { "team0" : GameObjectManager.getBaseByTeam(0).toData(),
            "team1" : GameObjectManager.getBaseByTeam(1).toData()}
}

export var getWinner = function(){
    if (GameObjectManager.getBaseByTeam(0) === undefined){
        return 0
    }

    if (GameObjectManager.getBaseByTeam(1) === undefined){
        return 1
    }

    return 2
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
    return Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList))
}

export var setCanvas = function(element : HTMLCanvasElement){
    setCanvasElement(element)
}

export var setGraphicsEnabled = function(option : boolean){
    setGraphics(option)
}

export var testPackage = function(){
    Serializer.test()
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

export var updateGameSpeed = function(){
    setupLoops()
}

export var getTicksPerFrame = function(){
    return TICKS_PER_FRAME
}

export var setStreaming = function(value : boolean){
    setIsStreaming(value)
}

export var setNode = function(value : boolean){
    setNodeJS(value)
}

export var getGamePacket = function(){
    return Serializer.packetifyGameObjectList(GameObjectList)
}

export var loadGamePacket = function(gameState : Float32Array){
    let objList : GameObject[] = Serializer.unpacketify(gameState)
    setGameState(objList)
}

export var getScorePacket = function(){
    return GameStateManager.packet()
}

export var loadScorePacket = function(arr : Float32Array){
    GameStateManager.loadFromPacket(arr)
}

export var onGameEnd = function(value : Function){
    setGameEndCallback(value)
}