/**
 * nlog(n) collision detection for sorted array of circular objects
 * TODO: REMOVE gameObjArray argument, just use GameObjectList
 * @param {list<Circle>} circleArray 
 */
const checkForCollisions = function(gameObjArray : Array<GameObject>){

    let i = 0;
    let pairs = []

    while (i < gameObjArray.length) {

        let c1 = gameObjArray[i].transform;
        let r1 = gameObjArray[i].collider.radius
        let j = 1;

        //ITERATE BACKWARDS IN CIRCLEARRAY
        let collision = true
        while (collision){

            collision = false
            let index = i - j

            // IF WE HAVE LOOPED AROUND
            if (index < 0){
                index += gameObjArray.length
            }

            let c2 = gameObjArray[index].transform
            let r2 = gameObjArray[index].collider.radius
            let dist = 100000;

            // normal collision
            if (index < i){
                dist = c1.position.x - c2.position.x
            } else {
                dist = c1.position.x + W - c2.position.x
            }

            // POSSIBLE COLLISION
            if (Math.abs(dist) < (r1 + r2)){
                // the checking object will always be first in the pair
                pairs.push([gameObjArray[i],gameObjArray[index]])
                collision = true
            }

            j++
        }
        
        i++;
    }

    // loop through all possible collision pairs
    i = 0;
    while (i < pairs.length){

        const obj1 = pairs[i][0]
        const obj2 = pairs[i][1]

        if(obj1.type !== "DEAD" && obj2.type !== "DEAD"){

            const c1 = obj1.transform
            const r1 = obj1.collider.radius
            const c2 = obj2.transform
            const r2 = obj2.collider.radius
            let c1Pos = c1.position
            let c2Pos = c2.position
            
            // check if it's a wraparound collision in the X direction
            if (c1.position.x < c2.position.x){
                c2Pos = new Vector2D(c2.position.x - W,c2.position.y)
            }

            // temporary distance calculation
            let dist = c1Pos.subtract(c2Pos).magnitude

            // check for wraparound collision in the Y direction
            if (dist > (r1 + r2)){

                let tempC2 = c2Pos.copy()

                // shift the C2 up or down
                if (c1.position.y < c2.position.y){
                    tempC2.y -= H
                }else{
                    tempC2.y += H
                }

                // check if there is collision after the shift
                let tempDist = c1Pos.subtract(tempC2).magnitude
                if (tempDist < (r1 + r2)){
                    dist = tempDist // update with shift
                    c2Pos = tempC2
                }
            }

            //check for collision
            if (dist < (r1 + r2)){

                let newVelocities = collide(c1Pos,c2Pos,c1.velocity,c2.velocity,c1.mass,c2.mass) 
                obj1.collide(obj2)
                obj2.collide(obj1)

                c1.velocity = newVelocities[0]
                c2.velocity = newVelocities[1]
            }
        }

        i++;
    }
}

/**
 * Perform collision calculations between to objects and returns their respective vectors
 * https://research.ncl.ac.uk/game/mastersdegree/gametechnologies/physicstutorials/5collisionresponse/Physics%20-%20Collision%20Response.pdf
 * @returns [v1,v2]
 */
const collide = function(p1 : Vector2D,p2 : Vector2D,v1 : Vector2D,v2 : Vector2D,m1 : number,m2 : number){

    let e = 0.15;
    let oomf = 0.001;
    let collisionNormal = p1.subtract(p2).normal()
    let vRel = v1.subtract(v2) // relative velocity
    let tVel = -collisionNormal.dot(vRel.multiply(1+e)) // total velocity of system

    // let delta = collisionNormal.multiply((tVel / 2) + oomf)
    let impulse = tVel / ((1.0/m1) + (1.0/m2))
    let delta1 = collisionNormal.multiply((impulse/m1) + oomf)
    let delta2 = collisionNormal.multiply((impulse/m2) + oomf)
    
    return [v1.add(delta1),v2.subtract(delta2)]
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
const overlapCircle = function(position : Vector2D,radius : number){

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