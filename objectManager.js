class ObjectManager{

    static numAsteroids = 10
    static numObstacles = 20
    static numEnergyCells = 5

    static obstacleMassRange = [20,200]
    static asteroidMetalRange = [10,100]
    static asteroidWaterRange = [10,100]
    static energyCellRange = [20,120]

    static spawnQueue = { "ASTEROID" : [], "OBSTACLE" : [], "ENERGY_CELL" : [] }

    static speedRange = [0.01,0.05]

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

        this.indexObjects()

    }

    indexObjects(){
        this.asteroids = []
        this.obstacles = []
        this.energyCells = []
        this.ships = []
        this.bullets = []
        this.bases = []

        for(let i = 0; i < GameObjectList.length; i++){
            const gameObj = GameObjectList[i]

            switch (gameObj.type){
                case "ASTEROID":
                    this.asteroids.push(this.gameObj)
                    break;
                case "OBSTACLE":
                    this.obstacles.push(this.gameObj)
                    break;
                case "ENERGY_CELL":
                    this.energyCells.push(this.gameObj)
                    break;
                case "SHIP":
                    this.ships.push(this.gameObj)
                    break;
                case "BULLET":
                    this.bullets.push(this.gameObj)
                    break;
                case "BASE":
                    this.bases.push(this.gameObj)
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

        this.indexObjects()

        // check spawnQueue and existing objects, see if new ones need to be spawned
        if (ObjectManager.spawnQueue["ASTEROID"] + this.asteroids.length < ObjectManager.numAsteroids){
            this.queueObject("ASTEROID", 450)
        }

        if (ObjectManager.spawnQueue["OBSTACLE"] + this.obstacles.length < ObjectManager.numObstacles){
            this.queueObject("OBSTACLE", 300)
        }

        if (ObjectManager.spawnQueue["ENERGY_CELL"] + this.energyCells.length < ObjectManager.numEnergyCells){
            this.queueObject("ENERGY_CELL", 600)
        }

    }

    /**
     * Spawn the object immediately
     * @param {string} type 
     */
    spawnObject(type){

        sortGameObjectList()

        const vel = Vector2D.random().multiply(randomInRange(...ObjectManager.speedRange))
        let obj = {}

        switch (type){
            case "ASTEROID":
                const metal = randomInRange(...ObjectManager.asteroidMetalRange)
                const water = randomInRange(...ObjectManager.asteroidWaterRange)
                obj = new Asteroid(Vector2D.zero,vel,metal,water)
                break;
            case "OBSTACLE":
                const mass = randomInRange(...ObjectManager.obstacleMassRange)
                obj = new Obstacle(Vector2D.zero,vel,mass)
                break;
            case "ENERGY_CELL":
                const energy = randomInRange(...ObjectManager.energyCellRange)
                obj = new EnergyCell(Vector2D.zero,vel,energy)
                break;
        }

        // check 32 times for a spot to place it
        for(let i = 0; i < 32; i++){
            const randomPos = new Vector2D(Math.random()*W,Math.random()*H)
            if (overlapCircle(randomPos,obj.circle.radius*1.5).length < 1){
                obj.circle.position = randomPos
                GameObjectList.push(obj)
                return true
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
    queueObject(type,numFrames){

        function* queueObjectCoroutine(self,type,numFrames){
            for(let i = 0; i < numFrames; i++){
                yield;
            }
            
            self.spawnObject(type)
        }

        ObjectManager.spawnQueue[type].push(queueObjectCoroutine(this,type,numFrames))
    }
}