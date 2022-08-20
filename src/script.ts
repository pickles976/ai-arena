// Serializer.test()

GameStateManager = new StateManager()

// CREATE OUR SHIT
GameObjectManager = new ObjectManager()

GameObjectList.push(new Ship(create_UUID(),new Vector2D(W/4,H/4),100,0))
GameObjectList.push(new Base(create_UUID(),new Vector2D(W/4,H/2),250,0))

GameObjectList.push(new Ship(create_UUID(),new Vector2D(3*W/4,3*H/4),100,1))
GameObjectList.push(new Base(create_UUID(),new Vector2D(3*W/4,H/2),250,1))

// populate the game field
GameObjectManager.start()

// console.log(JSON.stringify(GameObjectList))

// get the canvas
// @ts-ignore
const gameCanvas : HTMLCanvasElement = document.getElementById("game-canvas")
gameCanvas.width = W;
gameCanvas.height = H;

GlobalRender = new Renderer(gameCanvas)

let frameStart = performance.now();

// 60 FPS
// 16.66ms/frame

/**
 * CONTROLS THE LOGIC FOR EACH FRAME
 */
function step(){

    if(!PAUSED){

    frameStart = performance.now()

    updateField()
    render()
    // drawInfoPanels()

    let elapsed = performance.now() - frameStart
    // console.log(elapsed)
    sleep(MS - elapsed)
    window.requestAnimationFrame(step);

    }

}

/**
 * Runs in order:
 * 
 * Dead object collection
 * Point-mass simulation
 * Collisions
 * Queue up "dumb" object spawning
 * AI Logic
 * 
 */
function updateField(){

    // SORT BY X POSITION (ALLOWS US TO DO COLLISION CHECKS)
    sortGameObjectList()

    // COLLECT DEAD OBJECTS, SIMULATE ALIVE ONES
    for(let i = GameObjectList.length - 1; i >= 0; i--){

        const value = GameObjectList[i]

        if(value.type === "DEAD")
            GameObjectList.splice(i,1)
        else
            value.simulate(MS)
    }

    // SORT BY X POSITION
    sortGameObjectList()

    checkForCollisions(GameObjectList)

    // manage the game objects
    GameObjectManager.update()

    // RUN AI LOGIC
    for(let i = GameObjectList.length - 1; i >= 0; i--){
        const value = GameObjectList[i]

        if(value.type === "SHIP" && value instanceof Ship)
            value.update()
    }

}

/**
 * Renders a frame
 */
function render(){

    // call the rendering functions for each object. This doesn't actually render,
    // it queues up rendering calls in the queue
    for(let i = 0; i < GameObjectList.length; i++){
        GameObjectList[i].render()
    }

    GlobalRender.newFrame()

    // render by depth
    for (const [key,value] of Object.entries(RenderQueue)){
        for (const renderFunc of value){
            renderFunc.next()
        }
    }

    RenderQueue = {}
}

window.requestAnimationFrame(step);

/**
 * nlog(n) collision detection for sorted array of circular objects
 * TODO: REMOVE gameObjArray argument, just use GameObjectList
 * @param {list<Circle>} circleArray 
 */
function checkForCollisions(gameObjArray : Array<GameObject>){

    let i = 0;
    let pairs = []

    while (i < gameObjArray.length) {

        let c1 = gameObjArray[i].circle;
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

            let c2 = gameObjArray[index].circle
            let dist = 100000;

            // normal collision
            if (index < i){
                dist = c1.position.x - c2.position.x
            } else {
                dist = c1.position.x + W - c2.position.x
            }

            // POSSIBLE COLLISION
            if (Math.abs(dist) < (c1.radius + c2.radius)){
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
        const c1 = obj1.circle
        const c2 = obj2.circle
        let c1Pos = c1.position
        let c2Pos = c2.position
        
        // check if it's a wraparound collision in the X direction
        if (c1.position.x < c2.position.x){
            c2Pos = new Vector2D(c2.position.x - W,c2.position.y)
        }

        // temporary distance calculation
        let dist = c1Pos.subtract(c2Pos).magnitude

        // check for wraparound collision in the Y direction
        if (dist > (c1.radius + c2.radius)){

            let tempC2 = c2Pos.copy()

            // shift the C2 up or down
            if (c1.position.y < c2.position.y){
                tempC2.y -= H
            }else{
                tempC2.y += H
            }

            // check if there is collision after the shift
            let tempDist = c1Pos.subtract(tempC2).magnitude
            if (tempDist < (c1.radius + c2.radius)){
                dist = tempDist // update with shift
                c2Pos = tempC2
            }
        }

        //check for collision
        if (dist < (c1.radius + c2.radius)){

            let newVelocities = collide(c1Pos,c2Pos,c1.velocity,c2.velocity,c1.mass,c2.mass) 
            obj1.collide(obj2)
            obj2.collide(obj1)

            c1.velocity = newVelocities[0]
            c2.velocity = newVelocities[1]
        }

        i++;
    }
}

/**
 * Perform collision calculations between to objects and returns their respective vectors
 * https://research.ncl.ac.uk/game/mastersdegree/gametechnologies/physicstutorials/5collisionresponse/Physics%20-%20Collision%20Response.pdf
 * @returns [v1,v2]
 */
 function collide(p1 : Vector2D,p2 : Vector2D,v1 : Vector2D,v2 : Vector2D,m1 : number,m2 : number){

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
 * This mutates GameObjectList btw
 */
function sortGameObjectList(){
    GameObjectList.sort(function(a,b){
        const circleA = a.circle
        const circleB = b.circle
        return circleA.position.x - circleB.position.x
    })

    // save a cached array of X values for operations
    xArray = GameObjectList.map((value) => value.circle.position.x)
}