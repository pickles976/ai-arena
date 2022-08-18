/**
 * GLOBAL VARIABLES
 */

const W = 640
const H = 480
const FRAMERATE = 60.0
const MS = 1000.0 / FRAMERATE
let PAUSED = false
let GlobalRender = {}
let RenderQueue = {}
let GameObjectManager = {}
const GameObjectList = []
const teamColors = ["#FF0000","#0000FF"]

// Ordered x positions of GameObjectList, cached for circleOverlap
let xArray = []

// multiplier for energy consumption
const energyScale = 10