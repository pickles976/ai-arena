/**
 * The resources contained in any object
 */
class Resources {

    static colors = ["#666666","#ADD8E6", "#00FF00"]

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
            "metal" : this.metal.toFixed(2),
            "water" : this.water.toFixed(2),
            "energy" : this.energy.toFixed(2),
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
        this.uuid = create_UUID()
        this.type = "ASTEROID"
        this.circle = new Circle(metal+water,position,velocity,this.collide)
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
        this.uuid = create_UUID()
        this.type = "OBSTACLE"
        this.circle = new Circle(mass,position,velocity,this.collide)
    }

    simulate(deltaTime){
        this.circle.simulate(deltaTime)
    }

    render(){
        // draw the obstacle
        GlobalRender.drawCircle(this.circle.position,this.circle.radius,"#A52A2A")
    }

    collide(otherObject){
    }

    breakUp(){

        if (this.circle.mass > 60.0){
            // break into multiple pieces
            const numPieces = Math.floor(2 + Math.random() * 3)
            
            for(let i = 0; i < numPieces; i++){
                const massRatio = 0.1 + (Math.random() * 0.15)
                const rotationOffset = (i * 360 / numPieces) + (Math.random() - 0.5) * 45
                const offset = Vector2D.up.multiply(this.circle.radius / 1.5).rotate(rotationOffset)
                const newChunk = new Obstacle(this.circle.position.add(offset),this.circle.velocity.rotate(-rotationOffset).add(this.circle.velocity),this.circle.mass * massRatio)
                GameObjectList.push(newChunk)
            }

        }
        this.destroy()
    }

    destroy(){
        this.type = "DEAD"
    }

}

class EnergyCell {

    constructor(position,velocity,energy){
        this.uuid = create_UUID()
        this.type = "ENERGY_CELL"
        this.circle = new Circle(energy,position,velocity,this.collide)
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

    constructor(position,energy,team){
        this.uuid = create_UUID()
        this.team = team
        this.type = "SHIP"
        this.circle = new Circle(50.0,position,Vector2D.zero,this.collide)
        this.resources = new Resources(0,0,energy)

        // upgradeable
        this.maxEnergy = 100
        this.damage = 25

        this.start()
    }

    /**
     * Simulate the physics and energy consumption for a given timestep
     * @param {number} deltaTime 
     */
    simulate(deltaTime){
        const oldVel = this.circle.velocity.magnitude ** 2
        this.circle.simulate(deltaTime)
        const dV = Math.abs(oldVel - (this.circle.velocity.magnitude ** 2))
        this.resources.energy -= dV * (this.totalMass()) * 0.5 * energyScale

        if (this.resources.energy < 0){
            this.destroy()
        }

        if (this.resources.energy > this.maxEnergy){
            this.resources.energy = this.maxEnergy
        }
    }

    render(){

        const acceleration = this.circle.acceleration
        const position = this.circle.position

        // add a flickering animation
        const magnitude = acceleration.magnitude * clamp(Math.random() + 0.6,0.5,1.0)

        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(position,this.circle.radius,teamColors[this.team])

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

                if (this.resources.energy > this.maxEnergy){
                    this.resources.energy = this.maxEnergy
                }

                otherObject.destroy()
                break;
            case "ASTEROID":
                this.resources.metal += otherObject.resources.metal
                this.resources.water += otherObject.resources.water
                otherObject.destroy()
                break;
            case "BASE":
                // drop off materials
                break;
            case "OBSTACLE":
                // do nothing
                break;
            default:
                this.resources.energy -= energyDiff(this,otherObject)
        }
    }

    totalMass(){
        return this.circle.mass + this.resources.water + this.resources.metal
    }

    start(){
        this.target = {}
        this.state = "IDLE"
    }

    update(){
        switch(this.state){

            case "IDLE":
            
                const asteroids = GameObjectManager.getAsteroids()

                let closest = [{},100000]

                for (const index in asteroids){
                    const asteroid = asteroids[index]
                    const d = dist(asteroid,this)
                    if (d < closest[1]){
                        closest = [asteroid,d]
                    }
                }

                this.target = closest[0]
                this.state = "MOVE_TO_ASTEROID"


                break;

            case "MOVE_TO_ASTEROID":

                if (this.target.type === "ASTEROID"){
                    this.seek(this.target)
                }else{
                    this.target = GameObjectManager.getBasesByTeam(this.team)[0]
                    this.state = "MOVE_TO_BASE"
                }

                break;

            case "MOVE_TO_BASE":

                if (this.resources.metal > 0 || this.resources.water > 0){
                    this.moveToObject(this.target)
                }else{
                    this.state = "IDLE"
                }

                break;

            case "MOVE_TO_ENERGY":
                if (this.target.type === "ENERGY_CELL"){
                    this.seek(this.target)
                }else{
                    this.state = "IDLE"
                }
                break;
                
        }

        // if we need energy
        if (this.resources.energy < (this.maxEnergy / 4)){
            const energyCells = GameObjectManager.getEnergyCells()

            let closest = [{},100000]

            for (const index in energyCells){
                const energyCell = energyCells[index]
                const d = dist(energyCell,this)
                if (d < closest[1]){
                    closest = [energyCell,d]
                }
            }

            this.target = closest[0]
            this.state = "MOVE_TO_ENERGY"
        }

        // shooting
        const shootRadius = 200
        const ships = GameObjectManager.getShips()

        let closest = [{},100000]

        for (const index in ships){
            const ship = ships[index]
            if (ship.team != this.team){
                const d = dist(ship,this)
                if (d < closest[1]){
                    closest = [ship,d]
                }
            }
        }

        if (this.resources.energy > (this.damage) && closest[1] < shootRadius){
            this.shoot(closest[0].circle.position.subtract(this.circle.position).add(closest[0].circle.velocity.multiply(60)))
        }

        GlobalRender.drawText(this.resources.serialize(),this.circle.position,10,"#FFFFFF")
        GlobalRender.drawText(this.state,this.circle.position.subtract(Vector2D.up.multiply(-10)),8,"#FFFFFF")
        GlobalRender.drawLine(this.circle.position,this.target.circle.position,"#00FF00")

        // if(Math.random() > 0.99){
        //     const dir = new Vector2D(Math.random() - 0.5,Math.random() - 0.5)
        //     this.shoot(dir)
        // }

        // for (let i = 0; i < 100000; i++){
        //     let collisions = overlapCircle(this.circle.position,50)
        // }
    }

    moveTo(position){
        const vec = position.subtract(this.circle.position)
        const power = vec.magnitude / 100
        this.thrust(vec,power)
    }

    moveToObject(obj){
        const vec = obj.circle.position.subtract(this.circle.position)
        const power = vec.magnitude / 100
        this.thrust(vec,power)
    }

    seek(target){
        const desiredVelocity = target.circle.position.subtract(this.circle.position).normal().multiply(target.circle.velocity.magnitude * 2.0)
        const steering = desiredVelocity.subtract(this.circle.velocity)
        this.thrust(steering,1.0)
    }

    /**
     * Apply vectored thrust
     * @param {Vector2D} vector 
     * @param {number} percentage clamped between 0 and 1
     */
    thrust(vector,percentage){
        const pct = clamp(percentage,0,1)
        this.circle.acceleration = vector.normal().multiply(pct)    
    }

    /**
     * Instantiate a bullet traveling in a certain direction
     * @param {Vector2D} direction 
     */
    shoot(direction){
        // instantiate object
        this.resources.energy -= this.damage / 2
        const bullet = new Bullet(this.circle.position.add(direction.normal().multiply(Bullet.offset + this.circle.radius)), direction.normal().multiply(Bullet.speed), this.damage)
        GameObjectList.push(bullet)
    }

    destroy(){
        this.type = "DEAD"
    }

    upgradeMaxEnergy(){
        // take metal from base to upgrade self
    }

    upgradeDamage(){
        // take metal from base to upgrade bullet damage
    }

}

class Bullet {

    static speed = 0.25
    static offset = 5

    constructor(position,velocity,damage){
        this.uuid = create_UUID()
        this.type = "BULLET"
        this.circle = new Circle(15,position,velocity,this.collide)
        this.damage = damage
    }

    simulate(deltaTime){
        this.circle.simulate(deltaTime)
    }

    render(){
        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(this.circle.position,this.circle.radius,"#FFFF00")
    }

    collide(otherObject){
        // console.log("This is an Energy Cell")
        // console.log("Collided with a " + otherObject.constructor.name)

        switch (otherObject.type){
            case "SHIP":
                otherObject.resources.energy -= energyDiff(this,otherObject) + this.damage // velocity + explosive
                break;
            case "OBSTACLE":
                otherObject.breakUp()
                break;
            case "BASE":
                otherObject.resources.energy -= energyDiff(this,otherObject) + this.damage // velocity + explosive
                break;
            default:
                otherObject.destroy()
        }
        this.destroy()
    }

    destroy(){
        this.type = "DEAD"
    }
}

class Base {

    constructor(position,energy,team){
        this.uuid = create_UUID()
        this.team = team
        this.position = position
        this.type = "BASE"
        this.circle = new Circle(300.0,position,Vector2D.zero,this.collide)
        this.resources = new Resources(501,100,energy)
        this.maxEnergy = 500

        // upgradeable
        this.refiningRate = 0.01
        this.shipcost = 300
        this.healRate = 0.01
        this.interactRadius = 50
    }

    
    simulate(deltaTime){

        // stay static
        this.circle.velocity = Vector2D.zero

        // refine water
        if (this.resources.water > 0 && this.resources.energy < this.maxEnergy){
            const newEnergy = this.refiningRate * deltaTime
            this.resources.water -= newEnergy
            this.resources.energy += newEnergy / 2
        }

        if (this.resources.water < 0){
            this.resources.water = 0
        }

        if (this.resources.energy > this.maxEnergy){
            this.resources.energy = this.maxEnergy
        }

        // heal ships
        const teamShips = GameObjectManager.getShipsByTeam(this.team)
        for (const index in teamShips){
            const ship = teamShips[index]
            if (dist(this,ship) < this.interactRadius){
                this.healShip(deltaTime,ship)
                this.takeResources(ship)
            }
        }

        this.update()
    }

    collide(otherObject){
        const oomf = 15.0
        const vec = otherObject.circle.position.subtract(this.circle.position).normal()
        otherObject.circle.velocity = otherObject.circle.velocity.add(vec.multiply(oomf))
    }

    render(){
        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(this.circle.position,this.circle.radius,teamColors[this.team])
        GlobalRender.drawText(this.resources.serialize(),this.position,12,"#FFFFFF")
    }

    update(){
        const energy = 50
        if (this.resources.metal > this.shipcost && this.resources.energy > energy){
            this.trySpawnShip(energy)
        }
    }

    destroy(){

    }

    healShip(deltaTime,ship){
        if (this.resources.energy > 0 && ship.resources.energy < ship.maxEnergy){
            const amount = this.healRate * deltaTime
            this.resources.energy -= amount
            ship.resources.energy += amount
        }
    }

    takeResources(ship){
        this.resources.metal += ship.resources.metal
        this.resources.water += ship.resources.water
        ship.resources.metal = 0
        ship.resources.water = 0
    }

    trySpawnShip(energy){

        if (this.resources.metal > this.shipcost && this.resources.energy > energy){

            // check around the base
            const angle = 360 / 32
            for(let i = 0; i < 32; i++){
                let pos = new Vector2D(0,1).multiply(this.circle.radius * 1.5).rotate(angle*i).add(this.circle.position)
                const obj = new Ship(pos,energy,this.team)
                if (overlapCircle(pos,obj.circle.radius*1.2).length < 1){
                    GameObjectList.push(obj)
                    this.resources.metal -= this.shipcost
                    return true
                }
            }
        }
    }

    upgradeHealth(){
        if (this.resources.metal > 500){
            this.maxEnergy += 500
            this.resources.metal -= 500
        }
    }
}
