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

    serialize(){
    
        const team0 = {
            "kills" : this.kills[0],
            "deaths" : this.deaths[0],
            "metal" : this.metal[0].toFixed(2),
            "energy" : this.energy[0].toFixed(2)
        }

        const team1 = {
            "kills" : this.kills[1],
            "deaths" : this.deaths[1],
            "metal" : this.metal[1].toFixed(2),
            "energy" : this.energy[1].toFixed(2)
        }

        const obj = { "team 0" : team0, "team 1" : team1}

        return JSON.stringify(obj)


    }

    recordKill(uuid){
        const killerShip = GameObjectList.find((x) => x.uuid == uuid)
        this.addKill(killerShip.team)
    }

}