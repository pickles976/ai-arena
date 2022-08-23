/**
 * ALL GAME OBJECT CLASSES WILL LIVE HERE FOR NOW
 */

 class Vector2D {

    type: string
    x : number
    y : number
    magnitude : number

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     */
    constructor(x : number,y : number){
        this.type = "VECTOR2D"
        this.x = x;
        this.y = y;
        this.magnitude = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    }

    add(newVector : Vector2D){
        return new Vector2D(this.x + newVector.x,this.y + newVector.y)
    }

    subtract(newVector : Vector2D){
        return new Vector2D(this.x - newVector.x,this.y - newVector.y)
    }

    multiply(scalar : number){
        return new Vector2D(this.x * scalar, this.y * scalar)
    }

    divide(scalar : number){
        return new Vector2D(this.x / scalar, this.y / scalar)
    }

    dot(newVector : Vector2D){
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

    rotate(degrees : number){
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

    static dist(v1 : Vector2D,v2 : Vector2D){
        return v1.subtract(v2).magnitude
    }

    serialize(){
        return JSON.stringify([this.type, parseFloat(this.x.toFixed(4)), parseFloat(this.y.toFixed(4))])
    }
}

class Transform {

    type : string
    mass : number
    position : Vector2D
    velocity : Vector2D
    acceleration : Vector2D

    /**
     * Circle is basically a point mass with a radius for collision checking
     * @param {float} mass (m)
     * @param {Vector2D} position (m)
     * @param {Vector2D} velocity (m/s)
     */
    constructor(mass : number,position : Vector2D, velocity : Vector2D){
        this.type = "TRANSFORM"
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector2D(0,0)
    }

    simulate(deltaTime : number){

        this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime).divide(50000));

        this.acceleration = new Vector2D(0,0)

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

    serialize(){
        return JSON.stringify([this.type,
            this.mass,
            this.position.serialize(),
            this.velocity.serialize()])
    }
}

class Collider {
    type : string
    radius : number
    constructor(radius : number){
        this.type = "COLLIDER"
        this.radius = radius
    }

    serialize(){
        return JSON.stringify([this.type,
            this.radius])
    }
}
