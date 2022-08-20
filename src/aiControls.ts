//@ts-nocheck
function BaseStart(){
    console.log("Base Start!")
}

function BaseUpdate(){
    const energy = 50
    if (this.resources.metal > this.shipCost && this.resources.energy > energy){
        this.trySpawnShip(energy,false)
    }
}

function Start(){
    this.target = {}
    this.state = "IDLE"
}

function Update(){

    const base = GameObjectManager.getBaseByTeam(this.team)

    // STATE MACHINE
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
                this.seekTarget(this.target)
            }else{
                this.target = base
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
                this.seekTarget(this.target)
            }else if (this.target.type === "BASE") {
                if (this.resources.energy > 90 || base.resources.energy < 1 || dist(this,base) > base.interactRadius){
                    this.state = "IDLE"
                }else{
                    this.seekTarget(this.target)
                }
            }
            else{
                this.state = "IDLE"
            }
            break;
            
    }

    // seekTarget ENERGY
    if (this.resources.energy < (this.maxEnergy / 4)){
        const energyCells = GameObjectManager.getEnergyCells()

        let closest = [base,dist(base,this)]

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

    // COMBAT
    if(this.resources.energy > (this.damage)){
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

        if (closest[1] < shootRadius){
            this.shoot(closest[0].circle.position.subtract(this.circle.position).add(closest[0].circle.velocity.multiply(60)))
        }
    }

    // UPGRADES
    if (base.resources.metal > this.energyCost && GameObjectManager.getShipsByTeam(this.team).length > 2){
        this.upgradeMaxEnergy()
    }

    if (base.resources.metal > this.damageCost && GameObjectManager.getShipsByTeam(this.team).length > 2){
        this.upgradeDamage()
    }

    // DEBUG DRAWING
    GlobalRender.drawText(this.resources.toString(),this.circle.position,10,"#FFFFFF")
    GlobalRender.drawText(this.state,this.circle.position.subtract(Vector2D.up.multiply(-10)),8,"#FFFFFF")
    GlobalRender.drawLine(this.circle.position,this.target.circle.position,"#00FF00")
}