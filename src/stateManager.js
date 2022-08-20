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

    getTeamInfo(team){
        const teamInfo = {
            "kills" : this.kills[team],
            "deaths" : this.deaths[team],
            "metal" : this.metal[team].toFixed(2),
            "energy" : this.energy[team].toFixed(2)
        }

        return teamInfo
    }

    serialize(){

        const obj = { "team 0" : this.getTeamInfo(0), "team 1" : this.getTeamInfo(1)}

        return JSON.stringify(obj)

    }

    recordKill(uuid){
        const killerShip = GameObjectList.find((x) => x.uuid == uuid)
        this.addKill(killerShip.team)
    }

}