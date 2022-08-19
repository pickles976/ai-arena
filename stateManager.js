class StateManager{

    constructor(){
        // team deaths
        this.deaths = [0,0]
        // team kills
        this.kills = [0,0]
        // team metal collected
        this.metal = [0,0]
        // team energy collected
        this.energy = [0,0]
    }

    addDeath(team){
        this.deaths[team] += 1
    }

    addKill(team){
        this.kills[team] += 1
    }

    addMetal(team,amount){
        this.metal[team] += amount
    }

    addEnergy(team,amount){
        this.energy[team] += amount
    }

    update(){
        for(const i in this.deaths){
            if(GameObjectManager.getBaseByTeam(i) === false) {
                console.log(team + " has lost")
            }
        }
    }

}