/**
 * GLOBAL VARIABLES
 */

const W : number = 640
const H : number = 480
const FRAMERATE : number = 60.0
const MS : number = 1000.0 / FRAMERATE
let PAUSED : boolean = false
let GlobalRender : Renderer
let GlobalRenderProxy : Renderer
let RenderQueue : { [key:number] : Array<Generator> } = {}
let GameObjectManager : ObjectManager
let GameObjectManagerProxy : ObjectManager
let GameStateManager : StateManager
const GameObjectList : Array<GameObject> = []
const teamColors : Array<string> = ["#FF0000","#0000FF"]

// Ordered x positions of GameObjectList, cached for circleOverlap
let xArray : Array<number> = []

// multiplier for energy consumption
const energyScale : number = 25

const SHIP_MASS = 50
const BASE_MASS = 300

const SHIP_BASE_MAX_ENERGY = 100