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

    serialize(){
        return JSON.stringify(this.getResources())
    }
}

/**
 * Asteroid object is composed of a circle object, it calls the circle object's simulate and render functions
 * to simulate and render itself.
 */
class Asteroid {

    constructor(position,velocity,metal,water){
        this.type = "ASTEROID"
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

    collide(otherObject){
        // console.log("This is an Asteroid")
        // console.log("Collided with a " + otherObject.constructor.name)
    }

    destroy(){
        this.type = "DEAD"
    }

}

class Obstacle {

    constructor(position,velocity,mass){
        this.type = "OBSTACLE"
        this.circle = new Circle(mass,position,velocity,this.onCollision)
    }

    simulate(deltaTime){
        this.circle.simulate(deltaTime)
    }

    render(){
        // draw the obstacle
        GlobalRender.drawCircle(this.circle.position,this.circle.radius,"#A52A2A")
    }

    collide(otherObject){
        // console.log("This is an Asteroid")
        // console.log("Collided with a " + otherObject.constructor.name)
    }

    destroy(){
        this.type = "DEAD"
    }

}

class EnergyCell {

    constructor(position,velocity,energy){
        this.type = "ENERGY_CELL"
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

    collide(otherObject){
        // console.log("This is an Energy Cell")
        // console.log("Collided with a " + otherObject.constructor.name)
    }

    destroy(){
        this.type = "DEAD"
    }
}

class Ship {

    constructor(position,energy){
        this.type = "SHIP"
        this.circle = new Circle(50.0,position,Vector2D.zero,this.onCollision)
        this.resources = new Resources(0,0,energy)
    }

    simulate(deltaTime){

        const oldVel = this.circle.velocity.magnitude ** 2
        this.circle.simulate(deltaTime)
        const dV = Math.abs(oldVel - (this.circle.velocity.magnitude ** 2))
        this.resources.energy -= dV * (this.totalMass()) * 0.5 * energyScale

        this.update()
    }

    render(){

        const acceleration = this.circle.acceleration
        const position = this.circle.position

        // add a flickering animation
        const magnitude = acceleration.magnitude * clamp(Math.random() + 0.6,0.5,1.0)

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

    collide(otherObject){

        switch (otherObject.type){
            case "ENERGY_CELL":
                this.resources.energy += otherObject.resources.energy
                otherObject.destroy()
                break;
            case "ASTEROID":
                this.resources.metal += otherObject.resources.metal
                this.resources.water += otherObject.resources.water
                otherObject.destroy()
                break;
            case "OBSTACLE":
                this.resources.energy -= energyScale * otherObject.circle.mass * (this.circle.velocity.magnitude ** 2) / 2
                break;
            default:
                this.resources.energy -= otherObject.circle.mass * (this.circle.velocity.magnitude ** 2) / 2
        }
    }

    totalMass(){
        return this.circle.mass + this.resources.water + this.resources.metal
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
        
        // TODO: make thrust proportional to distance
        const power = this.circle.position.subtract(new Vector2D(midX,midY)).magnitude / 100
        this.move(new Vector2D(x,y),power)

        GlobalRender.drawText(this.resources.energy,this.circle.position,20,"#FFFFFF")
    }

    // move in a specific direction
    move(vector,percentage){
        const pct = clamp(percentage,0,1)
        this.circle.acceleration = vector.normal().multiply(pct)    
    }

    destroy(){
        this.type = "DEAD"
    }

}
