/**
 * IMMUTABLE (GAME CONFIG/BALANCE)
 */

const W : number = 1080
const H : number = 720
const FRAMERATE : number = 60.0
const MS : number = 1000.0 / FRAMERATE

// resources and obstacles
const NUM_ASTEROIDS = 15
const NUM_OBSTACLES = 25
const NUM_ENERGY_CELLS = 8

const OBSTACLE_MASS_RANGE : [number, number] = [20,200]
const ASTEROID_METAL_RANGE : [number, number] = [10,100]
const ASTEROID_WATER_RANGE : [number, number] = [10,100]
const ENERGY_CELL_RANGE : [number, number] = [20,120]
const SPEED_RANGE : [number, number] = [0.01,0.05]

const ASTEROID_RESPAWN_TIME = 450
const OBSTACLE_RESPAWN_TIME = 300
const ENERGY_CELL_RESPAWN_TIME = 600

// multiplier for energy consumption
const ENERGY_SCALE : number = 25

// BULLET
const BULLET_MASS = 15
const BULLET_SPEED = 0.125

// SHIP
const SHIP_MASS = 50
const SHIP_INITIAL_DAMAGE = 5
const SHIP_INITIAL_MAX_ENERGY = 100
const SHIP_UPGRADE_DAMAGE_COST = 50
const SHIP_UPGRADE_MAX_ENERGY_COST = 50
const SHIP_RESPAWN_TIME = 900

const SHIP_MAX_ENERGY_COST_MULTIPLIER = 1.5
const SHIP_DAMAGE_COST_MULTIPLIER = 1.5


// BASE

const BASE_MASS = 300
const BASE_INITIAL_MAX_ENERGY = 250

const BASE_INITIAL_MAX_HEALTH = 100
const BASE_INITIAL_REPAIR_RATE = 0.01

const BASE_INITIAL_REFINING_RATE = 0.01
const BASE_INITIAL_REFINING_EFFICIENCY = 1.0
const BASE_INITIAL_SHIP_COST = 200

const BASE_INITIAL_HEAL_RATE = 0.01 // how fast the base can heal ships
const BASE_INITIAL_INTERACT_RADIUS = 50

// upgrade costs
const BASE_INITIAL_UPGRADE_HEAL_RATE_COST = 250
const BASE_INITIAL_UPGRADE_REPAIR_RATE_COST = 250
const BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST = 250
const BASE_INITIAL_UPGRADE_MAX_ENERGY_COST = 250
const BASE_INITIAL_UPGRADE_MAX_HEALTH_COST = 250
const BASE_INITIAL_UPGRADE_REFINING_RATE_COST = 250
const BASE_INITIAL_UPGRADE_REFINING_EFFICIENCY_COST = 250

// amount by which the cost of the upgrades increases
const BASE_MAX_ENERGY_COST_MULTIPLIER = 1.5 
const BASE_MAX_HEALTH_COST_MULTIPLIER = 1.5 
const BASE_HEAL_RATE_COST_MULTIPLIER = 1.5
const BASE_REPAIR_RATE_COST_MULTIPLIER = 1.5
const BASE_INTERACT_RADIUS_COST_MULTIPLIER = 1.5
const BASE_REFINING_RATE_COST_MULTIPLIER = 1.5
const BASE_REFINING_EFFICIENCY_COST_MULTIPLIER = 1.5


/**
 * MUTABLE
 */
let GAME_STARTED = false
let PAUSED : boolean = false
let GlobalRender : Renderer
let GlobalRenderProxy : Renderer
let RenderQueue : { [key:number] : Array<Generator> } = {}
let GameObjectManager : ObjectManager
let GameObjectManagerProxy : ObjectManager
let GameStateManager : StateManager
let GameObjectList : Array<GameObject> = []
const teamColors : Array<string> = ["#FF0000","#0000FF"]
// Ordered x positions of GameObjectList, cached for circleOverlap
let xArray : Array<number> = []