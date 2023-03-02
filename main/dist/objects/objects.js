var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { GameObject } from './gameObject';
import { GameObjectManager, GameObjectManagerProxy, GameStateManager, GlobalRenderProxy, spawn, teamColors, resourceColors, obstacleColor, bulletColor, UserCompiledCode, resetGameState, H, W, ErrorCallback, FRAMERATE, } from '../config/engineConfig';
import { BASE_HEAL_RATE_COST_MULTIPLIER, BASE_INITIAL_HEAL_RATE, BASE_INITIAL_INTERACT_RADIUS, BASE_INITIAL_MAX_ENERGY, BASE_INITIAL_MAX_HEALTH, BASE_INITIAL_REFINING_EFFICIENCY, BASE_INITIAL_REFINING_RATE, BASE_INITIAL_REPAIR_RATE, BASE_INITIAL_SHIP_COST, BASE_INITIAL_UPGRADE_HEAL_RATE_COST, BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST, BASE_INITIAL_UPGRADE_MAX_ENERGY_COST, BASE_INITIAL_UPGRADE_MAX_HEALTH_COST, BASE_INITIAL_UPGRADE_REFINING_EFFICIENCY_COST, BASE_INITIAL_UPGRADE_REFINING_RATE_COST, BASE_INITIAL_UPGRADE_REPAIR_RATE_COST, BASE_INTERACT_RADIUS_COST_MULTIPLIER, BASE_MASS, BASE_MAX_ENERGY_COST_MULTIPLIER, BASE_MAX_HEALTH_COST_MULTIPLIER, BASE_REFINING_EFFICIENCY_COST_MULTIPLIER, BASE_REFINING_RATE_COST_MULTIPLIER, BASE_REPAIR_RATE_COST_MULTIPLIER, BULLET_MASS, BULLET_SPEED, DAMAGE_ENERGY_RATIO, ENERGY_SCALE, SHIP_DAMAGE_COST_MULTIPLIER, SHIP_INITIAL_DAMAGE, SHIP_INITIAL_MAX_ENERGY, SHIP_MASS, SHIP_MAX_ENERGY_COST_MULTIPLIER, SHIP_RESPAWN_TIME, SHIP_UPGRADE_DAMAGE_COST, SHIP_UPGRADE_MAX_ENERGY_COST, } from '../config/gameConfig';
import { ProxyMan } from './objectProxies';
import { Collider, Transform, Vector2D } from '../engine/physics';
import { clamp, create_UUID, dist, energyDiff, validNumber, validVector } from '../engine/utils';
import { overlapCircle } from '../engine/collisions';
var sharedContext = {
    console: console,
    Math: Math,
    Vector2D: Vector2D,
    overlapCircle: overlapCircle,
    dist: dist,
    H: Math.floor(H),
    W: Math.floor(W),
    performance: performance,
};
var Resources = (function () {
    function Resources(metal, water, energy) {
        this.type = 'RESOURCES';
        this.metal = metal;
        this.water = water;
        this.energy = energy;
    }
    Resources.prototype.getResources = function () {
        var _a, _b, _c, _d, _e, _f;
        return {
            metal: parseFloat((_b = (_a = this.metal) === null || _a === void 0 ? void 0 : _a.toFixed(2)) !== null && _b !== void 0 ? _b : '0'),
            water: parseFloat((_d = (_c = this.water) === null || _c === void 0 ? void 0 : _c.toFixed(2)) !== null && _d !== void 0 ? _d : '0'),
            energy: parseFloat((_f = (_e = this.energy) === null || _e === void 0 ? void 0 : _e.toFixed(2)) !== null && _f !== void 0 ? _f : '0'),
        };
    };
    Resources.prototype.toString = function () {
        return JSON.stringify(this.getResources());
    };
    Resources.prototype.serialize = function () {
        var temp = this.getResources();
        return JSON.stringify([this.type, temp['metal'], temp['water'], temp['energy']]);
    };
    Resources.prototype.packet = function () {
        return [this.metal, this.water, this.energy];
    };
    return Resources;
}());
export { Resources };
var Asteroid = (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid(uuid, position, velocity, metal, water) {
        var _this = _super.call(this, uuid, 'ASTEROID', new Transform(metal + water, position, velocity), new Collider(Math.sqrt(metal + water))) || this;
        _this.resources = new Resources(metal, water, 0);
        return _this;
    }
    Asteroid.prototype.simulate = function (deltaTime) {
        _super.prototype.simulate.call(this, deltaTime);
    };
    Asteroid.prototype.render = function (renderer) {
        var total = 1.0;
        var sum = this.resources.metal + this.resources.water + this.resources.energy;
        var ratio = [this.resources.metal / sum, this.resources.water / sum, this.resources.energy / sum];
        for (var i = 0; i < 2; i++) {
            renderer.drawCircle(this.transform.position, total * this.collider.radius, resourceColors[i]);
            total -= ratio[i];
        }
    };
    Asteroid.prototype.getResources = function () {
        return this.resources.getResources();
    };
    Asteroid.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    Asteroid.prototype.serialize = function () {
        var temp = this.resources.getResources();
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            temp['metal'],
            temp['water'],
        ]);
    };
    Asteroid.prototype.packet = function () {
        var temp = this.resources.getResources();
        return __spreadArray(__spreadArray(__spreadArray([
            0,
            this.uuid
        ], this.transform.position.packet(), true), this.transform.velocity.packet(), true), [
            temp['metal'],
            temp['water'],
        ], false);
    };
    return Asteroid;
}(GameObject));
export { Asteroid };
var Obstacle = (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle(uuid, position, velocity, mass) {
        return _super.call(this, uuid, 'OBSTACLE', new Transform(mass, position, velocity), new Collider(Math.sqrt(mass))) || this;
    }
    Obstacle.prototype.simulate = function (deltaTime) {
        _super.prototype.simulate.call(this, deltaTime);
    };
    Obstacle.prototype.render = function (renderer) {
        renderer.drawCircle(this.transform.position, this.collider.radius, obstacleColor);
    };
    Obstacle.prototype.breakUp = function () {
        if (this.transform.mass > 60.0) {
            var numPieces = Math.floor(2 + Math.random() * 3);
            for (var i = 0; i < numPieces; i++) {
                var massRatio = 0.1 + Math.random() * 0.15;
                var rotationOffset = (i * 360) / numPieces + (Math.random() - 0.5) * 45;
                var offset = new Vector2D(0, 1).multiply(this.collider.radius / 1.5).rotate(rotationOffset);
                var newChunk = new Obstacle(create_UUID(), this.transform.position.add(offset), this.transform.velocity.rotate(-rotationOffset).add(this.transform.velocity), this.transform.mass * massRatio);
                spawn(newChunk);
            }
        }
    };
    Obstacle.prototype.destroy = function () {
        this.breakUp();
        _super.prototype.destroy.call(this);
    };
    Obstacle.prototype.serialize = function () {
        var _a, _b, _c;
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            parseFloat((_c = (_b = (_a = this.transform) === null || _a === void 0 ? void 0 : _a.mass) === null || _b === void 0 ? void 0 : _b.toFixed(2)) !== null && _c !== void 0 ? _c : '0'),
        ]);
    };
    Obstacle.prototype.packet = function () {
        return __spreadArray(__spreadArray(__spreadArray([
            1,
            this.uuid
        ], this.transform.position.packet(), true), this.transform.velocity.packet(), true), [
            this.transform.mass,
        ], false);
    };
    return Obstacle;
}(GameObject));
export { Obstacle };
var EnergyCell = (function (_super) {
    __extends(EnergyCell, _super);
    function EnergyCell(uuid, position, velocity, energy) {
        var _this = _super.call(this, uuid, 'ENERGY_CELL', new Transform(energy, position, velocity), new Collider(Math.sqrt(energy))) || this;
        _this.resources = new Resources(0, 0, energy);
        return _this;
    }
    EnergyCell.prototype.simulate = function (deltaTime) {
        _super.prototype.simulate.call(this, deltaTime);
    };
    EnergyCell.prototype.render = function (renderer) {
        renderer.drawCircle(this.transform.position, this.collider.radius, resourceColors[2]);
    };
    EnergyCell.prototype.getResources = function () {
        return this.resources.getResources();
    };
    EnergyCell.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    EnergyCell.prototype.serialize = function () {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.resources.getResources()['energy'],
        ]);
    };
    EnergyCell.prototype.packet = function () {
        return __spreadArray(__spreadArray(__spreadArray([
            2,
            this.uuid
        ], this.transform.position.packet(), true), this.transform.velocity.packet(), true), [
            this.resources.getResources()['energy'],
        ], false);
    };
    return EnergyCell;
}(GameObject));
export { EnergyCell };
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(uuid, position, velocity, acceleration, energy, team) {
        var _this = this;
        var temp = new Transform(SHIP_MASS, position, velocity);
        temp.acceleration = acceleration;
        _this = _super.call(this, uuid, 'SHIP', temp, new Collider(Math.sqrt(SHIP_MASS))) || this;
        _this.team = team;
        _this.resources = new Resources(0, 0, energy);
        _this.maxEnergy = SHIP_INITIAL_MAX_ENERGY;
        _this.damage = SHIP_INITIAL_DAMAGE;
        _this.upgradeMaxEnergyCost = SHIP_UPGRADE_MAX_ENERGY_COST;
        _this.upgradeDamageCost = SHIP_UPGRADE_DAMAGE_COST;
        return _this;
    }
    Ship.prototype.simulate = function (deltaTime) {
        var oldVel = Math.pow(this.transform.velocity.magnitude, 2);
        _super.prototype.simulate.call(this, deltaTime);
        var dV = Math.abs(oldVel - Math.pow(this.transform.velocity.magnitude, 2));
        this.resources.energy -= dV * this.totalMass() * 0.5 * ENERGY_SCALE;
        if (this.resources.energy < 0) {
            this.destroy();
        }
        if (this.resources.energy > this.maxEnergy) {
            this.resources.energy = this.maxEnergy;
        }
    };
    Ship.prototype.render = function (renderer) {
        var acceleration = this.transform.acceleration;
        var position = this.transform.position;
        renderer.drawCircle(position, this.collider.radius, teamColors[this.team]);
        if (acceleration.y != 0) {
            if (acceleration.y > 0) {
                renderer.drawExhaust(position, 180, acceleration.y);
            }
            else if (acceleration.y < 0) {
                renderer.drawExhaust(position, 0, -acceleration.y);
            }
        }
        if (acceleration.x != 0) {
            if (acceleration.x > 0) {
                renderer.drawExhaust(position, 90, acceleration.x);
            }
            else if (acceleration.x < 0) {
                renderer.drawExhaust(position, 270, -acceleration.x);
            }
        }
    };
    Ship.prototype.getResources = function () {
        return this.resources.getResources();
    };
    Ship.prototype.collide = function (otherObject) {
        switch (otherObject.type) {
            case 'ENERGY_CELL':
                if (otherObject instanceof EnergyCell) {
                    GameStateManager.addEnergy(this.team, otherObject.resources.energy);
                    this.resources.energy += otherObject.resources.energy;
                    if (this.resources.energy > this.maxEnergy) {
                        this.resources.energy = this.maxEnergy;
                    }
                    otherObject.destroy();
                }
                break;
            case 'ASTEROID':
                if (otherObject instanceof Asteroid) {
                    this.resources.metal += otherObject.resources.metal;
                    this.resources.water += otherObject.resources.water;
                    otherObject.destroy();
                }
                break;
            case 'BASE':
                break;
            case 'OBSTACLE':
                break;
            default:
                this.resources.energy -= energyDiff(this, otherObject);
        }
    };
    Ship.prototype.totalMass = function () {
        return this.transform.mass + this.resources.water + this.resources.metal;
    };
    Ship.prototype.breakUp = function () {
        var totalResources = this.resources.metal + this.resources.water;
        if (totalResources > 80.0) {
            var numPieces = Math.floor(2 + Math.random() * 3);
            for (var i = 0; i < numPieces; i++) {
                var massRatio = 0.2 + Math.random() * 0.15;
                var rotationOffset = (i * 360) / numPieces + (Math.random() - 0.5) * 45;
                var offset = new Vector2D(0, 1).multiply(this.collider.radius).rotate(rotationOffset);
                var cargo = new Asteroid(create_UUID(), this.transform.position.add(offset), this.transform.velocity.multiply(0.25).rotate(-rotationOffset).add(this.transform.velocity), this.resources.metal * massRatio, this.resources.water * massRatio);
                spawn(cargo);
            }
        }
    };
    Ship.prototype.destroy = function () {
        var _a;
        GameStateManager.addDeath(this.team);
        (_a = GameObjectManager.getBaseByTeam(this.team)) === null || _a === void 0 ? void 0 : _a.queueShip();
        this.breakUp();
        _super.prototype.destroy.call(this);
    };
    Ship.prototype.toString = function () {
        return JSON.stringify({
            id: this.uuid,
            resources: this.resources.toString(),
            maxEnergy: this.maxEnergy,
            damage: this.damage,
        });
    };
    Ship.prototype.toData = function () {
        return JSON.parse(JSON.stringify(this));
    };
    Ship.prototype.serialize = function () {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.transform.acceleration.serialize(),
            this.resources.getResources()['energy'],
            this.team,
        ]);
    };
    Ship.prototype.packet = function () {
        return __spreadArray(__spreadArray(__spreadArray(__spreadArray([
            3,
            this.uuid
        ], this.transform.position.packet(), true), this.transform.velocity.packet(), true), this.transform.acceleration.packet(), true), [
            this.resources.getResources()['energy'],
            this.team,
        ], false);
    };
    Ship.prototype.start = function () {
        var startCode = UserCompiledCode[this.team].ShipStartCode;
        try {
            startCode(__assign({ ship: ProxyMan.createShipProxy(this), base: ProxyMan.createBaseProxy(GameObjectManager.getBaseByTeam(this.team)) }, sharedContext));
        }
        catch (e) {
            ErrorCallback(e);
            console.log("Failure in ship.start() \n Error: ".concat(e, " \n Your code failed to compile"));
            resetGameState();
        }
    };
    Ship.prototype.update = function () {
        var updateCode = UserCompiledCode[this.team].ShipUpdateCode;
        try {
            updateCode(__assign({ ship: ProxyMan.createShipProxy(this), base: ProxyMan.createBaseProxy(GameObjectManager.getBaseByTeam(this.team)), Game: GameObjectManagerProxy, Graphics: GlobalRenderProxy }, sharedContext));
        }
        catch (e) {
            ErrorCallback(e);
            console.log("Failure in ship.update() \n Error: ".concat(e, " \n Your code failed to compile"));
            resetGameState();
        }
    };
    Ship.prototype.applyThrust = function (vector, percentage) {
        if (this.transform.acceleration.magnitude <= 0.01) {
            var pct = clamp(percentage, 0, 1);
            this.transform.acceleration = vector.normal().multiply(pct);
        }
    };
    Ship.prototype.shoot = function (direction) {
        if (validVector(direction)) {
            this.resources.energy -= this.damage * DAMAGE_ENERGY_RATIO;
            var bullet = new Bullet(create_UUID(), this.transform.position.add(direction.normal().multiply(Bullet.offset + this.collider.radius)), direction.normal().multiply(BULLET_SPEED), this.damage, this.uuid);
            spawn(bullet);
        }
        else {
            alert("Invalid input in ship.shoot()! \n Direction: ".concat(direction));
            resetGameState();
        }
    };
    Ship.prototype.upgradeMaxEnergy = function () {
        var base = GameObjectManager.getBaseByTeam(this.team);
        if (base !== undefined) {
            if (base.resources.metal > this.upgradeMaxEnergyCost) {
                base.resources.metal -= this.upgradeMaxEnergyCost;
                this.maxEnergy += SHIP_INITIAL_MAX_ENERGY;
                this.upgradeMaxEnergyCost *= SHIP_MAX_ENERGY_COST_MULTIPLIER;
            }
        }
    };
    Ship.prototype.upgradeDamage = function () {
        var base = GameObjectManager.getBaseByTeam(this.team);
        if (base !== undefined) {
            if (base.resources.metal > this.upgradeDamageCost) {
                base.resources.metal -= this.upgradeDamageCost;
                this.damage += SHIP_INITIAL_DAMAGE;
                this.upgradeDamageCost *= SHIP_DAMAGE_COST_MULTIPLIER;
            }
        }
    };
    Ship.prototype.seekTarget = function (target, speed) {
        if (target !== null && target !== undefined && target instanceof GameObject) {
            var desiredSpeed = speed / FRAMERATE;
            var desiredVelocity = target.transform.position
                .subtract(this.transform.position)
                .normal()
                .multiply(desiredSpeed)
                .add(target.transform.velocity);
            var steering = desiredVelocity.subtract(this.transform.velocity);
            this.applyThrust(steering, 1.0);
        }
        else {
            alert("Invalid input in ship.seekTarget()! \n Target: ".concat(target, " Speed: ").concat(speed));
            resetGameState();
        }
    };
    Ship.prototype.moveTo = function (position, speed) {
        if (validVector(position) && validNumber(speed)) {
            var desiredSpeed = speed / FRAMERATE;
            var diffVector = position.subtract(this.transform.position);
            var desiredVelocity = diffVector.normal().multiply(desiredSpeed);
            var steering = desiredVelocity.subtract(this.transform.velocity);
            this.applyThrust(steering, 1.0);
        }
        else {
            alert("Invalid input in ship.moveTo()! \n Position: ".concat(position, " Speed: ").concat(speed));
            resetGameState();
        }
    };
    return Ship;
}(GameObject));
export { Ship };
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(uuid, position, velocity, damage, parent) {
        var _this = _super.call(this, uuid, 'BULLET', new Transform(BULLET_MASS, position, velocity), new Collider(Math.sqrt(BULLET_MASS))) || this;
        _this.damage = damage;
        _this.parent = parent;
        return _this;
    }
    Bullet.prototype.simulate = function (deltaTime) {
        _super.prototype.simulate.call(this, deltaTime);
    };
    Bullet.prototype.render = function (renderer) {
        renderer.drawCircle(this.transform.position, this.collider.radius, bulletColor);
    };
    Bullet.prototype.collide = function (otherObject) {
        switch (otherObject.type) {
            case 'SHIP':
                if (otherObject instanceof Ship) {
                    otherObject.resources.energy -= this.damage;
                    if (otherObject.resources.energy < 0) {
                        GameStateManager.recordKill(this.parent);
                    }
                }
                break;
            case 'BASE':
                if (otherObject instanceof Base) {
                    otherObject.damage(this.damage);
                }
                break;
            default:
                otherObject.destroy();
        }
        this.destroy();
    };
    Bullet.prototype.destroy = function () {
        this.type = 'DEAD';
    };
    Bullet.prototype.serialize = function () {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.damage,
            this.parent,
        ]);
    };
    Bullet.prototype.packet = function () {
        return __spreadArray(__spreadArray(__spreadArray([
            4,
            this.uuid
        ], this.transform.position.packet(), true), this.transform.velocity.packet(), true), [
            this.damage,
            this.parent,
        ], false);
    };
    Bullet.offset = 5;
    return Bullet;
}(GameObject));
export { Bullet };
var Base = (function (_super) {
    __extends(Base, _super);
    function Base(uuid, position, energy, team) {
        var _this = _super.call(this, uuid, 'BASE', new Transform(BASE_MASS, position, new Vector2D(0, 0)), new Collider(Math.sqrt(BASE_MASS))) || this;
        _this.team = team;
        _this.resources = new Resources(0, 0, energy);
        _this.shipQueue = [];
        _this.maxEnergy = BASE_INITIAL_MAX_ENERGY;
        _this.refiningRate = BASE_INITIAL_REFINING_RATE;
        _this.refiningEfficiency = BASE_INITIAL_REFINING_EFFICIENCY;
        _this.shipCost = BASE_INITIAL_SHIP_COST;
        _this.healRate = BASE_INITIAL_HEAL_RATE;
        _this.interactRadius = BASE_INITIAL_INTERACT_RADIUS;
        _this.health = BASE_INITIAL_MAX_HEALTH;
        _this.maxHealth = BASE_INITIAL_MAX_HEALTH;
        _this.repairRate = BASE_INITIAL_REPAIR_RATE;
        _this.upgradeHealRateCost = BASE_INITIAL_UPGRADE_HEAL_RATE_COST;
        _this.upgradeInteractRadiusCost = BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST;
        _this.upgradeMaxEnergyCost = BASE_INITIAL_UPGRADE_MAX_ENERGY_COST;
        _this.upgradeRefiningRateCost = BASE_INITIAL_UPGRADE_REFINING_RATE_COST;
        _this.upgradeRefiningEfficiencyCost = BASE_INITIAL_UPGRADE_REFINING_EFFICIENCY_COST;
        _this.upgradeRepairRateCost = BASE_INITIAL_UPGRADE_REPAIR_RATE_COST;
        _this.upgradeMaxHealthCost = BASE_INITIAL_UPGRADE_MAX_HEALTH_COST;
        return _this;
    }
    Base.prototype.refineWater = function (deltaTime) {
        if (this.resources.water > 0 && this.resources.energy < this.maxEnergy) {
            var newEnergy = this.refiningRate * deltaTime;
            this.resources.water -= newEnergy;
            this.resources.energy += newEnergy;
            GameStateManager.addEnergy(this.team, newEnergy);
        }
    };
    Base.prototype.repairSelf = function (deltaTime) {
        if (this.resources.metal > 0 && this.health < this.maxHealth) {
            var newHealth = this.repairRate * deltaTime;
            this.resources.metal -= newHealth;
            this.health += newHealth;
        }
    };
    Base.prototype.simulate = function (deltaTime) {
        this.transform.velocity = new Vector2D(0, 0);
        this.refineWater(deltaTime);
        this.repairSelf(deltaTime);
        if (this.resources.water < 0) {
            this.resources.water = 0;
        }
        if (this.resources.energy > this.maxEnergy) {
            this.resources.energy = this.maxEnergy;
        }
        else if (this.resources.energy < 0) {
            this.resources.energy = 0;
        }
        if (this.resources.metal < 0) {
            this.resources.metal = 0;
        }
        var teamShips = GameObjectManager.getShipsByTeam(this.team);
        for (var index in teamShips) {
            var ship = teamShips[index];
            if (dist(this, ship) < this.interactRadius) {
                this.healShip(deltaTime, ship);
                this.takeResources(ship);
            }
        }
        for (var j in this.shipQueue) {
            var i = parseInt(j);
            var coroutine = this.shipQueue[i];
            var output = coroutine.next();
            if (output.done === true) {
                this.shipQueue.splice(i, 1);
                if (output.value === false)
                    this.queueShip();
            }
        }
        if (this.health < 0) {
            this.destroy();
        }
    };
    Base.prototype.damage = function (amount) {
        if (this.resources.energy > 0) {
            this.resources.energy -= amount;
        }
        else {
            this.health -= amount;
        }
    };
    Base.prototype.collide = function (otherObject) {
        var oomf = 15.0;
        var vec = otherObject.transform.position.subtract(this.transform.position).normal();
        otherObject.transform.velocity = otherObject.transform.velocity.add(vec.multiply(oomf));
    };
    Base.prototype.render = function (renderer) {
        renderer.drawCircle(this.transform.position, this.collider.radius, teamColors[this.team]);
        renderer.drawArc(this.transform.position, this.collider.radius, -0.001, (this.resources.energy / this.maxEnergy) * 2 * Math.PI, '#FFFF00');
    };
    Base.prototype.destroy = function () {
        this.type = 'DEAD';
    };
    Base.prototype.healShip = function (deltaTime, ship) {
        if (this.resources.energy > 0 && ship.resources.energy < ship.maxEnergy) {
            var amount = this.healRate * deltaTime;
            this.resources.energy -= amount;
            ship.resources.energy += amount;
        }
    };
    Base.prototype.takeResources = function (ship) {
        GameStateManager.addMetal(this.team, ship.resources.metal);
        this.resources.metal += ship.resources.metal * this.refiningEfficiency;
        this.resources.water += ship.resources.water * this.refiningEfficiency;
        ship.resources.metal = 0;
        ship.resources.water = 0;
    };
    Base.prototype.trySpawnShip = function (energy, respawn) {
        var canSpawnShip = false;
        var newEnergy = Math.min(energy, SHIP_INITIAL_MAX_ENERGY);
        if (!respawn) {
            if (this.resources.metal > this.shipCost && this.resources.energy > newEnergy) {
                canSpawnShip = true;
            }
        }
        else {
            if (this.resources.energy > newEnergy) {
                canSpawnShip = true;
            }
        }
        var angle = 360 / 32;
        for (var i = 0; i < 32; i++) {
            var pos = new Vector2D(0, 1)
                .multiply(this.collider.radius * 1.5)
                .rotate(angle * i)
                .add(this.transform.position);
            var obj = new Ship(create_UUID(), pos, new Vector2D(0, 0), new Vector2D(0, 0), energy, this.team);
            if (overlapCircle(pos, obj.collider.radius * 1.2).length < 1) {
                if (!respawn)
                    this.resources.metal -= this.shipCost;
                this.resources.energy -= newEnergy;
                spawn(obj);
                return true;
            }
        }
        return false;
    };
    Base.prototype.queueShip = function () {
        function spawnShipCoroutine(self, numFrames) {
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
                        console.log('Ship respawning');
                        return [2, self.trySpawnShip(10, true)];
                }
            });
        }
        this.shipQueue.push(spawnShipCoroutine(this, SHIP_RESPAWN_TIME));
    };
    Base.prototype.serialize = function () {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.resources.getResources()['energy'],
            this.team,
        ]);
    };
    Base.prototype.packet = function () {
        return __spreadArray(__spreadArray([5, this.uuid], this.transform.position.packet(), true), [this.resources.getResources()['energy'], this.team], false);
    };
    Base.prototype.toData = function () {
        return JSON.parse(JSON.stringify(this));
    };
    Base.prototype.start = function () {
        var startCode = UserCompiledCode[this.team].BaseStartCode;
        try {
            startCode(__assign({ base: ProxyMan.createBaseProxy(this) }, sharedContext));
        }
        catch (e) {
            ErrorCallback(e);
            console.log("Failure in base.start() \n Error: ".concat(e, " Your code failed to compile"));
            resetGameState();
        }
    };
    Base.prototype.update = function () {
        var updateCode = UserCompiledCode[this.team].BaseUpdateCode;
        try {
            updateCode(__assign({ base: ProxyMan.createBaseProxy(this), Game: GameObjectManagerProxy, Graphics: GlobalRenderProxy }, sharedContext));
        }
        catch (e) {
            ErrorCallback(e);
            alert("Failure in base.update() \n Error: ".concat(e, " \n Your code failed to compile"));
            console.log("Failure in base.update() \n Error: ".concat(e, " \n Your code failed to compile"));
            resetGameState();
        }
    };
    Base.prototype.upgradeMaxEnergy = function () {
        if (this.resources.metal > this.upgradeMaxEnergyCost) {
            this.maxEnergy += BASE_INITIAL_MAX_ENERGY;
            this.resources.metal -= this.upgradeMaxEnergyCost;
            this.upgradeMaxEnergyCost *= BASE_MAX_ENERGY_COST_MULTIPLIER;
        }
    };
    Base.prototype.upgradeMaxHealth = function () {
        if (this.resources.metal > this.upgradeMaxHealthCost) {
            this.maxHealth += BASE_INITIAL_MAX_HEALTH;
            this.resources.metal -= this.upgradeMaxHealthCost;
            this.upgradeMaxHealthCost *= BASE_MAX_HEALTH_COST_MULTIPLIER;
        }
    };
    Base.prototype.upgradeHealRate = function () {
        if (this.resources.metal > this.upgradeHealRateCost) {
            this.healRate += BASE_INITIAL_HEAL_RATE;
            this.resources.metal -= this.upgradeHealRateCost;
            this.upgradeHealRateCost *= BASE_HEAL_RATE_COST_MULTIPLIER;
        }
    };
    Base.prototype.upgradeInteractRadius = function () {
        if (this.resources.metal > this.upgradeInteractRadiusCost) {
            this.interactRadius += BASE_INITIAL_INTERACT_RADIUS;
            this.resources.metal -= this.upgradeInteractRadiusCost;
            this.upgradeInteractRadiusCost *= BASE_INTERACT_RADIUS_COST_MULTIPLIER;
        }
    };
    Base.prototype.upgradeRefiningRate = function () {
        if (this.resources.metal > this.upgradeRefiningRateCost) {
            this.refiningRate += BASE_INITIAL_REFINING_RATE;
            this.resources.metal -= this.upgradeRefiningRateCost;
            this.upgradeRefiningRateCost *= BASE_REFINING_RATE_COST_MULTIPLIER;
        }
    };
    Base.prototype.upgradeRepairRate = function () {
        if (this.resources.metal > this.upgradeRepairRateCost) {
            this.repairRate += BASE_INITIAL_REPAIR_RATE;
            this.resources.metal -= this.upgradeRepairRateCost;
            this.upgradeRepairRateCost *= BASE_REPAIR_RATE_COST_MULTIPLIER;
        }
    };
    Base.prototype.upgradeRefiningEfficiency = function () {
        if (this.resources.metal > this.upgradeRefiningEfficiencyCost) {
            this.refiningRate += BASE_INITIAL_REFINING_EFFICIENCY;
            this.resources.metal -= this.upgradeRefiningEfficiencyCost;
            this.upgradeRefiningEfficiencyCost *= BASE_REFINING_EFFICIENCY_COST_MULTIPLIER;
        }
    };
    Base.prototype.spawnShip = function (energy) {
        if (validNumber(energy))
            this.trySpawnShip(energy, false);
    };
    return Base;
}(GameObject));
export { Base };
//# sourceMappingURL=objects.js.map