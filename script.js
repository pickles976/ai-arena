let gameObjectDict = {}

// create random circles
let numAsteroids = 20;

gameObjectDict[0] = new Ship(new Vector2D(Math.random()*W,Math.random()*H),1000)
for(let i = 1;i < numAsteroids; i++){
    
    let randomPos = new Vector2D(Math.random()*W,Math.random()*H);
    let speed = 0.05;
    let randomVel = new Vector2D((Math.random()-0.5)*speed,(Math.random()-0.5)*speed);

    let gameObject = {}

    if (Math.random() > 0.85){
        const energy = 20 + (Math.random() * 100)
        gameObject = new EnergyCell(randomPos,randomVel,energy)
    } 
    else 
    { 
        const metal = 10 + (Math.random() * 100)
        const water = 10 + (Math.random() * 100)
        gameObject = new Asteroid(randomPos,randomVel,metal,water)
    }

    gameObjectDict[i] = gameObject;
}

console.log(JSON.stringify(gameObjectDict))

// get the canvas
gameCanvas = document.getElementById("game-canvas")
gameCanvas.width = W;
gameCanvas.height = H;
ctx = gameCanvas.getContext("2d");

GlobalRender = new Renderer(gameCanvas)

let frameStart = performance.now();

// 60 FPS
// 16.66ms/frame
function step(){

    if(!PAUSED){

    frameStart = performance.now()

    updateField()
    render()

    let elapsed = performance.now() - frameStart
    // console.log(elapsed)
    sleep(MS - elapsed)
    window.requestAnimationFrame(step);

    }

}

function updateField(){

    // CREATE ARRAY OF CIRCLE OBJECTS AND UPDATE POSITION
    let gameObjArray = Object.keys(gameObjectDict).map(function(key){
        // update position
        // WARNING: SIDE EFFECTS ARE BAD, MMMKAY?
        gameObjectDict[key].simulate(MS)

        return gameObjectDict[key];
    });

    // SORT BY X
    gameObjArray.sort(function(a,b){
        a = a.circle
        b = b.circle
        return (a.position.x + a.radius) - (b.position.x + b.radius)
    })

    checkForCollisions(gameObjArray)

}

function render(){

    RenderQueue = {}

    for (const [key,value] of Object.entries(gameObjectDict)){
        value.render()
    }

    GlobalRender.newFrame()

    // render by depth
    for (const [key,value] of Object.entries(RenderQueue)){
        for (const renderFunc of value){
            renderFunc.next()
            // renderFunc.next()
        }
    }
}

console.log(gameCanvas)

window.requestAnimationFrame(step);

function drawLine(start,end){
    ctx.strokeStyle = "#FFFF00"
    ctx.beginPath()
    ctx.moveTo(start.x,start.y)
    ctx.lineTo(end.x,end.y)
    ctx.stroke()
}

/**
 * nlog(n) collision detection for sorted array of circular objects
 * @param {Array<Circle>} circleArray 
 */
function checkForCollisions(gameObjArray){

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
            if (dist < (c1.radius + c2.radius)){
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
            c1.velocity = newVelocities[0]
            c2.velocity = newVelocities[1]
            c1.collide(obj2)
            c2.collide(obj1)
        }

        i++;
    }
}

/**
 * Perform collision calculations between to objects and returns their respective vectors
 * https://research.ncl.ac.uk/game/mastersdegree/gametechnologies/physicstutorials/5collisionresponse/Physics%20-%20Collision%20Response.pdf
 * @param {Vector2D} p1
 * @param {Vector2D} p2 
 * @param {Vector2D} v1 
 * @param {Vector2D} v2 
 * @returns [v1,v2]
 */
 function collide(p1,p2,v1,v2,m1,m2){
    // console.log("collision!")
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