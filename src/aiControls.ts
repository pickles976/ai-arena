// @ts-nocheck
function BaseStart(base){
    console.log("Base Start!")
}

function BaseUpdate(base, Game){
    const energy = 50
    if (base.resources.metal > base.shipCost && base.resources.energy > energy){
        base.spawnShip(energy,false)
    }
}

function Start(ship){

    ship.target = {}
    ship.state = "IDLE"

}

function Update(ship, Game){

    const base = Game.getBaseByTeam(ship.team)

    // STATE MACHINE
    switch(ship.state){

        case "IDLE":
        
            const asteroids = Game.getAsteroids()

            let closest = [{},100000]

            for (const index in asteroids){
                const asteroid = asteroids[index]
                const d = dist(asteroid,ship)
                if (d < closest[1]){
                    closest = [asteroid,d]
                }
            }

            ship.target = closest[0]
            ship.state = "MOVE_TO_ASTEROID"


            break;

        case "MOVE_TO_ASTEROID":

            if (ship.target.type === "ASTEROID"){
                ship.seekTarget(ship.target)
            }else{
                ship.target = base
                ship.state = "MOVE_TO_BASE"
            }

            break;

        case "MOVE_TO_BASE":

            if (ship.resources.metal > 0 || ship.resources.water > 0){
                ship.moveToObject(ship.target)
            }else{
                ship.state = "IDLE"
            }

            break;

        case "MOVE_TO_ENERGY":
            if (ship.target.type === "ENERGY_CELL"){
                ship.seekTarget(ship.target)
            }else if (ship.target.type === "BASE") {
                if (ship.resources.energy > 90 || base.resources.energy < 1 || dist(ship,base) > base.interactRadius){
                    ship.state = "IDLE"
                }else{
                    ship.seekTarget(ship.target)
                }
            }
            else{
                ship.state = "IDLE"
            }
            break;
            
    }

    // seekTarget ENERGY
    if (ship.resources.energy < (ship.maxEnergy / 4)){
        const energyCells = Game.getEnergyCells()

        let closest = [base,dist(base,ship)]

        for (const index in energyCells){
            const energyCell = energyCells[index]
            const d = dist(energyCell,ship)
            if (d < closest[1]){
                closest = [energyCell,d]
            }
        }

        ship.target = closest[0]
        ship.state = "MOVE_TO_ENERGY"
    }

    // COMBAT
    if(ship.resources.energy > (ship.damage)){
        const shootRadius = 200
        const ships = Game.getShips()

        let closest = [{},100000]

        for (const index in ships){
            const otherShip = ships[index]
            if (otherShip.team != ship.team){
                const d = dist(ship,otherShip)
                if (d < closest[1]){
                    closest = [otherShip,d]
                }
            }
        }

        if (closest[1] < shootRadius){
            ship.shoot(closest[0].circle.position.subtract(ship.circle.position).add(closest[0].circle.velocity.multiply(60)))
        }
    }

    // UPGRADES
    if (base.resources.metal > ship.energyCost && Game.getShipsByTeam(ship.team).length > 2){
        ship.upgradeMaxEnergy()
    }

    if (base.resources.metal > ship.damageCost && Game.getShipsByTeam(ship.team).length > 2){
        ship.upgradeDamage()
    }

    console.log(ship.target)
    ship.targetID = ship.target.uuid

    // DEBUG DRAWING
    ship.drawText(ship.resources.toString(),ship.circle.position,10,"#FFFFFF")
    ship.drawText(ship.state,ship.circle.position.subtract(Vector2D.up.multiply(-10)),8,"#FFFFFF")
    if (ship.target != undefined && ship.target.circle != undefined)
        ship.drawLine(ship.circle.position,ship.target.circle.position,"#00FF00")
}