let gameObjectDict = {}

let vZero = new Vector2D(0,0);

// create random circles
let numCircles = 5;
for(let i = 0;i < numCircles; i++){
    
    let randomPos = new Vector2D(Math.random()*W,Math.random()*H);
    let speed = 0.2;
    let randomVel = new Vector2D(Math.random()*speed,Math.random()*speed);

    const circle = new Circle(20.0,randomPos,randomVel)
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
    circleArray.sort(function(a,b){return a.position.x - b.position.x})

    // TODO: wraparound collision detection
    // loop through and pair possible collisions
    let i = 1;
    let lastPos = circleArray[0].position.x + circleArray[0].radius;
    let pairs = []

    while (i < circleArray.length) {
        let tempCircle = circleArray[i];

        // check if there is a possibility that the two circles intersect
        if ((tempCircle.position.x - lastPos) < tempCircle.radius){
            pairs.push([circleArray[i],circleArray[i-1]])
        }

        lastPos = circleArray[i].position.x + circleArray[0].radius;

        i++;
    }

    e = 0.5;

    i = 0;
    while (i < pairs.length){
        // check for collisions
        let c1 = pairs[i][0]
        let c2 = pairs[i][1]
        let dist = c1.position.subtract(c2.position).magnitude

        if (dist < (c1.radius + c2.radius)){

            console.log("collision!")
            let collisionNormal = c1.position.subtract(c2.position).normal()
            let vRel = c1.velocity.subtract(c2.velocity)
            let tVel = -collisionNormal.dot(vRel.multiply(1+e))

            let delta = collisionNormal.multiply(tVel / 2)

            // TODO: impulse calculations
            // https://research.ncl.ac.uk/game/mastersdegree/gametechnologies/physicstutorials/5collisionresponse/Physics%20-%20Collision%20Response.pdf
            // IMPULSE CALCULATIONS WHEN adding mass
            c1.velocity = c1.velocity.add(delta)
            c2.velocity = c2.velocity.subtract(delta)
        }

        i++;
    }
}

// TODO: wraparound rendering
function render(){

    // Drawing loop
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";

    for (const [key,value] of Object.entries(gameObjectDict)){

        const tempCircle = value;
        const pos = tempCircle.position;
        const radius = tempCircle.radius;

        ctx.beginPath();
        ctx.arc(pos.x,pos.y,radius,0,2* Math.PI);
        // ctx.stroke();
        ctx.fill();
    }

}

console.log(gameCanvas)

window.requestAnimationFrame(step);