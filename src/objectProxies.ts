/**
 * Create a Proxy objects that we pass to user code.
 * We only allow for getting the specific fields that we want users to have access to.
 * Setting, defining, and deleting is not allowed
 */

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

function createGameObjectProxy(gameObject : GameObject){

    const whiteList = ["uuid","type"]

    const grayList = ["circle","resources"]

    const gameObjectHandler : ProxyHandler<GameObject> = {

        get : (target : GameObject, prop : string) => {

            const field = Reflect.get(target,prop)

            if (grayList.includes(prop)){
                return Serializer.deserialize(field.serialize())
            }
            else if (whiteList.includes(prop))
            {
                return field
            }
                
            return null

        },
        set : (target, prop : string, value, receiver) => {
            return false
        },
        deleteProperty : (target, prop : string) => {
            return false
        },
        defineProperty : (target,prop : string, attributes) => {
            return false
        }

    }

    return new Proxy(gameObject,gameObjectHandler)

}

 function createShipProxy(ship : Ship){

    // readable fields
    const whiteList = ["uuid", "team" , "maxEnergy", "damage", "energyCost", 
            "damageCost", "upgradeMaxEnergy", "upgradeDamage", "seekTarget", 
            "moveTo", "moveToObject", "applyThrust", "shoot"]

    // readable after deep copy
    const grayList = ["resources","circle"]

    // not readable under any circumstances
    const blackList = ["simulate","render","getResources",
    "collide", "totalMass","destroy","toString", "serialize", 
    "createProxy", "start", "update"]

    const shipHandler : ProxyHandler<Ship> = {

        get : (target : Ship, prop : string) => {

            const field = Reflect.get(target,prop)

            if (grayList.includes(prop)){
                return Serializer.deserialize(field.serialize())
            }
            else if (!blackList.includes(prop))
            {
                if (typeof field === "function"){
                    return function(...args : any[]){
                        return field.apply(target,args)
                    }
                }else{
                    return field
                }
            }
                
            return null

        },
        set : (target, prop : string, value, receiver) => {
            if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop))
            {
                Reflect.set(target,prop,value,receiver)
                return true
            }
            return false
        },
        deleteProperty : (target, prop : string) => {
            return false
        },
        defineProperty : (target,prop : string, attributes) => {
            if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop))
            {
                Reflect.defineProperty(target,prop,attributes)    
                return true
            }
            return false
        }
    }

    return new Proxy(ship,shipHandler)

}

function createBaseProxy(base : Base){

    // readable fields
    const whiteList = ["uuid", "team" , "maxEnergy", "refiningRate", "baseShipCost", 
            "shipCost", "healRate", "interactRadius", "healRateCost", "interactRadiusCost",
            "energyCost","upgradeHealth", "upgradeHealRate", "upgradeInteractRadius", 
            "spawnShip"]

    // readable after deep copy
    const grayList = ["resources","circle"]

    // not readable under any circumstances
    const blackList = ["shipQueue","simulate",
    "collide","render","destroy","healShip","takeResources",
    "trySpawnShip", "queueShip", "serialize", "createProxy", "start", "update"]

    const baseHandler : ProxyHandler<Base> = {

        get : (target : Base, prop : string) => {

            if (grayList.includes(prop)){
                return Serializer.deserialize(Reflect.get(target,prop).serialize())
            }
            else if (!blackList.includes(prop))
            {
                //@ts-ignore
                const field = target[prop]
                if (typeof field === "function"){
                    return function(...args : any[]){
                        //@ts-ignore
                        return target[prop].apply(target,args)
                    }
                }else{
                    return field
                }
            }
                
            return null

        },
        set : (target, prop : string, value, receiver) => {
            if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop))
            {    
                Reflect.set(target,prop,value,receiver)
                return true
            }
            return false
        },
        deleteProperty : (target, prop : string) => {
            return false
        },
        defineProperty : (target,prop : string, attributes) => {
            if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop))
            {
                Reflect.defineProperty(target,prop,attributes)    
                return true
            }
            return false
        }
    }

    return new Proxy(base,baseHandler)

}

function createObjectManagerProxy(gameManager : ObjectManager){

    const whiteList = ["getAsteroids" , "getClosestAsteroid" , "getObstacle", "getClosestObstacle", 
    "getEnergyCells", "getClosestEnergyCell", "getShips", "getShipsByTeam", 
    "getBullets","getBases","getBaseByTeam"]

    // whitelist specified functions, disallow all setting, deleting, and defining
    const gameManagerHandler : ProxyHandler<ObjectManager> = {

        get : (target : ObjectManager, prop : string) => {

            if (whiteList.includes(prop)){
                return function(...args : any[]){

                    // get the objects from whatever call
                    let items = Reflect.get(target,prop).apply(target,args)

                    // create proxies for both lists and individual objects
                    if(Object.prototype.toString.call(items) === '[object Array]'){
                        items = items.map((item : GameObject) => createGameObjectProxy(item))
                    }else{
                        items = createGameObjectProxy(items)
                    }

                    return items
                }
            }
                
            return null

        },
        set : (target, prop, value, receiver) => {
            return false
        },
        deleteProperty : (target, p) => {
            return false
        },
        defineProperty : (target,propery,attributes) => {
            return false
        }
    }

    return new Proxy(gameManager,gameManagerHandler)

}
