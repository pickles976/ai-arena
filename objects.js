class Vector2D {

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
}

// TODO: add mass, color, 
class Circle {

    /**
     * 
     * @param {float} radius (m)
     * @param {Vector2D} position (m)
     * @param {Vector2D} velocity (m/s)
     */
    constructor(radius,position,velocity){
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
    }

    /**
     * 
     * @param {float} deltaTime 
     */
    updatePosition(deltaTime){
        this.position = this.position.add(this.velocity.multiply(deltaTime));

        this.position.x = this.position.x % W;
        this.position.y = this.position.y % H;
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}