/**
 * MISC UTILITIES WITH GLOBAL SCOPE
 */

import { GameObject } from "./gameObject.js";
import { ENERGY_SCALE,GameObjectManager, USER_CODE_MAX_SIZE} from "./globals.js";
import { Base, Ship } from "./objects.js";
import { Vector2D } from "./physics.js";

/**
 * Sleeps for given amount of time. Synchronous.
 */
export const sleep = function(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const clamp = function(value : number,min : number,max : number){
    return Math.min(Math.max(min,value),max)
}

/**
 * Returns the energy absorbed from a collision between one object with another object
 * given the mass of the other object and the relative difference in velocity.
 * @param {Object} thisObject 
 * @param {Object} otherObject 
 * @returns number
 */
export const energyDiff = function(thisObject : GameObject,otherObject : GameObject){
    return ENERGY_SCALE * otherObject.transform.mass * (thisObject.transform.velocity.subtract(otherObject.transform.velocity).magnitude ** 2) / 2
}

export const randomInRange = function(min : number,max : number){
    return min + Math.random() * (max-min)
}

export const create_UUID = function(){
    return Math.floor(Math.random() * 10000000)
}

export const dist = function(obj1 : GameObject,obj2 : GameObject){
    // TODO: add wraparound checking
    return Vector2D.dist(obj1.transform.position,obj2.transform.position)
}

export const checkMemory = function(obj : Ship | Base){

    const size = new TextEncoder().encode(JSON.stringify(obj)).length
    const kiloBytes = size / 1024;

    // console.log(obj.uuid + " memory is " + kiloBytes.toFixed(2) + "kB")

    if (kiloBytes > USER_CODE_MAX_SIZE){
        // GameObjectManager.getBaseByTeam(obj.team)?.destroy()
        console.log("You used up too much memory!")
        return true
    }

    return false
}

export const validVector = function(direction : Vector2D){
    return (direction !== null && 
        direction !== undefined && 
        direction.type === "VECTOR2D" && 
        direction instanceof Vector2D && 
        validNumber(direction.x) && 
        validNumber(direction.y) && 
        validNumber(direction.magnitude))
}

export const validNumber = function(num : number){
    return (num !== null && num !== undefined && !isNaN(+num))
}