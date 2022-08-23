class Resources {

    static colors = ["#666666","#ADD8E6", "#00FF00"]

    type : string
    metal : number
    water : number
    energy : number
    sum : number
    ratio : Array<number> 

    /**
     * The sum of metal, water, and energy will determine the mass of an object
     * @param {Number} metal 
     * @param {Number} water 
     * @param {Number} energy 
     */
    constructor(metal : number,water : number,energy : number){
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

class Asteroid extends GameObject {

    resources : Resources

    constructor(uuid : number,position : Vector2D,velocity : Vector2D,metal : number,water : number){
        super(uuid,"ASTEROID",new Transform(metal+water,position,velocity), new Collider(Math.sqrt(metal+water)))
        this.resources = new Resources(metal,water,0)
    }

    simulate(deltaTime : number){
        // this.transform.simulate(deltaTime)
        super.simulate(deltaTime)
    }

    render(){

        let total = 1.0
        const ratio = this.resources.ratio

        // draw the resources in the asteroid as colored rings
        for(let i = 0; i < 2; i++){
            GlobalRender.drawCircle(this.transform.position,total*this.collider.radius,Resources.colors[i])
            total -= ratio[i]
        }
    }

    getResources(){
        return this.resources.getResources()
    }

    destroy(){
        super.destroy()
    }

    serialize(){   
        const temp = this.resources.getResources()
        return JSON.stringify([this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            temp["metal"],
            temp["water"]])
    }

}

class Obstacle extends GameObject {

    constructor(uuid : number,position : Vector2D,velocity : Vector2D,mass : number){
        super(uuid,"OBSTACLE",new Transform(mass,position,velocity),new Collider(Math.sqrt(mass)))
    }

    simulate(deltaTime : number){
        super.simulate(deltaTime)
    }

    render(){
        // draw the obstacle
        GlobalRender.drawCircle(this.transform.position,this.collider.radius,"#A52A2A")
    }

    breakUp(){

        if (this.transform.mass > 60.0){
            // break into multiple pieces
            const numPieces = Math.floor(2 + Math.random() * 3)
            
            for(let i = 0; i < numPieces; i++){
                const massRatio = 0.1 + (Math.random() * 0.15)
                const rotationOffset = (i * 360 / numPieces) + (Math.random() - 0.5) * 45
                const offset = new Vector2D(0,1).multiply(this.collider.radius / 1.5).rotate(rotationOffset)
                const newChunk = new Obstacle(create_UUID(),this.transform.position.add(offset),this.transform.velocity.rotate(-rotationOffset).add(this.transform.velocity),this.transform.mass * massRatio)
                GameObjectList.push(newChunk)
            }

        }
        this.destroy()
    }

    destroy(){
        super.destroy()
    }

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            parseFloat(this.transform.mass.toFixed(2))])
    }

}

class EnergyCell extends GameObject{

    resources : Resources

    constructor(uuid : number,position : Vector2D,velocity : Vector2D,energy : number){
        super(uuid,"ENERGY_CELL",new Transform(energy,position,velocity),new Collider(Math.sqrt(energy)))
        this.resources = new Resources(0,0,energy)
    }

    simulate(deltaTime : number){
        super.simulate(deltaTime)
    }

    render(){
        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(this.transform.position,this.collider.radius,Resources.colors[2])
    }

    getResources(){
        return this.resources.getResources()
    }

    destroy(){
        super.destroy()
    }

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.resources.getResources()["energy"]])
    }
}

class Ship extends GameObject{

    team : number
    resources : Resources
    maxEnergy : number
    damage : number
    energyCost : number
    damageCost : number

    constructor(uuid : number,position : Vector2D,energy : number,team : number){

        super(uuid,"SHIP",new Transform(SHIP_MASS,position,new Vector2D(0,0)),new Collider(Math.sqrt(SHIP_MASS)))
        this.team = team
        this.resources = new Resources(0,0,energy)

        // upgradeable
        this.maxEnergy = SHIP_BASE_MAX_ENERGY
        this.damage = 5

        // upgrade costs
        this.energyCost = 100
        this.damageCost = 50

        this.start()
    }

    simulate(deltaTime : number){
        const oldVel = this.transform.velocity.magnitude ** 2
        super.simulate(deltaTime)
        const dV = Math.abs(oldVel - (this.transform.velocity.magnitude ** 2))
        this.resources.energy -= dV * (this.totalMass()) * 0.5 * energyScale

        if (this.resources.energy < 0){
            this.destroy()
        }

        if (this.resources.energy > this.maxEnergy){
            this.resources.energy = this.maxEnergy
        }
    }

    render(){

        const acceleration = this.transform.acceleration
        const position = this.transform.position

        // add a flickering animation
        const magnitude = acceleration.magnitude * clamp(Math.random() + 0.6,0.5,1.0)

        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(position,this.collider.radius,teamColors[this.team])

        // draw applyThrust effect
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

    collide(otherObject : GameObject){

        switch (otherObject.type){
            case "ENERGY_CELL":

                if (otherObject instanceof EnergyCell){

                    GameStateManager.addEnergy(this.team,otherObject.resources.energy)

                    this.resources.energy += otherObject.resources.energy

                    if (this.resources.energy > this.maxEnergy){
                        this.resources.energy = this.maxEnergy
                    }

                    otherObject.destroy()
                }
                break;
            case "ASTEROID":
                if (otherObject instanceof Asteroid){
                    this.resources.metal += otherObject.resources.metal
                    this.resources.water += otherObject.resources.water
                    otherObject.destroy()
                }
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
        return this.transform.mass + this.resources.water + this.resources.metal
    }

    destroy(){
        GameStateManager.addDeath(this.team)
        GameObjectManager.getBaseByTeam(this.team)?.queueShip()
        super.destroy()
    }

    toString(){
        return JSON.stringify({
            "id" : this.uuid,
            "resources" : this.resources.toString(),
            "maxEnergy" : this.maxEnergy,
            "damage" : this.damage
        })
    }

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.resources.getResources()["energy"],
            this.team])
    }

    start(){
        const startCode = compileCode('this.Start(ship,base) \n' +
                                'return ship')

        startCode({ship : createShipProxy(this), 
            //@ts-ignore
            base : createBaseProxy(GameObjectManager.getBaseByTeam(this.team))})
    }

    update(){
        const updateCode = compileCode('this.Update(ship,base,Game,Graphics) \n' + 
                                    ' return ship')
        updateCode({ship : createShipProxy(this) , 
            //@ts-ignore
            base: createBaseProxy(GameObjectManager.getBaseByTeam(this.team)), 
            Game : GameObjectManagerProxy, 
            Graphics : GlobalRenderProxy })
    }

    // USER-CALLABLE FUNCTIONS 

    applyThrust(vector : Vector2D,percentage : number){
        const pct = clamp(percentage,0,1)
        this.transform.acceleration = vector.normal().multiply(pct)    
    }

    shoot(direction : Vector2D){
        // instantiate object
        this.resources.energy -= this.damage
        const bullet = new Bullet(create_UUID(),this.transform.position.add(direction.normal().multiply(Bullet.offset + this.collider.radius)), direction.normal().multiply(Bullet.speed), this.damage, this.uuid)
        GameObjectList.push(bullet)
    }

    upgradeMaxEnergy(){
        const base = GameObjectManager.getBaseByTeam(this.team)
        if (base !== undefined){
            if (base.resources.metal > this.energyCost){
                base.resources.metal -= this.energyCost
                this.energyCost *= 2
                this.maxEnergy *= 2
            }
        }
    }

    upgradeDamage(){
        const base = GameObjectManager.getBaseByTeam(this.team)
        if (base !== undefined){
            if (base.resources.metal > this.damageCost){
                base.resources.metal -= this.damageCost
                this.damageCost *= 2
                this.damage *= 2
            }
        }
    }

    // subtracting target's velocity gives us our intercept vector in the inertial reference frame of the target
    // multiplying by our desired speed gives us the top speed
    // subtracting our current velocity gives us dV
    seekTarget(target: GameObject){
        const desiredSpeed = 2.5 / FRAMERATE
        const desiredVelocity = target.transform.position.subtract(this.transform.position).normal().multiply(desiredSpeed).add(target.transform.velocity)
        const steering = desiredVelocity.subtract(this.transform.velocity)
        this.applyThrust(steering,1.0)
    }

    moveTo(position : Vector2D){
        const vec = position.subtract(this.transform.position)
        const power = vec.magnitude / 100
        this.applyThrust(vec,power)
    }

    moveToObject(obj : GameObject){
        const vec = obj.transform.position.subtract(this.transform.position)
        const power = vec.magnitude / 100
        this.applyThrust(vec,power)
    }
}

class Bullet extends GameObject {

    static speed = 0.25
    static offset = 5
    damage : number
    parent : number

    constructor(uuid : number,position : Vector2D,velocity : Vector2D,damage : number,parent : number){
        super(uuid,"BULLET",new Transform(BULLET_MASS,position,velocity),new Collider(Math.sqrt(BULLET_MASS)))

        this.damage = damage
        this.parent = parent
    }

    simulate(deltaTime : number){
        super.simulate(deltaTime)
    }

    render(){
        // draw the resources in the asteroid as colored rings
        GlobalRender.drawCircle(this.transform.position,this.collider.radius,"#FFFF00")
    }

    collide(otherObject : GameObject){

        switch (otherObject.type){
            case "SHIP":
                if (otherObject instanceof Ship){
                    otherObject.resources.energy -= this.damage // velocity + explosive
                    if (otherObject.resources.energy < 0){
                        GameStateManager.recordKill(this.parent)
                    }
                }
                break;
            case "OBSTACLE":
                if (otherObject instanceof Obstacle){
                    otherObject.breakUp()
                }
                break;
            case "BASE":
                if (otherObject instanceof Base){
                    otherObject.resources.energy -= this.damage // velocity + explosive
                }
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
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.damage,
            this.parent])
    }
}

class Base extends GameObject {

    resources : Resources
    shipQueue : Array<Generator>

    // user gettables
    team : number
    maxEnergy : number
    refiningRate : number
    baseShipCost : number
    shipCost : number
    healRate : number
    interactRadius : number
    healRateCost : number
    interactRadiusCost : number
    energyCost : number

    health : number
    healthCost : number
    healSelfRate : number
    healSelfRateCost : number

    constructor(uuid : number,position : Vector2D,energy : number,team : number){

        super(uuid,"BASE",new Transform(BASE_MASS,position,new Vector2D(0,0)), new Collider(Math.sqrt(BASE_MASS)))

        this.team = team
        this.resources = new Resources(0,0,energy)
        this.maxEnergy = 500

        this.shipQueue = []

        this.refiningRate = 0.01
        this.baseShipCost = 300

        // upgradeable
        this.shipCost = 300
        this.healRate = 0.01
        this.interactRadius = 50

        // upgrade costs
        this.healRateCost = 250
        this.interactRadiusCost = 250
        this.energyCost = 250
    }

    
    simulate(deltaTime : number){

        // stay static
        this.transform.velocity = new Vector2D(0,0)

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
        for(const j in this.shipQueue){
            const i = parseInt(j)
            const coroutine = this.shipQueue[i]
            const output = coroutine.next()
            if (output.done === true){
                this.shipQueue.splice(i,1)
                if (output.value === false)
                    this.queueShip()
            }
        }

        if (this.resources.energy < 0){
            this.destroy()
        }
    }

    collide(otherObject : GameObject){
        const oomf = 15.0
        const vec = otherObject.transform.position.subtract(this.transform.position).normal()
        otherObject.transform.velocity = otherObject.transform.velocity.add(vec.multiply(oomf))
    }

    render(){
        GlobalRender.drawCircle(this.transform.position,this.collider.radius,teamColors[this.team])
        GlobalRender.drawArc(this.transform.position,this.collider.radius,0,(this.resources.energy / this.maxEnergy) * 2 * Math.PI,"#FFFF00")
        GlobalRender.drawText(this.resources.toString(),this.transform.position.subtract(new Vector2D(100,0)),12,"#FFFFFF")
    }

    destroy(){
        this.type = "DEAD"
    }

    healShip(deltaTime : number,ship : Ship){
        if (this.resources.energy > 0 && ship.resources.energy < ship.maxEnergy){
            const amount = this.healRate * deltaTime
            this.resources.energy -= amount
            ship.resources.energy += amount
        }
    }

    takeResources(ship : Ship){
        GameStateManager.addMetal(this.team,ship.resources.metal)
        this.resources.metal += ship.resources.metal
        this.resources.water += ship.resources.water
        ship.resources.metal = 0
        ship.resources.water = 0
    }

    trySpawnShip(energy : number,respawn : boolean){

        let canSpawnShip = false
        const newEnergy = Math.min(energy,SHIP_BASE_MAX_ENERGY)

        // check if we have the required resources
        if(!respawn){
            if (this.resources.metal > this.shipCost && this.resources.energy > newEnergy){
                canSpawnShip = true
            }     
        }else{
            if (this.resources.energy > newEnergy){
                canSpawnShip = true
            }
        }

        // check around the base
        const angle = 360 / 32
        for(let i = 0; i < 32; i++){
            let pos = new Vector2D(0,1).multiply(this.collider.radius * 1.5).rotate(angle*i).add(this.transform.position)
            const obj = new Ship(create_UUID(),pos,energy,this.team)
            if (overlapCircle(pos,obj.collider.radius*1.2).length < 1){

                // SPAWNING
                if (!respawn)
                    this.resources.metal -= this.shipCost
            
                this.resources.energy -= newEnergy

                GameObjectList.push(obj)
                return true
            }
        }

        return false
    }

    queueShip(){
        function* spawnShipCoroutine(self : Base,numFrames : number){
            for (let i = 0; i < numFrames; i++){
                yield;
            }
            console.log("Ship respawning")
            return self.trySpawnShip(10,true)
        }

        this.shipQueue.push(spawnShipCoroutine(this,900))
    }

    serialize(){   
        return JSON.stringify([this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.resources.getResources()["energy"],
            this.team])
    }

    start(){
        const startCode = compileCode('this.BaseStart(ship) \n' +
                                'return base')
        startCode({base : createBaseProxy(this)})
    }

    update(){
        const updateCode = compileCode('this.BaseUpdate(base,Game,Graphics) \n' + 
                                    ' return base')
        updateCode({base : createBaseProxy(this), Game : GameObjectManagerProxy, Graphics : GlobalRenderProxy})
    }

    // USER CALLABLE FUNCTIONS
    
    upgradeHealth(){
        if (this.resources.metal > this.energyCost){
            this.maxEnergy += 500
            this.resources.metal -= this.energyCost
            this.energyCost *= 2
        }
    }

    upgradeHealRate(){
        if (this.resources.metal > this.healRateCost){
            this.healRate *= 2
            this.resources.metal -= this.healRateCost
            this.healRateCost *= 2
        }
    }

    upgradeInteractRadius(){
        if (this.resources.metal > this.interactRadiusCost){
            this.interactRadius *= 2
            this.resources.metal -= this.interactRadiusCost
            this.interactRadiusCost *= 2
        }
    }

    spawnShip(energy : number){
        this.trySpawnShip(energy,false)
    }
}
