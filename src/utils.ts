/**
 * MISC UTILITIES WITH GLOBAL SCOPE
 */

/**
 * Sleeps for given amount of time. Synchronous.
 */
function sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function togglePause(){

    console.log(Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList)))

    if(PAUSED){
        PAUSED = false
        console.log("Unpaused!")
        window.requestAnimationFrame(step);
    }else{
        PAUSED = true
        console.log("Paused!")
    }
    
}

function clamp(value : number,min : number,max : number){
    return Math.min(Math.max(min,value),max)
}

/**
 * Returns the energy absorbed from a collision between one object with another object
 * given the mass of the other object and the relative difference in velocity.
 * @param {Object} thisObject 
 * @param {Object} otherObject 
 * @returns number
 */
function energyDiff(thisObject : GameObject,otherObject : GameObject){
    return ENERGY_SCALE * otherObject.transform.mass * (thisObject.transform.velocity.subtract(otherObject.transform.velocity).magnitude ** 2) / 2
}


/**
 * Find insertion point for k
 * @param {list} array 
 * @param {number} k 
 */
function binarySearch(array : Array<number>,k : number){

    // Lower and upper bounds
    let start = 0;
    let end = array.length - 1;
 
    // Traverse the search space
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
 
        // If K is found
        if (array[mid] == k)
            return mid;
 
        else if (array[mid] < k)
            start = mid + 1;
 
        else
            end = mid - 1;
    }

    return end + 1;

}

function randomInRange(min : number,max : number){
    return min + Math.random() * (max-min)
}

function create_UUID(){
    var uuid = (Math.random() * 1000000000).toFixed(0)
    return parseFloat(uuid);
}

function dist(obj1 : GameObject,obj2 : GameObject){
    // TODO: add wraparound checking
    return Vector2D.dist(obj1.transform.position,obj2.transform.position)
}

function checkMemory(obj : Ship | Base){

    const size = new TextEncoder().encode(JSON.stringify(obj)).length
    const kiloBytes = size / 1024;

    // console.log(obj.uuid + " memory is " + kiloBytes.toFixed(2) + "kB")

    if (kiloBytes > 8){
        GameObjectManager.getBaseByTeam(obj.team)?.destroy()
        alert("You used up too much memory!")
    }
}

function spawn(obj : GameObject){
    GameObjectList.push(obj)
}

/**
 * This mutates GameObjectList btw
 */
 function sortGameObjectList(){
    GameObjectList.sort(function(a,b){
        const circleA = a.transform
        const circleB = b.transform
        return circleA.position.x - circleB.position.x
    })

    // save a cached array of X values for operations
    xArray = GameObjectList.map((value) => value.transform.position.x)
}