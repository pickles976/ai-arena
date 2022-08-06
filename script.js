let gameObjectDict = {}

let vZero = new Vector2D(0,0);

// create random circles
let numCircles = 5;
for(let i = 0;i < numCircles; i++){
    
    let randomPos = new Vector2D(Math.random()*W,Math.random()*H);
    let speed = 0.2;
    let randomVel = new Vector2D((Math.random()-0.5)*speed,(Math.random()-0.5)*speed);

    const circle = new Circle(30.0,randomPos,randomVel,"#FFFFFF")
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

    frameStart = performance.now()

    updateField()
    render()

    let elapsed = performance.now() - frameStart
    sleep(MS - elapsed)
    window.requestAnimationFrame(step);

}

function updateField(){

    // Create array of circle objects
    let circleArray = Object.keys(gameObjectDict).map(function(key){
        let tempCircle = gameObjectDict[key]

        // update position
        tempCircle.updatePosition(MS)

        return gameObjectDict[key];
    });

    // sort by x position
    circleArray.sort(function(a,b){return (a.position.x + a.radius) - (b.position.x + b.radius)})

    // TODO: wraparound collision detection in X axis
    // https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

    // NAIVE N**2 COLLISION DETECTION
    let i = 1;
    // let pairs = []

    while (i < circleArray.length) {

        let c1 = circleArray[i];
        let j = 0;

        //CHECK ALL OTHER BEFORE THIS ONE
        while (j < i){

            let c2 = circleArray[j]
            let dist = c1.position.subtract(c2.position).magnitude

            //check for collision
            if (dist <= (c1.radius + c2.radius)){
                let newVelocities = collide(c1.position,c2.position,c1.velocity,c2.velocity) 
                c1.velocity = newVelocities[0]
                c2.velocity = newVelocities[1]
                c1.color = "#FF0000"
                c2.color = "#FF0000"
            }

            j++
        }
        
        i++;
    }

    // loop through all possible collision pairs
    // i = 0;
    // while (i < pairs.length){

    //     let c1 = pairs[i][0]
    //     let c2 = pairs[i][1]
    //     let dist = c1.position.subtract(c2.position).magnitude

    //     //check for collision
    //     if (dist < (c1.radius + c2.radius)){

    //         let newVelocities = collide(c1.position,c2.position,c1.velocity,c2.velocity) 
    //         c1.velocity = newVelocities[0]
    //         c2.velocity = newVelocities[1]
    //         c1.color = "#FF0000"
    //         c2.color = "#FF0000"
    //     }

    //     i++;
    // }
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

function collide(p1,p2,v1,v2){
    // console.log("collision!")
    let e = 0.2;
    let oomf = 0.025;
    let collisionNormal = p1.subtract(p2).normal()
    let vRel = v1.subtract(v2)
    let tVel = -collisionNormal.dot(vRel.multiply(1+e))

    let delta = collisionNormal.multiply((tVel / 2) + oomf)

    // TODO: impulse calculations
    // https://research.ncl.ac.uk/game/mastersdegree/gametechnologies/physicstutorials/5collisionresponse/Physics%20-%20Collision%20Response.pdf
    // IMPULSE CALCULATIONS WHEN adding mass
    
    return [v1.add(delta),v2.subtract(delta)]
}