/**
 * ALL GAME OBJECT CLASSES WILL LIVE HERE FOR NOW
 */

class Vector2D {

    static zero = new Vector2D(0,0)

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     */
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.magnitude = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    }

    add(newVector){
        return new Vector2D(this.x + newVector.x,this.y + newVector.y)
    }

    subtract(newVector){
        return new Vector2D(this.x - newVector.x,this.y - newVector.y)
    }

    multiply(scalar){
        return new Vector2D(this.x * scalar, this.y * scalar)
    }

    divide(scalar){
        return new Vector2D(this.x / scalar, this.y / scalar)
    }

    dot(newVector){
        return (this.x * newVector.x) + (this.y * newVector.y)
    }

    normal(){
        return new Vector2D(this.x/this.magnitude,this.y/this.magnitude)
    }

    copy(){
        return new Vector2D(this.x,this.y)
    }

    toString(){
        return "{ x : " + this.x + ", y : " + this.y + " }"
    }
}

/**
 * This entire physics sim uses circles for colliders, since they are extremely easy to
 * program for and I am stupid/lazy. Think of the Circle as the base class that every game object inherits from.
 */
class Circle {

    /**
     * 
     * @param {float} mass (m)
     * @param {Vector2D} position (m)
     * @param {Vector2D} velocity (m/s)
     * @param {string} color (#XXXXXX)
     * @param 
     */
    constructor(mass,position,velocity,collisionCallback){
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
        this.radius = Math.sqrt(mass)
        this.acceleration = Vector2D.zero
        this.collisionCallback = collisionCallback
    }

    /**
     * 
     * @param {float} deltaTime 
     */
    simulate(deltaTime){

        this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime).divide(50000));

        this.acceleration = Vector2D.zero

        this.position = this.position.add(this.velocity.multiply(deltaTime));

        // NEGATIVE WRAPAROUND
        if(this.position.x < 0){
            this.position.x += W;
        }
        if(this.position.y < 0){
            this.position.y += H;
        }

        // POSITIVE WRAPAROUND
        this.position.x = this.position.x % W;
        this.position.y = this.position.y % H;
    }

    collide(otherObject){
        this.collisionCallback(otherObject)
    }
}

/**
 * The resources contained in any object
 */
class Resources {

    static colors = ["#666666","#ADD8E6", "#FFFF00"]

    /**
     * The sum of metal, water, and energy will determine the mass of an object
     * @param {Number} metal 
     * @param {Number} water 
     * @param {Number} energy 
     */
    constructor(metal,water,energy){
        this.metal = metal
        this.water = water
        this.energy = energy
        this.sum = metal + water + energy
        this.ratio = [metal/this.sum, water/this.sum, energy/this.sum]
    }

    getResources(){
        return {
            "metal" : this.metal,
            "water" : this.water,
            "energy" : this.energy,
        }
    }
}

/**
 * Asteroid object is composed of a circle object, it calls the circle object's simulate and render functions
 * to simulate and render itself.
 */
class Asteroid {

    constructor(position,velocity,metal,water){
        this.circle = new Circle(metal+water,position,velocity,this.onCollision)
        this.resources = new Resources(metal,water,0)
    }

    simulate(deltaTime){
        this.circle.simulate(deltaTime)
    }

    render(){

        let total = 1.0
        const ratio = this.resources.ratio

        // draw the resources in the asteroid as colored rings
        for(let i = 0; i < 2; i++){
            GlobalRender.drawCircle(this.circle.position,total*this.circle.radius,Resources.colors[i])
            total -= ratio[i]
        }
    }

    getResources(){
        return this.resources.getResources()
    }

    onCollision(otherObject){
        // console.log("This is an Asteroid")
        // console.log("Collided with a " + otherObject.constructor.name)
    }

}

class EnergyCell {

    constructor(position,velocity,energy){
        this.circle = new Circle(energy,position,velocity,this.onCollision)
        this.resources = new Resources(0,0,energy)
    }

    simulate(deltaTime){
        this.circle.simulate(deltaTime)
    }

    render(){
        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(this.circle.position,this.circle.radius,Resources.colors[2])
    }

    getResources(){
        return this.resources.getResources()
    }

    onCollision(otherObject){
        // console.log("This is an Energy Cell")
        // console.log("Collided with a " + otherObject.constructor.name)
    }
}

class Ship {

    constructor(position,energy){
        this.circle = new Circle(50.0,position,Vector2D.zero,this.onCollision)
        this.resources = new Resources(0,0,energy)
    }

    simulate(deltaTime){
        this.circle.simulate(deltaTime)
        this.update()
    }

    render(){

        const acceleration = this.circle.acceleration
        const position = this.circle.position
        const magnitude = acceleration.magnitude

        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(position,this.circle.radius,"#FF0000")

        // draw thrust effect
        if (acceleration.y != 0){
            if (acceleration.y > 0){
                GlobalRender.drawExhaust(position,180,magnitude)
            } 
            else if (acceleration.y < 0)
            {
                GlobalRender.drawExhaust(position,0,magnitude)
            }
        }

        if (acceleration.x != 0){
            if (acceleration.x > 0){
                GlobalRender.drawExhaust(position,90,magnitude)
            } 
            else if (acceleration.x < 0)
            {
                GlobalRender.drawExhaust(position,270,magnitude)
            }
        }

    }

    getResources(){
        return this.resources.getResources()
    }

    onCollision(otherObject){
    }

    update(){

        let midX = W/2
        let midY = H/2

        let x = 0
        let y = 0

        if (this.circle.position.x < midX)
            x = 1
        else
            x = -1

        if (this.circle.position.y < midY)
            y = 1
        else
            y = -1
        
        let power = this.circle.position.subtract(new Vector2D(midX,midY)).magnitude / 10
        this.move(new Vector2D(x,y),power)
    }

    // move in a specific direction
    move(vector,percentage){
        // 0.0001
        const tempVector = vector;
        this.circle.acceleration = vector.normal().multiply(percentage)    
        // console.log(this.circle.acceleration.magnitude)
    }

}
