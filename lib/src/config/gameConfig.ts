import { FRAMERATE } from "../globals";

// resources and obstacles
export var NUM_ASTEROIDS = 15;
export var NUM_OBSTACLES = 25;
export var NUM_ENERGY_CELLS = 8;

export var OBSTACLE_MASS_RANGE: [number, number] = [20, 200];
export var ASTEROID_METAL_RANGE: [number, number] = [10, 100];
export var ASTEROID_WATER_RANGE: [number, number] = [10, 100];
export var ENERGY_CELL_RANGE: [number, number] = [20, 120];

export var ASTEROID_RESPAWN_TIME = 7.5 * FRAMERATE;
export var OBSTACLE_RESPAWN_TIME = 5 * FRAMERATE;
export var ENERGY_CELL_RESPAWN_TIME = 10 * FRAMERATE;

// multiplier for energy consumption
export var ENERGY_SCALE: number = 25;

// BULLET
export var BULLET_MASS = 15;
export var BULLET_SPEED = 0.125;

// SHIP
export var SHIP_MASS = 50;
export var SHIP_INITIAL_DAMAGE = 5;
export var SHIP_INITIAL_MAX_ENERGY = 100;
export var SHIP_UPGRADE_DAMAGE_COST = 50;
export var SHIP_UPGRADE_MAX_ENERGY_COST = 50;
export var SHIP_RESPAWN_TIME = 15 * FRAMERATE;

export var SHIP_MAX_ENERGY_COST_MULTIPLIER = 1.5;
export var SHIP_DAMAGE_COST_MULTIPLIER = 1.5;

// BASE

export var BASE_MASS = 300;
export var BASE_INITIAL_MAX_ENERGY = 250;

export var BASE_INITIAL_MAX_HEALTH = 100;
export var BASE_INITIAL_REPAIR_RATE = 0.01;

export var BASE_INITIAL_REFINING_RATE = 0.01;
export var BASE_INITIAL_REFINING_EFFICIENCY = 1.0;
export var BASE_INITIAL_SHIP_COST = 200;

export var BASE_INITIAL_HEAL_RATE = 0.01; // how fast the base can heal ships
export var BASE_INITIAL_INTERACT_RADIUS = 50;

// upgrade costs
export var BASE_INITIAL_UPGRADE_HEAL_RATE_COST = 250;
export var BASE_INITIAL_UPGRADE_REPAIR_RATE_COST = 250;
export var BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST = 250;
export var BASE_INITIAL_UPGRADE_MAX_ENERGY_COST = 250;
export var BASE_INITIAL_UPGRADE_MAX_HEALTH_COST = 250;
export var BASE_INITIAL_UPGRADE_REFINING_RATE_COST = 250;
export var BASE_INITIAL_UPGRADE_REFINING_EFFICIENCY_COST = 250;

// amount by which the cost of the upgrades increases
export var BASE_MAX_ENERGY_COST_MULTIPLIER = 1.5;
export var BASE_MAX_HEALTH_COST_MULTIPLIER = 1.5;
export var BASE_HEAL_RATE_COST_MULTIPLIER = 1.5;
export var BASE_REPAIR_RATE_COST_MULTIPLIER = 1.5;
export var BASE_INTERACT_RADIUS_COST_MULTIPLIER = 1.5;
export var BASE_REFINING_RATE_COST_MULTIPLIER = 1.5;
export var BASE_REFINING_EFFICIENCY_COST_MULTIPLIER = 1.5;