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
        this.type = "RESOURCES"
        this.metal = metal
        this.water = water
        this.energy = energy
        this.sum = metal + water + energy
        this.ratio = [metal/this.sum, water/this.sum, energy/this.sum]
    }

    getResources(){
        return {
            "metal" : parseFloat(this.metal.toFixed(2)),
            "water" : parseFloat(this.water.toFixed(2)),
            "energy" : parseFloat(this.energy.toFixed(2)),
        }
    }

    toString(){
        return JSON.stringify(this.getResources())
    }

    serialize(){
        const temp = this.getResources()
        return JSON.stringify([this.type,temp["metal"],
        temp["water"],
        temp["energy"]])
    }
}

/**
 * Asteroid object is composed of a circle object, it calls the circle object's simulate and render functions
 * to simulate and render itself.
 */
class Asteroid {

    constructor(uuid,position,velocity,metal,water){
        this.uuid = uuid
        this.type = "ASTEROID"
        this.circle = new Circle(metal+water,position,velocity)
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
    }

    destroy(){
        this.type = "DEAD"
    }

    serialize(){   
        const temp = this.resources.getResources()
        return JSON.stringify([this.type,
            this.uuid,
            this.circle.position.serialize(),
            this.circle.velocity.serialize(),
            temp["metal"],
            temp["water"]])
    }

}

class Obstacle {

    constructor(uuid,position,velocity,mass){
        this.uuid = uuid
        this.type = "OBSTACLE"
        this.circle = new Circle(mass,position,velocity)
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

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.circle.position.serialize(),
            this.circle.velocity.serialize(),
            parseFloat(this.circle.mass.toFixed(2))])
    }

}

class EnergyCell {

    constructor(uuid,position,velocity,energy){
        this.uuid = uuid
        this.type = "ENERGY_CELL"
        this.circle = new Circle(energy,position,velocity)
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
    }

    destroy(){
        this.type = "DEAD"
    }

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.circle.position.serialize(),
            this.circle.velocity.serialize(),
            this.resources.getResources()["energy"]])
    }
}

class Ship {

    constructor(uuid,position,energy,team){
        this.uuid = uuid
        this.team = team
        this.type = "SHIP"
        this.circle = new Circle(50.0,position,Vector2D.zero)
        this.resources = new Resources(0,0,energy)

        // upgradeable
        this.maxEnergy = 100
        this.damage = 25

        // upgrade costs
        this.energyCost = 100
        this.damageCost = 100
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

                GameStateManager.addEnergy(this.team,otherObject.resources.energy)

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
        Start.call(this)
    }

    update(){
        Update.call(this)
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
        this.resources.energy -= this.damage
        const bullet = new Bullet(create_UUID(),this.circle.position.add(direction.normal().multiply(Bullet.offset + this.circle.radius)), direction.normal().multiply(Bullet.speed), this.damage, this.uuid)
        GameObjectList.push(bullet)
    }

    destroy(){
        GameStateManager.addDeath(this.team)
        GameObjectManager.getBaseByTeam(this.team).queueShip()
        this.type = "DEAD"
    }

    upgradeMaxEnergy(){
        const base = GameObjectManager.getBaseByTeam(this.team)
        base.resources.metal -= this.energyCost
        this.energyCost *= 2
        this.maxEnergy *= 2
    }

    upgradeDamage(){
        const base = GameObjectManager.getBaseByTeam(this.team)
        base.resources.metal -= this.damageCost
        this.damageCost *= 2
        this.damage *= 2
    }

    seekTarget(target){
        const desiredVelocity = target.circle.position.subtract(this.circle.position).normal().multiply(target.circle.velocity.magnitude * 2.0)
        const steering = desiredVelocity.subtract(this.circle.velocity)
        this.thrust(steering,1.0)
    }

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.circle.position.serialize(),
            this.resources.getResources()["energy"],
            this.team])
    }

}

class Bullet {

    static speed = 0.25
    static offset = 5

    constructor(uuid,position,velocity,damage,parent){
        this.uuid = uuid
        this.type = "BULLET"
        this.circle = new Circle(15,position,velocity)
        this.damage = damage
        this.parent = parent
    }

    simulate(deltaTime){
        this.circle.simulate(deltaTime)
    }

    render(){
        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(this.circle.position,this.circle.radius,"#FFFF00")
    }

    collide(otherObject){

        switch (otherObject.type){
            case "SHIP":
                otherObject.resources.energy -= energyDiff(this,otherObject) + this.damage // velocity + explosive
                if (otherObject.resources.energy < 0){
                    GameStateManager.recordKill(this.parent)
                }
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

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.circle.position.serialize(),
            this.circle.velocity.serialize(),
            this.damage,
            this.parent])
    }
}

class Base {

    constructor(uuid,position,energy,team){
        this.uuid = uuid
        this.team = team
        this.position = position
        this.type = "BASE"
        this.circle = new Circle(300.0,position,Vector2D.zero)
        this.resources = new Resources(501,100,energy)
        this.maxEnergy = 500

        this.shipQueue = []

        this.refiningRate = 0.01
        this.baseShipCost = 300

        // upgradeable
        this.shipcost = 300
        this.healRate = 0.01
        this.interactRadius = 50

        // upgrade costs
        this.healRateCost = 250
        this.interactRadiusCost = 250
        this.energyCost = 250
    }

    
    simulate(deltaTime){

        // stay static
        this.circle.velocity = Vector2D.zero

        // refine water
        if (this.resources.water > 0 && this.resources.energy < this.maxEnergy){
            const newEnergy = this.refiningRate * deltaTime
            this.resources.water -= newEnergy
            this.resources.energy += newEnergy / 2
            GameStateManager.addEnergy(this.team,newEnergy)
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

        // loop through ship in ship queue
        for(const i in this.shipQueue){
            const coroutine = this.shipQueue[i]
            const output = coroutine.next()
            if (output.done === true){
                this.shipQueue.splice(i,1)
                if (output.value === false)
                    this.queueShip()
            }
        }
    }

    collide(otherObject){
        const oomf = 15.0
        const vec = otherObject.circle.position.subtract(this.circle.position).normal()
        otherObject.circle.velocity = otherObject.circle.velocity.add(vec.multiply(oomf))
    }

    render(){
        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(this.circle.position,this.circle.radius,teamColors[this.team])
        GlobalRender.drawText(this.resources.toString(),this.position,12,"#FFFFFF")
    }

    start(){
        BaseStart.call(this)
    }

    update(){
        BaseUpdate.call(this)
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
        GameStateManager.addMetal(this.team,ship.resources.metal)
        this.resources.metal += ship.resources.metal
        this.resources.water += ship.resources.water
        ship.resources.metal = 0
        ship.resources.water = 0
    }

    trySpawnShip(energy,respawn){

        if (this.resources.metal > this.shipcost && this.resources.energy > energy){

            // check around the base
            const angle = 360 / 32
            for(let i = 0; i < 32; i++){
                let pos = new Vector2D(0,1).multiply(this.circle.radius * 1.5).rotate(angle*i).add(this.circle.position)
                const obj = new Ship(create_UUID(),pos,energy,this.team)
                if (overlapCircle(pos,obj.circle.radius*1.2).length < 1){
                    GameObjectList.push(obj)

                    if (!respawn){
                        this.resources.metal -= this.shipcost
                    }

                    this.resources.energy -= energy
                    return true
                }
            }
        }
        return false
    }

    upgradeHealth(){
        if (this.resources.metal > this.energyCost){
            this.maxEnergy += 500
            this.resources.metal -= this.energyCost
            this.energyCost *= 2
        }
    }

    upgradeHealRate(){
        if (this.resources.metal > this.healthRateCost){
            this.healRate *= 2
            this.resources.metal -= this.healthRateCost
            this.healthRateCost *= 2
        }
    }

    upgradeInteractRadius(){
        if (this.resources.metal > this.interactRadiusCost){
            this.interactRadius *= 2
            this.resources.metal -= this.interactRadiusCost
            this.interactRadiusCost *= 2
        }
    }

    queueShip(){
        function* spawnShipCoroutine(self,numFrames){
            for (let i = 0; i < numFrames; i++){
                yield;
            }
            return self.trySpawnShip(50,true)
        }

        this.shipQueue.push(spawnShipCoroutine(this,900))
    }

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.circle.position.serialize(),
            this.resources.getResources()["energy"],
            this.team])
    }
}
