import { GameEndCallback, GameObjectList, GameObjectManager } from '../config/engineConfig';
import { Ship } from '../objects/objects';
var StateManager = (function () {
    function StateManager() {
        this.deaths = [0, 0];
        this.kills = [0, 0];
        this.metal = [0, 0];
        this.energy = [0, 0];
    }
    StateManager.prototype.addDeath = function (team) {
        this.deaths[team] += 1;
    };
    StateManager.prototype.addKill = function (team) {
        this.kills[team] += 1;
    };
    StateManager.prototype.addMetal = function (team, amount) {
        this.metal[team] += amount;
    };
    StateManager.prototype.addEnergy = function (team, amount) {
        this.energy[team] += amount;
    };
    StateManager.prototype.update = function () {
        for (var i in this.deaths) {
            var base = GameObjectManager.getBaseByTeam(parseInt(i));
            if (base === undefined ||
                base.type === 'DEAD') {
                console.log(1 - Number(i) + ' has won');
                GameEndCallback(1 - Number(i));
                return true;
            }
        }
        return false;
    };
    StateManager.prototype.getTeamInfo = function (team) {
        var teamInfo = {
            kills: this.kills[team],
            deaths: this.deaths[team],
            metal: this.metal[team].toFixed(0),
            energy: this.energy[team].toFixed(0),
        };
        return teamInfo;
    };
    StateManager.prototype.serialize = function () {
        var obj = { 'team 0': this.getTeamInfo(0), 'team 1': this.getTeamInfo(1) };
        return JSON.stringify(obj);
    };
    StateManager.prototype.packet = function () {
        var temp = [
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
    };
    StateManager.prototype.loadFromPacket = function (arr) {
        this.kills = [arr[0], arr[4]];
        this.deaths = [arr[1], arr[5]];
        this.metal = [arr[2], arr[6]];
        this.energy = [arr[3], arr[7]];
    };
    StateManager.prototype.recordKill = function (uuid) {
        var killerShip = GameObjectList.find(function (x) { return x.uuid == uuid; });
        if (killerShip instanceof Ship)
            this.addKill(killerShip.team);
    };
    return StateManager;
}());
export { StateManager };
//# sourceMappingURL=stateManager.js.map