class ObjectManager{

    static numAsteroids : number = NUM_ASTEROIDS
    static numObstacles : number = NUM_OBSTACLES
    static numEnergyCells : number = NUM_ENERGY_CELLS

    static obstacleMassRange : [number, number] = OBSTACLE_MASS_RANGE
    static asteroidMetalRange : [number, number] = ASTEROID_METAL_RANGE
    static asteroidWaterRange : [number, number] = ASTEROID_WATER_RANGE
    static energyCellRange : [number, number] = ENERGY_CELL_RANGE
    static speedRange : [number, number] = SPEED_RANGE

    spawnQueue : {[key: string] : Array<Generator> }

    asteroids : Array<Asteroid>
    obstacles : Array<Obstacle>
    energyCells : Array<EnergyCell>
    ships : Array<Ship>
    bullets : Array<Bullet>
    bases : Array<Base>
    all : Array<GameObject>

    constructor(){
        this.asteroids = []
        this.obstacles = []
        this.energyCells = []
        this.ships = []
        this.bullets = []
        this.bases = []
        this.all = []
        this.spawnQueue = { "ASTEROID" : [], "OBSTACLE" : [], "ENERGY_CELL" : [] }
    }

    /**
     * spawn initial objects
     */
    start(){

        for(let i = 0; i < ObjectManager.numAsteroids; i++){
            this.spawnObject("ASTEROID")
        }

        for(let i = 0; i < ObjectManager.numObstacles; i++){
            this.spawnObject("OBSTACLE")
        }

        for(let i = 0; i < ObjectManager.numEnergyCells; i++){
            this.spawnObject("ENERGY_CELL")
        }

        this.indexObjects(GameObjectList)

    }

    indexObjects(gameObjectList : Array<GameObject>){
        this.asteroids = []
        this.obstacles = []
        this.energyCells = []
        this.ships = []
        this.bullets = []
        this.bases = []
        this.all = []

        for(let i = 0; i < gameObjectList.length; i++){
            const gameObj = gameObjectList[i]

            if (gameObj != undefined && gameObj != null){

                this.all.push(gameObj)

                switch (gameObj?.type){
                    case "ASTEROID":
                        if (gameObj instanceof Asteroid)
                            this.asteroids.push(gameObj as Asteroid)
                        break;
                    case "OBSTACLE":
                        if (gameObj instanceof Obstacle)
                            this.obstacles.push(gameObj as Obstacle)
                        break;
                    case "ENERGY_CELL":
                        if (gameObj instanceof EnergyCell)
                            this.energyCells.push(gameObj as EnergyCell)
                        break;
                    case "SHIP":
                        if (gameObj instanceof Ship)
                            this.ships.push(gameObj as Ship)
                        break;
                    case "BULLET":
                        if (gameObj instanceof Bullet)
                            this.bullets.push(gameObj as Bullet)
                        break;
                    case "BASE":
                        if (gameObj instanceof Base)
                            this.bases.push(gameObj as Base)
                        break;
                    default:
                        break;
                }
            }
        }
    }

    update(){
        // loop through the spawn queue and count down their timers
        for (const [key,value] of Object.entries(this.spawnQueue)){
            for (let i = value.length - 1; i >= 0; i--){
                const co = value[i]
                const temp = co.next()
                if (temp.done === true){
                    value.splice(i,1)
                }
            }
        }

        this.indexObjects(GameObjectList)

        // check spawnQueue and existing objects, see if new ones need to be spawned
        if (this.spawnQueue["ASTEROID"].length + this.asteroids.length < ObjectManager.numAsteroids){
            this.queueObject("ASTEROID", ASTEROID_RESPAWN_TIME)
        }

        if (this.spawnQueue["OBSTACLE"].length + this.obstacles.length < ObjectManager.numObstacles){
            this.queueObject("OBSTACLE", OBSTACLE_RESPAWN_TIME)
        }

        if (this.spawnQueue["ENERGY_CELL"].length + this.energyCells.length < ObjectManager.numEnergyCells){
            this.queueObject("ENERGY_CELL", ENERGY_CELL_RESPAWN_TIME)
        }

    }

    // spawns the object immediately
    private spawnObject(type : string){

        sortGameObjectList()

        const vel = Vector2D.random().multiply(randomInRange(...ObjectManager.speedRange))
        let obj : object = {}

        switch (type){
            case "ASTEROID":
                const metal = randomInRange(...ObjectManager.asteroidMetalRange)
                const water = randomInRange(...ObjectManager.asteroidWaterRange)
                obj = new Asteroid(create_UUID(),new Vector2D(0,0),vel,metal,water)
                break;
            case "OBSTACLE":
                const mass = randomInRange(...ObjectManager.obstacleMassRange)
                obj = new Obstacle(create_UUID(),new Vector2D(0,0),vel,mass)
                break;
            case "ENERGY_CELL":
                const energy = randomInRange(...ObjectManager.energyCellRange)
                obj = new EnergyCell(create_UUID(),new Vector2D(0,0),vel,energy)
                break;
        }

        if (obj instanceof GameObject){
            // check 32 times for a spot to place it
            for(let i = 0; i < 32; i++){
                const randomPos = new Vector2D(Math.random()*W,Math.random()*H)
                if (overlapCircle(randomPos,obj.collider.radius*1.5).length < 1){
                    obj.transform.position = randomPos
                    spawn(obj)
                    return true
                }
            }
        }

        // if no spot found, re-queue it for another 180 frames
        this.queueObject(type, 180)
        return false

    }

    /**
     * Queues up an object to wait a certain number of frames before spawning
     * @param {string} type 
     * @param {number} numFrames 
     */
    private queueObject(type : string,numFrames : number){

        function* queueObjectCoroutine(self : ObjectManager,type : string,numFrames : number) : any{
            for(let i = 0; i < numFrames; i++){
                yield;
            }
            
            self.spawnObject(type)
        }

        this.spawnQueue[type].push(queueObjectCoroutine(this,type,numFrames))
    }

    getAsteroids(){
        return this.asteroids
    }

    getClosestAsteroid(position : Vector2D){
        const asteroids = this.getAsteroids()

            let closest = [{},100000]
            for (const i in asteroids){
                const asteroid = asteroids[i]
                const d = asteroid.transform.position.subtract(position).magnitude
                if (d < closest[1]){
                    closest = [asteroid,d]
                }
            }
            return closest[0]
    }

    getObstacles(){
        return this.obstacles
    }

    getClosestObstacle(position : Vector2D){
        const obstacles = this.getObstacles()

            let closest = [{},100000]
            for (const i in obstacles){
                const obstacle = obstacles[i]
                const d = obstacle.transform.position.subtract(position).magnitude
                if (d < closest[1]){
                    closest = [obstacle,d]
                }
            }
            return closest[0]
    }

    getEnergyCells(){
        return this.energyCells
    }

    getClosestEnergyCell(position: Vector2D){
        const energyCells = this.getEnergyCells()

            let closest = [{},100000]
            for (const i in energyCells){
                const energyCell = energyCells[i]
                const d = energyCell.transform.position.subtract(position).magnitude
                if (d < closest[1]){
                    closest = [energyCell,d]
                }
            }
            return closest[0]
    }

    getShips(){
        return this.ships
    }

    getShipsByTeam(team : number){
        return this.ships.filter((ship) => ship.team === team)
    }

    getBullets(){
        return this.bullets
    }

    getBases(){
        return this.bases
    }

    getBaseByTeam(team : number){
        try {
            return this.bases.filter((base) => base.team === team)[0]
        } catch (e) {
            console.log("Team " + team + " base has been destroyed!")
        }
    }

    getObjectFromUUID(uuid : number){
        try {
            return this.all.filter((obj) => obj.uuid === uuid)[0]
        }
        catch (e)
        {
            return null
        }
    }

    refreshObject(obj : GameObject){
        return this.getObjectFromUUID(obj.uuid)
    }
}