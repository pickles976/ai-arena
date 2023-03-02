var TeamCode = (function () {
    function TeamCode(baseStart, baseUpdate, shipStart, shipUpdate) {
        this.baseStart = baseStart;
        this.baseUpdate = baseUpdate;
        this.shipStart = shipStart;
        this.shipUpdate = shipUpdate;
    }
    return TeamCode;
}());
export { TeamCode };
var Code = (function () {
    function Code(team0, team1) {
        this.team0 = team0;
        this.team1 = team1;
    }
    return Code;
}());
export { Code };
var GameConfig = (function () {
    function GameConfig() {
        this.team0_ships = null;
        this.team1_ships = null;
        this.damage_ratio = null;
        this.num_asteroids = null;
        this.num_obstacles = null;
        this.num_energy = null;
    }
    return GameConfig;
}());
export { GameConfig };
var EngineConfig = (function () {
    function EngineConfig() {
        this.canvas = null;
    }
    return EngineConfig;
}());
export { EngineConfig };
//# sourceMappingURL=types.js.map