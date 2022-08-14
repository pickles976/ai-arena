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


/**
 * Find insertion point for k
 * @param {list} array 
 * @param {number} k 
 */
function binarySearch(array,k){

    // Lower and upper bounds
    let start = 0;
    let end = array.length - 1;
 
    // Traverse the search space
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
 
        // If K is found
        if (arr[mid] == k)
            return mid;
 
        else if (arr[mid] < k)
            start = mid + 1;
 
        else
            end = mid - 1;
    }

    return end + 1;

}

// TODO: add overlap circle utility
// Create virtual circle object
// use binary search to find index to iterate over in sorted array
// loop forwards and backwards in sorted array to detect overlap
// return list of overlapping objects