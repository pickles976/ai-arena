class ObjectManager{

    static numAsteroids : number = 10
    static numObstacles : number = 20
    static numEnergyCells : number = 5

    static obstacleMassRange : [number, number] = [20,200]
    static asteroidMetalRange : [number, number] = [10,100]
    static asteroidWaterRange : [number, number] = [10,100]
    static energyCellRange : [number, number] = [20,120]
    static speedRange : [number, number] = [0.01,0.05]

    static spawnQueue : {[key: string] : Array<Generator> } = { "ASTEROID" : [], "OBSTACLE" : [], "ENERGY_CELL" : [] }

    asteroids : Array<Asteroid>
    obstacles : Array<Obstacle>
    energyCells : Array<EnergyCell>
    ships : Array<Ship>
    bullets : Array<Bullet>
    bases : Array<Base>

    constructor(){
        this.asteroids = []
        this.obstacles = []
        this.energyCells = []
        this.ships = []
        this.bullets = []
        this.bases = []
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

        for(let i = 0; i < gameObjectList.length; i++){
            const gameObj = gameObjectList[i]

            switch (gameObj.type){
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

    update(){
        // loop through the spawn queue and count down their timers
        for (const [key,value] of Object.entries(ObjectManager.spawnQueue)){
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
        if (ObjectManager.spawnQueue["ASTEROID"].length + this.asteroids.length < ObjectManager.numAsteroids){
            this.queueObject("ASTEROID", 450)
        }

        if (ObjectManager.spawnQueue["OBSTACLE"].length + this.obstacles.length < ObjectManager.numObstacles){
            this.queueObject("OBSTACLE", 300)
        }

        if (ObjectManager.spawnQueue["ENERGY_CELL"].length + this.energyCells.length < ObjectManager.numEnergyCells){
            this.queueObject("ENERGY_CELL", 600)
        }

    }

    // spawns the object immediately
    spawnObject(type : string){

        sortGameObjectList()

        const vel = Vector2D.random().multiply(randomInRange(...ObjectManager.speedRange))
        let obj : object = {}

        switch (type){
            case "ASTEROID":
                const metal = randomInRange(...ObjectManager.asteroidMetalRange)
                const water = randomInRange(...ObjectManager.asteroidWaterRange)
                obj = new Asteroid(create_UUID(),Vector2D.zero,vel,metal,water)
                break;
            case "OBSTACLE":
                const mass = randomInRange(...ObjectManager.obstacleMassRange)
                obj = new Obstacle(create_UUID(),Vector2D.zero,vel,mass)
                break;
            case "ENERGY_CELL":
                const energy = randomInRange(...ObjectManager.energyCellRange)
                obj = new EnergyCell(create_UUID(),Vector2D.zero,vel,energy)
                break;
        }

        if (obj instanceof GameObject){
            // check 32 times for a spot to place it
            for(let i = 0; i < 32; i++){
                const randomPos = new Vector2D(Math.random()*W,Math.random()*H)
                if (overlapCircle(randomPos,obj.circle.radius*1.5).length < 1){
                    obj.circle.position = randomPos
                    GameObjectList.push(obj)
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
    queueObject(type : string,numFrames : number){

        function* queueObjectCoroutine(self : ObjectManager,type : string,numFrames : number){
            for(let i = 0; i < numFrames; i++){
                yield;
            }
            
            self.spawnObject(type)
        }

        ObjectManager.spawnQueue[type].push(queueObjectCoroutine(this,type,numFrames))
    }

    getAsteroids(){
        return this.asteroids
    }

    getClosestAsteroid(position : Vector2D){
        const asteroids = this.getAsteroids()

            let closest = [{},100000]
            for (const i in asteroids){
                const asteroid = asteroids[i]
                const d = asteroid.circle.position.subtract(position).magnitude
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
                const d = obstacle.circle.position.subtract(position).magnitude
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
                const d = energyCell.circle.position.subtract(position).magnitude
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
}