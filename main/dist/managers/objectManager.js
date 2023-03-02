var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { overlapCircle } from '../engine/collisions';
import { GameObject } from '../objects/gameObject';
import { ASTEROID_METAL_RANGE, ASTEROID_RESPAWN_TIME, ASTEROID_WATER_RANGE, ENERGY_CELL_RANGE, ENERGY_CELL_RESPAWN_TIME, NUM_ASTEROIDS, NUM_ENERGY_CELLS, NUM_OBSTACLES, OBSTACLE_MASS_RANGE, OBSTACLE_RESPAWN_TIME, SPEED_RANGE } from '../config/gameConfig';
import { GameObjectList, H, sortGameObjectList, spawn, W, } from '../config/engineConfig';
import { Asteroid, Base, Bullet, EnergyCell, Obstacle, Ship } from '../objects/objects';
import { Vector2D } from '../engine/physics';
import { create_UUID, randomInRange } from '../engine/utils';
var ObjectManager = (function () {
    function ObjectManager() {
        this.asteroids = [];
        this.obstacles = [];
        this.energyCells = [];
        this.ships = [];
        this.bullets = [];
        this.bases = [];
        this.all = [];
        this.spawnQueue = { ASTEROID: [], OBSTACLE: [], ENERGY_CELL: [] };
    }
    ObjectManager.prototype.start = function () {
        for (var i = 0; i < ObjectManager.numAsteroids; i++) {
            this.spawnObject('ASTEROID');
        }
        for (var i = 0; i < ObjectManager.numObstacles; i++) {
            this.spawnObject('OBSTACLE');
        }
        for (var i = 0; i < ObjectManager.numEnergyCells; i++) {
            this.spawnObject('ENERGY_CELL');
        }
        this.indexObjects(GameObjectList);
    };
    ObjectManager.prototype.indexObjects = function (gameObjectList) {
        this.asteroids = [];
        this.obstacles = [];
        this.energyCells = [];
        this.ships = [];
        this.bullets = [];
        this.bases = [];
        this.all = [];
        for (var i = 0; i < gameObjectList.length; i++) {
            var gameObj = gameObjectList[i];
            if (gameObj != undefined && gameObj != null) {
                this.all.push(gameObj);
                switch (gameObj === null || gameObj === void 0 ? void 0 : gameObj.type) {
                    case 'ASTEROID':
                        if (gameObj instanceof Asteroid)
                            this.asteroids.push(gameObj);
                        break;
                    case 'OBSTACLE':
                        if (gameObj instanceof Obstacle)
                            this.obstacles.push(gameObj);
                        break;
                    case 'ENERGY_CELL':
                        if (gameObj instanceof EnergyCell)
                            this.energyCells.push(gameObj);
                        break;
                    case 'SHIP':
                        if (gameObj instanceof Ship)
                            this.ships.push(gameObj);
                        break;
                    case 'BULLET':
                        if (gameObj instanceof Bullet)
                            this.bullets.push(gameObj);
                        break;
                    case 'BASE':
                        if (gameObj instanceof Base)
                            this.bases.push(gameObj);
                        break;
                    default:
                        break;
                }
            }
        }
    };
    ObjectManager.prototype.update = function () {
        for (var _i = 0, _a = Object.entries(this.spawnQueue); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            for (var i = value.length - 1; i >= 0; i--) {
                var co = value[i];
                var temp = co.next();
                if (temp.done === true) {
                    value.splice(i, 1);
                }
            }
        }
        this.indexObjects(GameObjectList);
        if (this.spawnQueue['ASTEROID'].length + this.asteroids.length < ObjectManager.numAsteroids) {
            this.queueObject('ASTEROID', ASTEROID_RESPAWN_TIME);
        }
        if (this.spawnQueue['OBSTACLE'].length + this.obstacles.length < ObjectManager.numObstacles) {
            this.queueObject('OBSTACLE', OBSTACLE_RESPAWN_TIME);
        }
        if (this.spawnQueue['ENERGY_CELL'].length + this.energyCells.length < ObjectManager.numEnergyCells) {
            this.queueObject('ENERGY_CELL', ENERGY_CELL_RESPAWN_TIME);
        }
    };
    ObjectManager.prototype.spawnObject = function (type) {
        sortGameObjectList();
        var vel = Vector2D.random().multiply(randomInRange.apply(void 0, ObjectManager.speedRange));
        var obj = {};
        switch (type) {
            case 'ASTEROID':
                var metal = randomInRange.apply(void 0, ObjectManager.asteroidMetalRange);
                var water = randomInRange.apply(void 0, ObjectManager.asteroidWaterRange);
                obj = new Asteroid(create_UUID(), new Vector2D(0, 0), vel, metal, water);
                break;
            case 'OBSTACLE':
                var mass = randomInRange.apply(void 0, ObjectManager.obstacleMassRange);
                obj = new Obstacle(create_UUID(), new Vector2D(0, 0), vel, mass);
                break;
            case 'ENERGY_CELL':
                var energy = randomInRange.apply(void 0, ObjectManager.energyCellRange);
                obj = new EnergyCell(create_UUID(), new Vector2D(0, 0), vel, energy);
                break;
        }
        if (obj instanceof GameObject) {
            for (var i = 0; i < 32; i++) {
                var randomPos = new Vector2D(Math.random() * W, Math.random() * H);
                if (overlapCircle(randomPos, obj.collider.radius * 1.5).length < 1) {
                    obj.transform.position = randomPos;
                    spawn(obj);
                    return true;
                }
            }
        }
        this.queueObject(type, 180);
        return false;
    };
    ObjectManager.prototype.queueObject = function (type, numFrames) {
        function queueObjectCoroutine(self, type, numFrames) {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < numFrames)) return [3, 4];
                        return [4];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        self.spawnObject(type);
                        return [2];
                }
            });
        }
        this.spawnQueue[type].push(queueObjectCoroutine(this, type, numFrames));
    };
    ObjectManager.prototype.getAsteroids = function () {
        return this.asteroids;
    };
    ObjectManager.prototype.getClosestAsteroid = function (position) {
        var asteroids = this.getAsteroids();
        var closest = [{}, 100000];
        for (var i in asteroids) {
            var asteroid = asteroids[i];
            var d = asteroid.transform.position.subtract(position).magnitude;
            if (d < closest[1]) {
                closest = [asteroid, d];
            }
        }
        return closest[0];
    };
    ObjectManager.prototype.getObstacles = function () {
        return this.obstacles;
    };
    ObjectManager.prototype.getClosestObstacle = function (position) {
        var obstacles = this.getObstacles();
        var closest = [{}, 100000];
        for (var i in obstacles) {
            var obstacle = obstacles[i];
            var d = obstacle.transform.position.subtract(position).magnitude;
            if (d < closest[1]) {
                closest = [obstacle, d];
            }
        }
        return closest[0];
    };
    ObjectManager.prototype.getEnergyCells = function () {
        return this.energyCells;
    };
    ObjectManager.prototype.getClosestEnergyCell = function (position) {
        var energyCells = this.getEnergyCells();
        var closest = [{}, 100000];
        for (var i in energyCells) {
            var energyCell = energyCells[i];
            var d = energyCell.transform.position.subtract(position).magnitude;
            if (d < closest[1]) {
                closest = [energyCell, d];
            }
        }
        return closest[0];
    };
    ObjectManager.prototype.getShips = function () {
        return this.ships;
    };
    ObjectManager.prototype.getShipsByTeam = function (team) {
        return this.ships.filter(function (ship) { return ship.team === team; });
    };
    ObjectManager.prototype.getBullets = function () {
        return this.bullets;
    };
    ObjectManager.prototype.getBases = function () {
        return this.bases;
    };
    ObjectManager.prototype.getBaseByTeam = function (team) {
        try {
            return this.bases.filter(function (base) { return base.team === team; })[0];
        }
        catch (e) {
            console.log('Team ' + team + ' base has been destroyed!');
        }
    };
    ObjectManager.prototype.getObjectFromUUID = function (uuid) {
        try {
            return this.all.filter(function (obj) { return obj.uuid === uuid; })[0];
        }
        catch (e) {
            return null;
        }
    };
    ObjectManager.prototype.refreshObject = function (obj) {
        return this.getObjectFromUUID(obj.uuid);
    };
    ObjectManager.numAsteroids = NUM_ASTEROIDS;
    ObjectManager.numObstacles = NUM_OBSTACLES;
    ObjectManager.numEnergyCells = NUM_ENERGY_CELLS;
    ObjectManager.obstacleMassRange = OBSTACLE_MASS_RANGE;
    ObjectManager.asteroidMetalRange = ASTEROID_METAL_RANGE;
    ObjectManager.asteroidWaterRange = ASTEROID_WATER_RANGE;
    ObjectManager.energyCellRange = ENERGY_CELL_RANGE;
    ObjectManager.speedRange = SPEED_RANGE;
    return ObjectManager;
}());
export { ObjectManager };
//# sourceMappingURL=objectManager.js.map