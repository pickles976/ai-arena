/**
 * MISC UTILITIES WITH GLOBAL SCOPE
 */

import { GameObject } from "./gameObject.js";
import { ENERGY_SCALE,GameObjectManager} from "./globals.js";
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
    var uuid = (Math.random() * 1000000000).toFixed(0)
    return parseFloat(uuid);
}

export const dist = function(obj1 : GameObject,obj2 : GameObject){
    // TODO: add wraparound checking
    return Vector2D.dist(obj1.transform.position,obj2.transform.position)
}

export const checkMemory = function(obj : Ship | Base){

    const size = new TextEncoder().encode(JSON.stringify(obj)).length
    const kiloBytes = size / 1024;

    // console.log(obj.uuid + " memory is " + kiloBytes.toFixed(2) + "kB")

    if (kiloBytes > 8){
        GameObjectManager.getBaseByTeam(obj.team)?.destroy()
        alert("You used up too much memory!")
    }
}