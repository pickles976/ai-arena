/**
 * GLOBAL VARIABLES
 */
const W : number = 1080
const H : number = 720
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
const BULLET_MASS = 15
const BASE_MASS = 300

const SHIP_INITIAL_MAX_ENERGY = 100

const BASE_INITIAL_MAX_ENERGY = 250

const BASE_INITIAL_REFINING_RATE = 0.01
const BASE_INITIAL_SHIP_COST = 200

const BASE_INITIAL_HEAL_RATE = 0.01
const BASE_INITIAL_INTERACT_RADIUS = 50

// upgrade costs
const BASE_INITIAL_UPGRADE_HEAL_RATE_COST = 250
const BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST = 250
const BASE_INITIAL_UPGRADE_MAX_ENERGY_COST = 250