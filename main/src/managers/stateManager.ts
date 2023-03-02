import { GameEndCallback, GameObjectList, GameObjectManager } from '../config/engineConfig';
import { Ship } from '../objects/objects';

export class StateManager {
    deaths: [number, number];
    kills: [number, number];
    metal: [number, number];
    energy: [number, number];

    constructor() {
        // team deaths
        this.deaths = [0, 0];
        // team kills
        this.kills = [0, 0];
        // team metal collected
        this.metal = [0, 0];
        // team energy collected
        this.energy = [0, 0];
    }

    addDeath(team: number) {
        this.deaths[team] += 1;
    }

    addKill(team: number) {
        this.kills[team] += 1;
    }

    addMetal(team: number, amount: number) {
        this.metal[team] += amount;
    }

    addEnergy(team: number, amount: number) {
        this.energy[team] += amount;
    }

    update() {
        for (const i in this.deaths) {
            let base = GameObjectManager.getBaseByTeam(parseInt(i))
            if (
                base === undefined ||
                base.type === 'DEAD'
            ) {
                console.log(1 - Number(i) + ' has won');
                GameEndCallback(1 - Number(i));
                return true
            }
        }

        return false
    }

    getTeamInfo(team: number) {
        const teamInfo = {
            kills: this.kills[team],
            deaths: this.deaths[team],
            metal: this.metal[team].toFixed(0),
            energy: this.energy[team].toFixed(0),
        };

        return teamInfo;
    }

    serialize() {
        const obj = { 'team 0': this.getTeamInfo(0), 'team 1': this.getTeamInfo(1) };
        return JSON.stringify(obj);
    }

    packet() {
        const temp = [
            this.kills[0],
            this.deaths[0],
            this.metal[0],
            this.energy[0],
            this.kills[1],
            this.deaths[1],
            this.metal[1],
            this.energy[1],
        ];
        return Float32Array.from(temp);
    }

    loadFromPacket(arr: Float32Array) {
        this.kills = [arr[0], arr[4]];
        this.deaths = [arr[1], arr[5]];
        this.metal = [arr[2], arr[6]];
        this.energy = [arr[3], arr[7]];
    }

    recordKill(uuid: number) {
        const killerShip = GameObjectList.find((x) => x.uuid == uuid);
        if (killerShip instanceof Ship) this.addKill(killerShip.team);
    }
}
