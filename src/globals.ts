/**
 * IMMUTABLE (GAME CONFIG/BALANCE)
 */

import { GameObject } from "./gameObject.js"
import { ObjectManager } from "./objectManager.js"
import { ProxyMan } from "./objectProxies.js"
import { Renderer } from "./renderer.js"
import { StateManager } from "./stateManager.js"

export var W : number = 1080
export var H : number = 720
export var FRAMERATE : number = 60.0
export var MS : number = 1000.0 / FRAMERATE

// resources and obstacles
export var NUM_ASTEROIDS = 15
export var NUM_OBSTACLES = 25
export var NUM_ENERGY_CELLS = 8

export var OBSTACLE_MASS_RANGE : [number, number] = [20,200]
export var ASTEROID_METAL_RANGE : [number, number] = [10,100]
export var ASTEROID_WATER_RANGE : [number, number] = [10,100]
export var ENERGY_CELL_RANGE : [number, number] = [20,120]
export var SPEED_RANGE : [number, number] = [0.01,0.05]

export var ASTEROID_RESPAWN_TIME = 450
export var OBSTACLE_RESPAWN_TIME = 300
export var ENERGY_CELL_RESPAWN_TIME = 600

// multiplier for energy consumption
export var ENERGY_SCALE : number = 25

// BULLET
export var BULLET_MASS = 15
export var BULLET_SPEED = 0.125

// SHIP
export var SHIP_MASS = 50
export var SHIP_INITIAL_DAMAGE = 5
export var SHIP_INITIAL_MAX_ENERGY = 100
export var SHIP_UPGRADE_DAMAGE_COST = 50
export var SHIP_UPGRADE_MAX_ENERGY_COST = 50
export var SHIP_RESPAWN_TIME = 900

export var SHIP_MAX_ENERGY_COST_MULTIPLIER = 1.5
export var SHIP_DAMAGE_COST_MULTIPLIER = 1.5


// BASE

export var BASE_MASS = 300
export var BASE_INITIAL_MAX_ENERGY = 250

export var BASE_INITIAL_MAX_HEALTH = 100
export var BASE_INITIAL_REPAIR_RATE = 0.01

export var BASE_INITIAL_REFINING_RATE = 0.01
export var BASE_INITIAL_REFINING_EFFICIENCY = 1.0
export var BASE_INITIAL_SHIP_COST = 200

export var BASE_INITIAL_HEAL_RATE = 0.01 // how fast the base can heal ships
export var BASE_INITIAL_INTERACT_RADIUS = 50

// upgrade costs
export var BASE_INITIAL_UPGRADE_HEAL_RATE_COST = 250
export var BASE_INITIAL_UPGRADE_REPAIR_RATE_COST = 250
export var BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST = 250
export var BASE_INITIAL_UPGRADE_MAX_ENERGY_COST = 250
export var BASE_INITIAL_UPGRADE_MAX_HEALTH_COST = 250
export var BASE_INITIAL_UPGRADE_REFINING_RATE_COST = 250
export var BASE_INITIAL_UPGRADE_REFINING_EFFICIENCY_COST = 250

// amount by which the cost of the upgrades increases
export var BASE_MAX_ENERGY_COST_MULTIPLIER = 1.5 
export var BASE_MAX_HEALTH_COST_MULTIPLIER = 1.5 
export var BASE_HEAL_RATE_COST_MULTIPLIER = 1.5
export var BASE_REPAIR_RATE_COST_MULTIPLIER = 1.5
export var BASE_INTERACT_RADIUS_COST_MULTIPLIER = 1.5
export var BASE_REFINING_RATE_COST_MULTIPLIER = 1.5
export var BASE_REFINING_EFFICIENCY_COST_MULTIPLIER = 1.5


/**
 * MUTABLE
 */
export var GRAPHICS_ENABLED = true
export var GAME_STARTED = false
export var PAUSED : boolean = false
export var REALTIME : boolean = true
export var GlobalRender : Renderer
export var GlobalRenderProxy : Renderer
export var RenderQueue : { [key:number] : Array<Generator> } = {}
export var GameObjectManager : ObjectManager
export var GameObjectManagerProxy : ObjectManager
export var GameStateManager : StateManager
export var GameObjectList : Array<GameObject> = []
export var teamColors : Array<string> = ["#FF0000","#0000FF"]

// Ordered x positions of GameObjectList, cached for circleOverlap
export var xArray : Array<number> = []

export var BaseStartCode : string = ""
export var BaseUpdateCode : string = ""
export var ShipStartCode : string = ""
export var ShipUpdateCode : string = ""

interface CodeStorage {
    BaseStartCode : string
    BaseUpdateCode : string
    ShipStartCode : string
    ShipUpdateCode : string
}

export var UserCode : CodeStorage[] = [
    {
        BaseStartCode : "",
        BaseUpdateCode : "",
        ShipStartCode : "",
        ShipUpdateCode : ""
    },
    {
        BaseStartCode : "",
        BaseUpdateCode : "",
        ShipStartCode : "",
        ShipUpdateCode : ""
    }
]


// HTML ELEMENTS
export var GlobalCanvas : HTMLCanvasElement
export var DOMCallbacks : Function = function(){}

/*
    SETTERS
*/
export var setPaused = function(value : boolean){
    PAUSED = value
}

export var setRealtime = function(value : boolean){
    REALTIME = value
}

export var setBaseStart = function(team: number, code : string){
    UserCode[team]['BaseStartCode'] = code
}

export var setBaseUpdate = function(team: number, code : string){
    UserCode[team]['BaseUpdateCode'] = code
}

export var setShipStart = function(team: number, code : string){
    UserCode[team]['ShipStartCode'] = code
}

export var setShipUpdate = function(team: number, code : string){
    UserCode[team]['ShipUpdateCode'] = code
    
}

export var setGraphics = function(value : boolean){
    GRAPHICS_ENABLED = value
}

export var setCanvasElement = function(canvasElement : HTMLCanvasElement){
    GlobalCanvas = canvasElement
    GlobalCanvas.width = W;
    GlobalCanvas.height = H;
}

export var setGameStarted = function(value : boolean){
    GAME_STARTED = value
}

export var setGameStateManager = function(value : StateManager){
    GameStateManager = value
}

export var setGameObjectManager = function(value: ObjectManager){
    GameObjectManager = value
    GameObjectManagerProxy = ProxyMan.createObjectManagerProxy(GameObjectManager)
}

export var setRenderer = function(value : Renderer){
    GlobalRender = value
    GlobalRenderProxy = ProxyMan.createRendererProxy(GlobalRender)
}

export var resetGameState = function(){
    GAME_STARTED = false
    GameObjectList = []
    RenderQueue = {}
}

export const clearRenderQueue = function (){
    RenderQueue = {}
}

/**
 * This mutates GameObjectList btw
 */
 export const sortGameObjectList = function(){
    GameObjectList.sort(function(a,b){
        const circleA = a.transform
        const circleB = b.transform
        return circleA.position.x - circleB.position.x
    })

    // save a cached array of X values for operations
    xArray = GameObjectList.map((value) => value.transform.position.x)
}

export const spawn = function(obj : GameObject){
    GameObjectList.push(obj)
}

export var setDOMCallBacks = function(value : Function){
    DOMCallbacks = value
}