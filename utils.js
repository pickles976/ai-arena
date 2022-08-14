/**
 * MISC UTILITIES WITH GLOBAL SCOPE
 */

/**
 * 
 * @param {*} ms 
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function togglePause(){

    if(PAUSED){
        PAUSED = false
        console.log("Unpaused!")
        window.requestAnimationFrame(step);
    }else{
        PAUSED = true
        console.log("Paused!")
    }
}

function clamp(value,min,max){
    return Math.min(Math.max(min,value),max)
}

function energyDiff(thisObject,otherObject){
    return energyScale * otherObject.circle.mass * (thisObject.circle.velocity.subtract(otherObject.circle.velocity).magnitude ** 2) / 2
}