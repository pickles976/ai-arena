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