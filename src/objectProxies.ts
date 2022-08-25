/**
 * Create a Proxy objects that we pass to user code.
 * We only allow for getting the specific fields that we want users to have access to.
 * Setting, defining, and deleting is not allowed
 */
const createRendererProxy = function(renderer : Renderer){

    const whiteList = ["H","W","drawText","drawLine","drawCircle",
    "drawCircleTransparent"]

    const rendererHandler : ProxyHandler<Renderer> = {

        get : (target : Renderer, prop : string) => {

            const field = Reflect.get(target,prop)

            if (whiteList.includes(prop))
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
            return false
        },
        deleteProperty : (target, prop : string) => {
            return false
        },
        defineProperty : (target,prop : string, attributes) => {
            return false
        }

    }

    return new Proxy(renderer,rendererHandler)

}

// we use a blacklist for the GameObject proxy so we can access the
// user-generated memory of other AI
const createGameObjectProxy = function(gameObject : GameObject){

    const grayList = ["transform","collider","resources"]

    const blackList = ["spawnShip", "upgradeInteractRadius", "upgradeHealRate",
    "upgradeMaxEnergy", "update", "start", "serialize", "queueShip", "trySpawnShip", "takeResources",
    "healShip", "destroy", "render", "collide", "simulate", "shipQueue", "moveTo",
    "seekTarget", "upgradeDamage", "shoot", "applyThrust", "breakup", "totalMass",
    "getResources", "toString", "colors"]

    const gameObjectHandler : ProxyHandler<GameObject> = {

        get : (target : GameObject, prop : string) => {

            const field = Reflect.get(target,prop)

            if (grayList.includes(prop)){
                return Serializer.deserialize(field.serialize())
            }
            else if (!blackList.includes(prop))
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

const createShipProxy = function(ship : Ship){

    // readable fields
    const whiteList = ["uuid", "team" , "maxEnergy", "damage", "upgradeMaxEnergyCost", 
            "upgradeDamageCost", "upgradeMaxEnergy", "upgradeDamage", "seekTarget", 
            "moveTo", "shoot"]

    // readable after deep copy
    const grayList = ["transform","collider","resources"]

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

const createBaseProxy = function(base : Base){

    // readable fields
    const whiteList = ["uuid", "team" , "health",
            "shipCost", "spawnShip",
            "healRate", "upgradeHealRateCost", "upgradeHealRate", 
            "maxEnergy", "upgradeMaxEnergyCost", "upgradeMaxEnergy",
            "refiningRate","upgradeRefiningRateCost", "upgradeRefiningRate",
            "interactRadius", "upgradeInteractRadiusCost", "upgradeInteractRadius", 
            "refiningEfficiency","upgradeRefiningEfficiencyCost","upgradeRefiningEfficiency",
            "repairRate","upgradeRepairRateCost","upgradeRepairRate",
            "maxHealth","upgradeMaxHealthCost","upgradeMaxHealth"]

    // readable after deep copy
    const grayList = ["transform","collider","resources"]

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

const createObjectManagerProxy = function(gameManager : ObjectManager){

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