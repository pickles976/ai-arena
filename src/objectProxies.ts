class ShipProxy extends GameObject {

    ActionQueue : Array<any>

    team : number
    maxEnergy : number
    damage : number
    energyCost : number
    damageCost : number

    uuid : number
    position : Vector2D
    velocity : Vector2D
    resources : Resources

    radius : number
    

    // all the same values
    constructor(uuid: number, position: Vector2D, energy: number,team: number){

        super(uuid,"SHIP",new Circle(SHIP_MASS,position,Vector2D.zero))
        this.uuid = uuid

        this.resources = new Resources(0,0,energy)
        this.team = team

        // upgradeable
        this.maxEnergy = 100
        this.damage = 25

        // upgrade costs
        this.energyCost = 100
        this.damageCost = 100

        this.ActionQueue = []
    }

    // calling the functions results in strings being added to the proxy queue

    applyThrust(vector : Vector2D, percentage : number){
        this.ActionQueue.push(["APPLY_THRUST",vector,percentage])
    }

    shoot(vector : Vector2D){
        this.ActionQueue.push(["SHOOT",vector])
    }

    upgradeMaxEnergy(){
        this.ActionQueue.push(["UPGRADE_MAX_ENERGY"])
    }

    upgradeDamage(){
        this.ActionQueue.push(["UPGRADE_DAMAGE"])
    }

    moveToObject(target : GameObject){
        this.ActionQueue.push(["MOVE_TO_OBJECT",target])
    }

    seekTarget(target : GameObject){
        this.ActionQueue.push(["SEEK_TARGET",target])
    }

    drawText(text : string,position : Vector2D,size : number, color : string){
        this.ActionQueue.push(["DRAW_TEXT",text,position,size,color])
    }

    drawLine(start : Vector2D,end : Vector2D,color : string){
        this.ActionQueue.push(["DRAW_LINE",start,end,color])
    }

    drawCircle(position : Vector2D,radius : number,color : string){
        this.ActionQueue.push(["DRAW_CIRCLE",position,radius,color])
    }

}

class BaseProxy extends GameObject {

    ActionQueue : Array<any>

    team : number
    resources : Resources
    maxEnergy : number
    shipQueue : Array<Generator>
    refiningRate : number
    baseShipCost : number
    shipCost : number
    healRate : number
    interactRadius : number
    healRateCost : number
    interactRadiusCost : number
    energyCost : number
    

    // all the same values
    constructor(uuid : number,position : Vector2D,energy : number,team : number){

        super(uuid,"BASE",new Circle(BASE_MASS,position,Vector2D.zero))

        this.team = team
        this.resources = new Resources(0,0,energy)

        this.ActionQueue = []
    }

    upgradeInteractRadius(){
        this.ActionQueue.push(["UPGRADE_INTERACT_RADIUS"])
    }

    upgradeHealRate(){
        this.ActionQueue.push(["UPGRADE_HEAL_RATE"])
    }

    upgradeHealth(){
        this.ActionQueue.push(["UPGRADE_HEALTH"])
    }

    spawnShip(energy : number){
        this.ActionQueue.push(["SPAWN_SHIP",energy])
    }

    drawText(text : string,position : Vector2D,size : number, color : string){
        this.ActionQueue.push(["DRAW_TEXT",text,position,size,color])
    }

    drawLine(start : Vector2D,end : Vector2D,color : string){
        this.ActionQueue.push(["DRAW_LINE",start,end,color])
    }

    drawCircle(position : Vector2D,radius : number,color : string){
        this.ActionQueue.push(["DRAW_CIRCLE",position,radius,color])
    }

}
