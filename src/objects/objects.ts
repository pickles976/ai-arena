import { GameObject } from './gameObject';
import {
    GameObjectManager,
    GameObjectManagerProxy,
    GameStateManager,
    GlobalRenderProxy,
    spawn,
    teamColors,
    resourceColors,
    obstacleColor,
    bulletColor,
    UserCompiledCode,
    resetGameState,
    H,
    W,
    ErrorCallback,
    FRAMERATE,
} from '../config/engineConfig';
import {
    BASE_HEAL_RATE_COST_MULTIPLIER,
    BASE_INITIAL_HEAL_RATE,
    BASE_INITIAL_INTERACT_RADIUS,
    BASE_INITIAL_MAX_ENERGY,
    BASE_INITIAL_MAX_HEALTH,
    BASE_INITIAL_REFINING_EFFICIENCY,
    BASE_INITIAL_REFINING_RATE,
    BASE_INITIAL_REPAIR_RATE,
    BASE_INITIAL_SHIP_COST,
    BASE_INITIAL_UPGRADE_HEAL_RATE_COST,
    BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST,
    BASE_INITIAL_UPGRADE_MAX_ENERGY_COST,
    BASE_INITIAL_UPGRADE_MAX_HEALTH_COST,
    BASE_INITIAL_UPGRADE_REFINING_EFFICIENCY_COST,
    BASE_INITIAL_UPGRADE_REFINING_RATE_COST,
    BASE_INITIAL_UPGRADE_REPAIR_RATE_COST,
    BASE_INTERACT_RADIUS_COST_MULTIPLIER,
    BASE_MASS,
    BASE_MAX_ENERGY_COST_MULTIPLIER,
    BASE_MAX_HEALTH_COST_MULTIPLIER,
    BASE_REFINING_EFFICIENCY_COST_MULTIPLIER,
    BASE_REFINING_RATE_COST_MULTIPLIER,
    BASE_REPAIR_RATE_COST_MULTIPLIER,
    BULLET_MASS,
    BULLET_SPEED,
    ENERGY_SCALE,
    SHIP_DAMAGE_COST_MULTIPLIER,
    SHIP_INITIAL_DAMAGE,
    SHIP_INITIAL_MAX_ENERGY,
    SHIP_MASS,
    SHIP_MAX_ENERGY_COST_MULTIPLIER,
    SHIP_RESPAWN_TIME,
    SHIP_UPGRADE_DAMAGE_COST,
    SHIP_UPGRADE_MAX_ENERGY_COST,
} from '../config/gameConfig';
import { ProxyMan } from './objectProxies';
import { Collider, Transform, Vector2D } from '../engine/physics';
import { Renderer } from '../engine/renderer';
import { clamp, create_UUID, dist, energyDiff, validNumber, validVector } from '../engine/utils';
import { overlapCircle } from '../engine/collisions';

const sharedContext = {
    console: console,
    Math: Math,
    Vector2D: Vector2D,
    overlapCircle: overlapCircle,
    dist: dist,
    H: Math.floor(H), // H and W are already whole numbers, we do this to return a copy
    W: Math.floor(W),
    performance: performance,
};

export class Resources {
    type: string;
    metal: number;
    water: number;
    energy: number;

    /**
     * The sum of metal, water, and energy will determine the mass of an object
     * @param {Number} metal
     * @param {Number} water
     * @param {Number} energy
     */
    constructor(metal: number, water: number, energy: number) {
        this.type = 'RESOURCES';
        this.metal = metal;
        this.water = water;
        this.energy = energy;
    }

    getResources() {
        return {
            metal: parseFloat(this.metal?.toFixed(2) ?? '0'),
            water: parseFloat(this.water?.toFixed(2) ?? '0'),
            energy: parseFloat(this.energy?.toFixed(2) ?? '0'),
        };
    }

    toString() {
        return JSON.stringify(this.getResources());
    }

    serialize() {
        const temp = this.getResources();
        return JSON.stringify([this.type, temp['metal'], temp['water'], temp['energy']]);
    }

    packet() {
        return [this.metal, this.water, this.energy];
    }
}

export class Asteroid extends GameObject {
    resources: Resources;

    constructor(uuid: number, position: Vector2D, velocity: Vector2D, metal: number, water: number) {
        super(
            uuid,
            'ASTEROID',
            new Transform(metal + water, position, velocity),
            new Collider(Math.sqrt(metal + water)),
        );
        this.resources = new Resources(metal, water, 0);
    }

    simulate(deltaTime: number) {
        // this.transform.simulate(deltaTime)
        super.simulate(deltaTime);
    }

    render(renderer: Renderer) {
        let total = 1.0;
        const sum = this.resources.metal + this.resources.water + this.resources.energy;
        const ratio = [this.resources.metal / sum, this.resources.water / sum, this.resources.energy / sum];

        // draw the resources in the asteroid as colored rings
        for (let i = 0; i < 2; i++) {
            renderer.drawCircle(this.transform.position, total * this.collider.radius, resourceColors[i]);
            total -= ratio[i];
        }
    }

    getResources() {
        return this.resources.getResources();
    }

    destroy() {
        super.destroy();
    }

    serialize() {
        const temp = this.resources.getResources();
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            temp['metal'],
            temp['water'],
        ]);
    }

    packet() {
        const temp = this.resources.getResources();
        return [
            0,
            this.uuid,
            ...this.transform.position.packet(),
            ...this.transform.velocity.packet(),
            temp['metal'],
            temp['water'],
        ];
    }
}

export class Obstacle extends GameObject {
    constructor(uuid: number, position: Vector2D, velocity: Vector2D, mass: number) {
        super(uuid, 'OBSTACLE', new Transform(mass, position, velocity), new Collider(Math.sqrt(mass)));
    }

    simulate(deltaTime: number) {
        super.simulate(deltaTime);
    }

    render(renderer: Renderer) {
        // draw the obstacle
        renderer.drawCircle(this.transform.position, this.collider.radius, obstacleColor);
    }

    breakUp() {
        if (this.transform.mass > 60.0) {
            // break into multiple pieces
            const numPieces = Math.floor(2 + Math.random() * 3);

            for (let i = 0; i < numPieces; i++) {
                const massRatio = 0.1 + Math.random() * 0.15;
                const rotationOffset = (i * 360) / numPieces + (Math.random() - 0.5) * 45;
                const offset = new Vector2D(0, 1).multiply(this.collider.radius / 1.5).rotate(rotationOffset);
                const newChunk = new Obstacle(
                    create_UUID(),
                    this.transform.position.add(offset),
                    this.transform.velocity.rotate(-rotationOffset).add(this.transform.velocity),
                    this.transform.mass * massRatio,
                );
                spawn(newChunk);
            }
        }
    }

    destroy() {
        this.breakUp();
        super.destroy();
    }

    serialize() {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            parseFloat(this.transform?.mass?.toFixed(2) ?? '0'),
        ]);
    }

    packet() {
        return [
            1,
            this.uuid,
            ...this.transform.position.packet(),
            ...this.transform.velocity.packet(),
            this.transform.mass,
        ];
    }
}

export class EnergyCell extends GameObject {
    resources: Resources;

    constructor(uuid: number, position: Vector2D, velocity: Vector2D, energy: number) {
        super(uuid, 'ENERGY_CELL', new Transform(energy, position, velocity), new Collider(Math.sqrt(energy)));
        this.resources = new Resources(0, 0, energy);
    }

    simulate(deltaTime: number) {
        super.simulate(deltaTime);
    }

    render(renderer: Renderer) {
        // draw the resources in the asteroid as colored rings
        renderer.drawCircle(this.transform.position, this.collider.radius, resourceColors[2]);
    }

    getResources() {
        return this.resources.getResources();
    }

    destroy() {
        super.destroy();
    }

    serialize() {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.resources.getResources()['energy'],
        ]);
    }

    packet() {
        return [
            2,
            this.uuid,
            ...this.transform.position.packet(),
            ...this.transform.velocity.packet(),
            this.resources.getResources()['energy'],
        ];
    }
}

export class Ship extends GameObject {
    team: number;
    resources: Resources;
    maxEnergy: number;
    damage: number;
    upgradeMaxEnergyCost: number;
    upgradeDamageCost: number;

    constructor(
        uuid: number,
        position: Vector2D,
        velocity: Vector2D,
        acceleration: Vector2D,
        energy: number,
        team: number,
    ) {
        const temp = new Transform(SHIP_MASS, position, velocity);
        temp.acceleration = acceleration;
        super(uuid, 'SHIP', temp, new Collider(Math.sqrt(SHIP_MASS)));
        this.team = team;
        this.resources = new Resources(0, 0, energy);

        // upgradeable
        this.maxEnergy = SHIP_INITIAL_MAX_ENERGY;
        this.damage = SHIP_INITIAL_DAMAGE;

        // upgrade costs
        this.upgradeMaxEnergyCost = SHIP_UPGRADE_MAX_ENERGY_COST;
        this.upgradeDamageCost = SHIP_UPGRADE_DAMAGE_COST;

        // this.start()
    }

    simulate(deltaTime: number) {
        const oldVel = this.transform.velocity.magnitude ** 2;
        super.simulate(deltaTime);
        const dV = Math.abs(oldVel - this.transform.velocity.magnitude ** 2);
        this.resources.energy -= dV * this.totalMass() * 0.5 * ENERGY_SCALE;

        if (this.resources.energy < 0) {
            this.destroy();
        }

        if (this.resources.energy > this.maxEnergy) {
            this.resources.energy = this.maxEnergy;
        }
    }

    render(renderer: Renderer) {
        const acceleration = this.transform.acceleration;
        const position = this.transform.position;

        // draw the resources in the asteroid as colored rings
        renderer.drawCircle(position, this.collider.radius, teamColors[this.team]);

        // draw applyThrust effect
        if (acceleration.y != 0) {
            if (acceleration.y > 0) {
                renderer.drawExhaust(position, 180, acceleration.y);
            } else if (acceleration.y < 0) {
                renderer.drawExhaust(position, 0, -acceleration.y);
            }
        }

        if (acceleration.x != 0) {
            if (acceleration.x > 0) {
                renderer.drawExhaust(position, 90, acceleration.x);
            } else if (acceleration.x < 0) {
                renderer.drawExhaust(position, 270, -acceleration.x);
            }
        }
    }

    getResources() {
        return this.resources.getResources();
    }

    collide(otherObject: GameObject) {
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
                    // this.destroy()
                }
                break;
            case 'BASE':
                // drop off materials
                break;
            case 'OBSTACLE':
                // do nothing
                break;
            default:
                this.resources.energy -= energyDiff(this, otherObject);
        }
    }

    totalMass() {
        return this.transform.mass + this.resources.water + this.resources.metal;
    }

    breakUp() {
        const totalResources = this.resources.metal + this.resources.water;

        if (totalResources > 80.0) {
            // break into multiple pieces
            const numPieces = Math.floor(2 + Math.random() * 3);

            for (let i = 0; i < numPieces; i++) {
                const massRatio = 0.2 + Math.random() * 0.15;
                const rotationOffset = (i * 360) / numPieces + (Math.random() - 0.5) * 45;
                const offset = new Vector2D(0, 1).multiply(this.collider.radius).rotate(rotationOffset);
                const cargo = new Asteroid(
                    create_UUID(),
                    this.transform.position.add(offset),
                    this.transform.velocity.multiply(0.25).rotate(-rotationOffset).add(this.transform.velocity),
                    this.resources.metal * massRatio,
                    this.resources.water * massRatio,
                );
                spawn(cargo);
            }
        }
    }

    destroy() {
        GameStateManager.addDeath(this.team);
        GameObjectManager.getBaseByTeam(this.team)?.queueShip();

        this.breakUp();

        super.destroy();
    }

    toString() {
        return JSON.stringify({
            id: this.uuid,
            resources: this.resources.toString(),
            maxEnergy: this.maxEnergy,
            damage: this.damage,
        });
    }

    toData() {
        return JSON.parse(JSON.stringify(this));
    }

    serialize() {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.transform.acceleration.serialize(),
            this.resources.getResources()['energy'],
            this.team,
        ]);
    }

    packet() {
        return [
            3,
            this.uuid,
            ...this.transform.position.packet(),
            ...this.transform.velocity.packet(),
            ...this.transform.acceleration.packet(),
            this.resources.getResources()['energy'],
            this.team,
        ];
    }

    start() {
        const startCode = UserCompiledCode[this.team].ShipStartCode;

        try {
            startCode({
                ship: ProxyMan.createShipProxy(this),
                //@ts-ignore
                base: ProxyMan.createBaseProxy(GameObjectManager.getBaseByTeam(this.team)),
                ...sharedContext,
            });
        } catch (e) {
            ErrorCallback(e);
            console.log(`Failure in ship.start() \n Error: ${e} \n Your code failed to compile`);
            resetGameState();
        }
    }

    update() {
        const updateCode = UserCompiledCode[this.team].ShipUpdateCode;

        try {
            updateCode({
                ship: ProxyMan.createShipProxy(this),
                //@ts-ignore
                base: ProxyMan.createBaseProxy(GameObjectManager.getBaseByTeam(this.team)),
                Game: GameObjectManagerProxy,
                Graphics: GlobalRenderProxy,
                ...sharedContext,
            });
        } catch (e) {
            ErrorCallback(e);
            console.log(`Failure in ship.update() \n Error: ${e} \n Your code failed to compile`);
            resetGameState();
        }
    }

    applyThrust(vector: Vector2D, percentage: number) {
        if (this.transform.acceleration.magnitude <= 0.01) {
            const pct = clamp(percentage, 0, 1);
            this.transform.acceleration = vector.normal().multiply(pct);
        }
    }

    // USER-CALLABLE FUNCTIONS

    shoot(direction: Vector2D) {
        if (validVector(direction)) {
            // instantiate object
            this.resources.energy -= this.damage;
            const bullet = new Bullet(
                create_UUID(),
                this.transform.position.add(direction.normal().multiply(Bullet.offset + this.collider.radius)),
                direction.normal().multiply(BULLET_SPEED),
                this.damage,
                this.uuid,
            );
            spawn(bullet);
        } else {
            alert(`Invalid input in ship.shoot()! \n Direction: ${direction}`);
            resetGameState();
        }
    }

    upgradeMaxEnergy() {
        const base = GameObjectManager.getBaseByTeam(this.team);
        if (base !== undefined) {
            if (base.resources.metal > this.upgradeMaxEnergyCost) {
                base.resources.metal -= this.upgradeMaxEnergyCost;
                this.maxEnergy += SHIP_INITIAL_MAX_ENERGY;
                this.upgradeMaxEnergyCost *= SHIP_MAX_ENERGY_COST_MULTIPLIER;
            }
        }
    }

    upgradeDamage() {
        const base = GameObjectManager.getBaseByTeam(this.team);
        if (base !== undefined) {
            if (base.resources.metal > this.upgradeDamageCost) {
                base.resources.metal -= this.upgradeDamageCost;
                this.damage += SHIP_INITIAL_DAMAGE;
                this.upgradeDamageCost *= SHIP_DAMAGE_COST_MULTIPLIER;
            }
        }
    }

    // subtracting target's velocity gives us our intercept vector in the inertial reference frame of the target
    // multiplying by our desired speed gives us the top speed
    // subtracting our current velocity gives us dV
    seekTarget(target: GameObject, speed: number) {
        if (target !== null && target !== undefined && target instanceof GameObject) {
            const desiredSpeed = speed / FRAMERATE;
            const desiredVelocity = target.transform.position
                .subtract(this.transform.position)
                .normal()
                .multiply(desiredSpeed)
                .add(target.transform.velocity);
            const steering = desiredVelocity.subtract(this.transform.velocity);
            this.applyThrust(steering, 1.0);
        } else {
            alert(`Invalid input in ship.seekTarget()! \n Target: ${target} Speed: ${speed}`);
            resetGameState();
        }
    }

    moveTo(position: Vector2D, speed: number) {
        if (validVector(position) && validNumber(speed)) {
            const desiredSpeed = speed / FRAMERATE;
            const diffVector = position.subtract(this.transform.position);
            const desiredVelocity = diffVector.normal().multiply(desiredSpeed);
            const steering = desiredVelocity.subtract(this.transform.velocity);
            this.applyThrust(steering, 1.0);
        } else {
            alert(`Invalid input in ship.moveTo()! \n Position: ${position} Speed: ${speed}`);
            resetGameState();
        }
    }
}

export class Bullet extends GameObject {
    static offset = 5;
    damage: number;
    parent: number;

    constructor(uuid: number, position: Vector2D, velocity: Vector2D, damage: number, parent: number) {
        super(uuid, 'BULLET', new Transform(BULLET_MASS, position, velocity), new Collider(Math.sqrt(BULLET_MASS)));

        this.damage = damage;
        this.parent = parent;
    }

    simulate(deltaTime: number) {
        super.simulate(deltaTime);
    }

    render(renderer: Renderer) {
        // draw the resources in the asteroid as colored rings
        renderer.drawCircle(this.transform.position, this.collider.radius, bulletColor);
    }

    collide(otherObject: GameObject) {
        switch (otherObject.type) {
            case 'SHIP':
                if (otherObject instanceof Ship) {
                    otherObject.resources.energy -= this.damage; // velocity + explosive
                    if (otherObject.resources.energy < 0) {
                        GameStateManager.recordKill(this.parent);
                    }
                }
                break;
            case 'BASE':
                if (otherObject instanceof Base) {
                    otherObject.damage(this.damage); // velocity + explosive
                }
                break;
            default:
                otherObject.destroy();
        }
        this.destroy();
    }

    destroy() {
        this.type = 'DEAD';
    }

    serialize() {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.transform.velocity.serialize(),
            this.damage,
            this.parent,
        ]);
    }

    packet() {
        return [
            4,
            this.uuid,
            ...this.transform.position.packet(),
            ...this.transform.velocity.packet(),
            this.damage,
            this.parent,
        ];
    }
}

export class Base extends GameObject {
    resources: Resources;
    shipQueue: Array<Generator>;

    // user gettables
    team: number;

    shipCost: number;

    healRate: number;
    upgradeHealRateCost: number;

    interactRadius: number;
    upgradeInteractRadiusCost: number;

    maxEnergy: number;
    upgradeMaxEnergyCost: number;

    refiningRate: number;
    upgradeRefiningRateCost: number;

    refiningEfficiency: number;
    upgradeRefiningEfficiencyCost: number;

    health: number;
    maxHealth: number;
    upgradeMaxHealthCost: number;

    repairRate: number;
    upgradeRepairRateCost: number;

    constructor(uuid: number, position: Vector2D, energy: number, team: number) {
        super(uuid, 'BASE', new Transform(BASE_MASS, position, new Vector2D(0, 0)), new Collider(Math.sqrt(BASE_MASS)));

        this.team = team;
        this.resources = new Resources(0, 0, energy);

        this.shipQueue = [];

        // mutable
        this.maxEnergy = BASE_INITIAL_MAX_ENERGY;
        this.refiningRate = BASE_INITIAL_REFINING_RATE;
        this.refiningEfficiency = BASE_INITIAL_REFINING_EFFICIENCY;
        this.shipCost = BASE_INITIAL_SHIP_COST;
        this.healRate = BASE_INITIAL_HEAL_RATE;
        this.interactRadius = BASE_INITIAL_INTERACT_RADIUS;
        this.health = BASE_INITIAL_MAX_HEALTH;
        this.maxHealth = BASE_INITIAL_MAX_HEALTH;
        this.repairRate = BASE_INITIAL_REPAIR_RATE;

        // upgrade costs
        this.upgradeHealRateCost = BASE_INITIAL_UPGRADE_HEAL_RATE_COST;
        this.upgradeInteractRadiusCost = BASE_INITIAL_UPGRADE_INTERACT_RADIUS_COST;
        this.upgradeMaxEnergyCost = BASE_INITIAL_UPGRADE_MAX_ENERGY_COST;
        this.upgradeRefiningRateCost = BASE_INITIAL_UPGRADE_REFINING_RATE_COST;
        this.upgradeRefiningEfficiencyCost = BASE_INITIAL_UPGRADE_REFINING_EFFICIENCY_COST;
        this.upgradeRepairRateCost = BASE_INITIAL_UPGRADE_REPAIR_RATE_COST;
        this.upgradeMaxHealthCost = BASE_INITIAL_UPGRADE_MAX_HEALTH_COST;

        // this.start()
    }

    refineWater(deltaTime: number) {
        // refine water
        if (this.resources.water > 0 && this.resources.energy < this.maxEnergy) {
            const newEnergy = this.refiningRate * deltaTime;
            this.resources.water -= newEnergy;
            this.resources.energy += newEnergy;
            GameStateManager.addEnergy(this.team, newEnergy);
        }
    }

    repairSelf(deltaTime: number) {
        // refine water
        if (this.resources.metal > 0 && this.health < this.maxHealth) {
            const newHealth = this.repairRate * deltaTime;
            this.resources.metal -= newHealth;
            this.health += newHealth;
        }
    }

    simulate(deltaTime: number) {
        // stay static
        this.transform.velocity = new Vector2D(0, 0);

        this.refineWater(deltaTime);
        this.repairSelf(deltaTime);

        if (this.resources.water < 0) {
            this.resources.water = 0;
        }

        if (this.resources.energy > this.maxEnergy) {
            this.resources.energy = this.maxEnergy;
        } else if (this.resources.energy < 0) {
            this.resources.energy = 0;
        }

        if (this.resources.metal < 0) {
            this.resources.metal = 0;
        }

        // heal ships
        const teamShips = GameObjectManager.getShipsByTeam(this.team);
        for (const index in teamShips) {
            const ship = teamShips[index];
            if (dist(this, ship) < this.interactRadius) {
                this.healShip(deltaTime, ship);
                this.takeResources(ship);
            }
        }

        // loop through ship in ship queue
        for (const j in this.shipQueue) {
            const i = parseInt(j);
            const coroutine = this.shipQueue[i];
            const output = coroutine.next();
            if (output.done === true) {
                this.shipQueue.splice(i, 1);
                if (output.value === false) this.queueShip();
            }
        }

        // kill self
        if (this.health < 0) {
            this.destroy();
        }
    }

    damage(amount: number) {
        if (this.resources.energy > 0) {
            this.resources.energy -= amount;
        } else {
            this.health -= amount;
        }
    }

    collide(otherObject: GameObject) {
        const oomf = 15.0;
        const vec = otherObject.transform.position.subtract(this.transform.position).normal();
        otherObject.transform.velocity = otherObject.transform.velocity.add(vec.multiply(oomf));
    }

    render(renderer: Renderer) {
        renderer.drawCircle(this.transform.position, this.collider.radius, teamColors[this.team]);
        renderer.drawArc(
            this.transform.position,
            this.collider.radius,
            -0.001,
            (this.resources.energy / this.maxEnergy) * 2 * Math.PI,
            '#FFFF00',
        );
    }

    destroy() {
        this.type = 'DEAD';
    }

    healShip(deltaTime: number, ship: Ship) {
        if (this.resources.energy > 0 && ship.resources.energy < ship.maxEnergy) {
            const amount = this.healRate * deltaTime;
            this.resources.energy -= amount;
            ship.resources.energy += amount;
        }
    }

    takeResources(ship: Ship) {
        GameStateManager.addMetal(this.team, ship.resources.metal);
        this.resources.metal += ship.resources.metal * this.refiningEfficiency;
        this.resources.water += ship.resources.water * this.refiningEfficiency;
        ship.resources.metal = 0;
        ship.resources.water = 0;
    }

    trySpawnShip(energy: number, respawn: boolean) {
        let canSpawnShip = false;
        const newEnergy = Math.min(energy, SHIP_INITIAL_MAX_ENERGY);

        // check if we have the required resources
        if (!respawn) {
            if (this.resources.metal > this.shipCost && this.resources.energy > newEnergy) {
                canSpawnShip = true;
            }
        } else {
            if (this.resources.energy > newEnergy) {
                canSpawnShip = true;
            }
        }

        // check around the base
        const angle = 360 / 32;
        for (let i = 0; i < 32; i++) {
            let pos = new Vector2D(0, 1)
                .multiply(this.collider.radius * 1.5)
                .rotate(angle * i)
                .add(this.transform.position);
            const obj = new Ship(create_UUID(), pos, new Vector2D(0, 0), new Vector2D(0, 0), energy, this.team);
            if (overlapCircle(pos, obj.collider.radius * 1.2).length < 1) {
                // SPAWNING
                if (!respawn) this.resources.metal -= this.shipCost;

                this.resources.energy -= newEnergy;

                spawn(obj);
                return true;
            }
        }

        return false;
    }

    queueShip() {
        function* spawnShipCoroutine(self: Base, numFrames: number): any {
            for (let i = 0; i < numFrames; i++) {
                yield;
            }
            console.log('Ship respawning');
            return self.trySpawnShip(10, true);
        }

        this.shipQueue.push(spawnShipCoroutine(this, SHIP_RESPAWN_TIME));
    }

    serialize() {
        return JSON.stringify([
            this.type,
            this.uuid,
            this.transform.position.serialize(),
            this.resources.getResources()['energy'],
            this.team,
        ]);
    }

    packet() {
        return [5, this.uuid, ...this.transform.position.packet(), this.resources.getResources()['energy'], this.team];
    }

    toData() {
        return JSON.parse(JSON.stringify(this));
    }

    start() {
        const startCode = UserCompiledCode[this.team].BaseStartCode;

        try {
            startCode({ base: ProxyMan.createBaseProxy(this), ...sharedContext });
        } catch (e) {
            ErrorCallback(e);
            console.log(`Failure in base.start() \n Error: ${e} Your code failed to compile`);
            resetGameState();
        }
    }

    update() {
        const updateCode = UserCompiledCode[this.team].BaseUpdateCode;

        try {
            updateCode({
                base: ProxyMan.createBaseProxy(this),
                Game: GameObjectManagerProxy,
                Graphics: GlobalRenderProxy,
                ...sharedContext,
            });
        } catch (e) {
            ErrorCallback(e);
            alert(`Failure in base.update() \n Error: ${e} \n Your code failed to compile`);
            console.log(`Failure in base.update() \n Error: ${e} \n Your code failed to compile`);
            resetGameState();
        }
    }

    // USER CALLABLE FUNCTIONS

    upgradeMaxEnergy() {
        if (this.resources.metal > this.upgradeMaxEnergyCost) {
            this.maxEnergy += BASE_INITIAL_MAX_ENERGY;
            this.resources.metal -= this.upgradeMaxEnergyCost;
            this.upgradeMaxEnergyCost *= BASE_MAX_ENERGY_COST_MULTIPLIER;
        }
    }

    upgradeMaxHealth() {
        if (this.resources.metal > this.upgradeMaxHealthCost) {
            this.maxHealth += BASE_INITIAL_MAX_HEALTH;
            this.resources.metal -= this.upgradeMaxHealthCost;
            this.upgradeMaxHealthCost *= BASE_MAX_HEALTH_COST_MULTIPLIER;
        }
    }

    upgradeHealRate() {
        if (this.resources.metal > this.upgradeHealRateCost) {
            this.healRate += BASE_INITIAL_HEAL_RATE;
            this.resources.metal -= this.upgradeHealRateCost;
            this.upgradeHealRateCost *= BASE_HEAL_RATE_COST_MULTIPLIER;
        }
    }

    upgradeInteractRadius() {
        if (this.resources.metal > this.upgradeInteractRadiusCost) {
            this.interactRadius += BASE_INITIAL_INTERACT_RADIUS;
            this.resources.metal -= this.upgradeInteractRadiusCost;
            this.upgradeInteractRadiusCost *= BASE_INTERACT_RADIUS_COST_MULTIPLIER;
        }
    }

    upgradeRefiningRate() {
        if (this.resources.metal > this.upgradeRefiningRateCost) {
            this.refiningRate += BASE_INITIAL_REFINING_RATE;
            this.resources.metal -= this.upgradeRefiningRateCost;
            this.upgradeRefiningRateCost *= BASE_REFINING_RATE_COST_MULTIPLIER;
        }
    }

    upgradeRepairRate() {
        if (this.resources.metal > this.upgradeRepairRateCost) {
            this.repairRate += BASE_INITIAL_REPAIR_RATE;
            this.resources.metal -= this.upgradeRepairRateCost;
            this.upgradeRepairRateCost *= BASE_REPAIR_RATE_COST_MULTIPLIER;
        }
    }

    upgradeRefiningEfficiency() {
        if (this.resources.metal > this.upgradeRefiningEfficiencyCost) {
            this.refiningRate += BASE_INITIAL_REFINING_EFFICIENCY;
            this.resources.metal -= this.upgradeRefiningEfficiencyCost;
            this.upgradeRefiningEfficiencyCost *= BASE_REFINING_EFFICIENCY_COST_MULTIPLIER;
        }
    }

    spawnShip(energy: number) {
        if (validNumber(energy)) this.trySpawnShip(energy, false);
    }
}
