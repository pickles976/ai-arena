import { GameEndCallbacks, GameObjectList, GameObjectManager } from "./globals.js"
import { Ship } from "./objects.js"

export class StateManager{

    deaths : [number, number]
    kills : [number, number]
    metal : [number, number]
    energy : [number,number]

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

    addDeath(team : number){
        this.deaths[team] += 1
    }

    addKill(team : number){
        this.kills[team] += 1
    }

    addMetal(team : number,amount : number){
        this.metal[team] += amount
    }

    addEnergy(team : number,amount : number){
        this.energy[team] += amount
    }

    update(){
        for(const i in this.deaths){
            if(GameObjectManager.getBaseByTeam(parseInt(i)) === undefined) {
                console.log(i + " has lost")
                GameEndCallbacks()
            }
        }
    }

    getTeamInfo(team : number){
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

    recordKill(uuid : number){
        const killerShip = GameObjectList.find((x) => x.uuid == uuid)
        if (killerShip instanceof Ship)
            this.addKill(killerShip.team)
    }

}