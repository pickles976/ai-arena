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
    return energyScale * otherObject.transform.mass * (thisObject.transform.velocity.subtract(otherObject.transform.velocity).magnitude ** 2) / 2
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

/**
 * Detects collisions
 * Uses binary search to find position in array, then iterates backwards and forwards
 * in array to detect all possible collisions. Possible collisions are filtered and
 * returned as an array of collided with objects.
 * @param {Vector2D} position 
 * @param {number} radius 
 * @returns 
 */
function overlapCircle(position : Vector2D,radius : number){

    if (xArray.length <= 0){
        return []
    }

    const i = binarySearch(xArray,position.x)
    
    const possible = []

    // loop backwards and forwards through array
    let collision = true
    let j = 1

    // iterate backwards
    while (collision){

        collision = false
        let index = i - j

        // IF WE HAVE LOOPED AROUND
        if (index < 0){
            index += GameObjectList.length
        }

        let c2 = GameObjectList[index].transform
        let r2 = GameObjectList[index].collider.radius
        let dist = 100000;

        // normal collision
        if (index < i){
            dist = position.x - c2.position.x
        } else {
            dist = position.x + W - c2.position.x
        }

        // POSSIBLE COLLISION
        if (Math.abs(dist) < (radius + r2)){
            // the checking object will always be first in the pair
            possible.push(GameObjectList[index])
            collision = true
        }

        j++
    }

    collision = true
    j = 0

    // iterate forwards
    while (collision){

        collision = false
        let index = i + j

        // IF WE HAVE LOOPED AROUND
        if (index >= GameObjectList.length){
            index -= GameObjectList.length
        }

        let c2 = GameObjectList[index].transform
        let r2 = GameObjectList[index].collider.radius
        let dist = 100000;

        // normal collision
        if (index >= i){
            dist = position.x - c2.position.x
        } else {
            dist = position.x + W - c2.position.x
        }

        // POSSIBLE COLLISION
        if (Math.abs(dist) < (radius + r2)){
            // the checking object will always be first in the pair
            possible.push(GameObjectList[index])
            collision = true
        }

        j++
    }

    const collisions = []
    let k = 0
    while(k < possible.length){

        const obj = possible[k]
        const c2 = obj.transform
        let r2 = obj.collider.radius
        let c2Pos = c2.position

        // check if it's a wraparound collision in the X direction
        if (position.x < c2.position.x){
            c2Pos = new Vector2D(c2.position.x - W,c2.position.y)
        }

        // temporary distance calculation
        let dist = position.subtract(c2Pos).magnitude

        // check for wraparound collision in the Y direction
        if (dist > (radius + r2)){

            let tempC2 = c2Pos.copy()

            // shift the C2 up or down
            if (position.y < c2.position.y){
                tempC2.y -= H
            }else{
                tempC2.y += H
            }

            // check if there is collision after the shift
            let tempDist = position.subtract(tempC2).magnitude
            if (tempDist < (radius + r2)){
                dist = tempDist // update with shift
                c2Pos = tempC2
            }
        }

        //check for collision
        if (dist < (radius + r2)){
            collisions.push(obj)
        }

        k++;
    }

    const debug = false
    if (debug){
        const color = "rgba(255, 255, 0, 0.5)"
        GlobalRender.drawCircle(position,radius,color)
        possible.map((c) => {
            GlobalRender.drawLine(position,c.transform.position,"rgba(255, 255, 255, 0.5)")
        })
        collisions.map((c) => {
            GlobalRender.drawLine(position,c.transform.position,color)
        })
    }

    return collisions
}

function randomInRange(min : number,max : number){
    return min + Math.random() * (max-min)
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = '9xxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*10)%10 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(9);
    });
    return parseFloat(uuid);
}

function dist(obj1 : GameObject,obj2 : GameObject){
    return Vector2D.dist(obj1.transform.position,obj2.transform.position)
}