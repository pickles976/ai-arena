let gameObjectDict = {}

let vZero = new Vector2D(0,0);

// create random circles
let numCircles = 20;
for(let i = 0;i < numCircles; i++){
    
    let randomPos = new Vector2D(Math.random()*W,Math.random()*H);
    let speed = 0.2;
    let randomVel = new Vector2D((Math.random()-0.5)*speed,(Math.random()-0.5)*speed);

    const circle = new Circle(50.0 + Math.random() * 350,randomPos,randomVel,"#FFFFFF")
    gameObjectDict[i] = circle;
}

// get the canvas
gameCanvas = document.getElementById("game-canvas")
gameCanvas.width = W;
gameCanvas.height = H;
ctx = gameCanvas.getContext("2d");

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
    let circleArray = Object.keys(gameObjectDict).map(function(key){
        // update position
        // WARNING: SIDE EFFECTS ARE BAD, MMMKAY?
        gameObjectDict[key].updatePosition(MS)

        return gameObjectDict[key];
    });

    // SORT BY X
    circleArray.sort(function(a,b){return (a.position.x + a.radius) - (b.position.x + b.radius)})

    checkForCollisions(circleArray)

}

function render(){

    // Drawing loop
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    for (const [key,value] of Object.entries(gameObjectDict)){

        const tempCircle = value;
        const pos = tempCircle.position;
        const radius = tempCircle.radius;

        ctx.fillStyle = tempCircle.color;

        ctx.beginPath();
        ctx.arc(pos.x,pos.y,radius,0,2* Math.PI);
        ctx.fill();

        // WRAPAROUND RENDERING
        let newX = pos.x;
        let newY = pos.y;
        let wraparound = false;

        // check x bounds
        if (pos.x + radius > W){
            newX = pos.x - W
            wraparound = true
        }
        else if (pos.x - radius < 0){
            newX = pos.x + W
            wraparound = true
        }

        // check y bounds
        if (pos.y + radius > H){
            newY = pos.y - H
            wraparound = true
        }
        else if (pos.y - radius < 0){
            newY = pos.y + H
            wraparound = true
        }

        if (wraparound){
            ctx.beginPath();
            ctx.arc(newX,newY,radius,0,2* Math.PI);
            ctx.fill();
        }

        tempCircle.color = "#FFFFFF"
    }

}

console.log(gameCanvas)

window.requestAnimationFrame(step);

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
function checkForCollisions(circleArray){

    let i = 0;
    let pairs = []

    while (i < circleArray.length) {

        let c1 = circleArray[i];
        let j = 1;

        //ITERATE BACKWARDS IN CIRCLEARRAY
        let collision = true
        while (collision){

            collision = false
            let index = i - j

            // IF WE HAVE LOOPED AROUND
            if (index < 0){
                index += circleArray.length
            }

            let c2 = circleArray[index]
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
                pairs.push([c1,c2])
                collision = true
            }

            j++
        }
        
        i++;
    }

    // loop through all possible collision pairs
    i = 0;
    while (i < pairs.length){

        let c1 = pairs[i][0]
        let c2 = pairs[i][1]
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
    let e = 0.2;
    let oomf = 0.01;
    let collisionNormal = p1.subtract(p2).normal()
    let vRel = v1.subtract(v2) // relative velocity
    let tVel = -collisionNormal.dot(vRel.multiply(1+e)) // total velocity of system

    // let delta = collisionNormal.multiply((tVel / 2) + oomf)
    let impulse = tVel / ((1.0/m1) + (1.0/m2))
    let delta1 = collisionNormal.multiply((impulse/m1) + oomf)
    let delta2 = collisionNormal.multiply((impulse/m2) + oomf)
    
    return [v1.add(delta1),v2.subtract(delta2)]
}