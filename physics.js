/**
 * ALL GAME OBJECT CLASSES WILL LIVE HERE FOR NOW
 */

 class Vector2D {

    static zero = new Vector2D(0,0)
    static up = new Vector2D(0,1)
    static right = new Vector2D(1,0)

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

    /**
     * 
     * @param {number} degrees degrees to rotate CCW
     */
    rotate(degrees){
        const rad = Math.PI * degrees / 180
        const rotX = this.x * Math.cos(rad) - this.y * Math.sin(rad)
        const rotY = this.x * Math.sin(rad) + this.y * Math.cos(rad)
        return new Vector2D(rotX,rotY)
    }

    /**
     * 
     * @returns A vector of length 1 in a random direction
     */
    static random(){
        return new Vector2D(Math.random()-0.5,Math.random()-0.5).normal();
    }
}

/**
 * This entire physics sim uses circles for colliders, since they are extremely easy to
 * program for and I am stupid/lazy. Think of the Circle as the base class that every game object inherits from.
 */
class Circle {

    /**
     * Circle in basically a point mass with a radius for collision checking
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
     * Run the point-mass physics simulations
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

    collide(self,otherObject){
        this.collisionCallback(self,otherObject)
    }
}
