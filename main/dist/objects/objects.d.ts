import { GameObject } from './gameObject';
import { Vector2D } from '../engine/physics';
import { Renderer } from '../engine/renderer';
export declare class Resources {
    type: string;
    metal: number;
    water: number;
    energy: number;
    constructor(metal: number, water: number, energy: number);
    getResources(): {
        metal: number;
        water: number;
        energy: number;
    };
    toString(): string;
    serialize(): string;
    packet(): number[];
}
export declare class Asteroid extends GameObject {
    resources: Resources;
    constructor(uuid: number, position: Vector2D, velocity: Vector2D, metal: number, water: number);
    simulate(deltaTime: number): void;
    render(renderer: Renderer): void;
    getResources(): {
        metal: number;
        water: number;
        energy: number;
    };
    destroy(): void;
    serialize(): string;
    packet(): number[];
}
export declare class Obstacle extends GameObject {
    constructor(uuid: number, position: Vector2D, velocity: Vector2D, mass: number);
    simulate(deltaTime: number): void;
    render(renderer: Renderer): void;
    breakUp(): void;
    destroy(): void;
    serialize(): string;
    packet(): number[];
}
export declare class EnergyCell extends GameObject {
    resources: Resources;
    constructor(uuid: number, position: Vector2D, velocity: Vector2D, energy: number);
    simulate(deltaTime: number): void;
    render(renderer: Renderer): void;
    getResources(): {
        metal: number;
        water: number;
        energy: number;
    };
    destroy(): void;
    serialize(): string;
    packet(): number[];
}
export declare class Ship extends GameObject {
    team: number;
    resources: Resources;
    maxEnergy: number;
    damage: number;
    upgradeMaxEnergyCost: number;
    upgradeDamageCost: number;
    constructor(uuid: number, position: Vector2D, velocity: Vector2D, acceleration: Vector2D, energy: number, team: number);
    simulate(deltaTime: number): void;
    render(renderer: Renderer): void;
    getResources(): {
        metal: number;
        water: number;
        energy: number;
    };
    collide(otherObject: GameObject): void;
    totalMass(): number;
    breakUp(): void;
    destroy(): void;
    toString(): string;
    toData(): any;
    serialize(): string;
    packet(): number[];
    start(): void;
    update(): void;
    applyThrust(vector: Vector2D, percentage: number): void;
    shoot(direction: Vector2D): void;
    upgradeMaxEnergy(): void;
    upgradeDamage(): void;
    seekTarget(target: GameObject, speed: number): void;
    moveTo(position: Vector2D, speed: number): void;
}
export declare class Bullet extends GameObject {
    static offset: number;
    damage: number;
    parent: number;
    constructor(uuid: number, position: Vector2D, velocity: Vector2D, damage: number, parent: number);
    simulate(deltaTime: number): void;
    render(renderer: Renderer): void;
    collide(otherObject: GameObject): void;
    destroy(): void;
    serialize(): string;
    packet(): number[];
}
export declare class Base extends GameObject {
    resources: Resources;
    shipQueue: Array<Generator>;
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
    constructor(uuid: number, position: Vector2D, energy: number, team: number);
    refineWater(deltaTime: number): void;
    repairSelf(deltaTime: number): void;
    simulate(deltaTime: number): void;
    damage(amount: number): void;
    collide(otherObject: GameObject): void;
    render(renderer: Renderer): void;
    destroy(): void;
    healShip(deltaTime: number, ship: Ship): void;
    takeResources(ship: Ship): void;
    trySpawnShip(energy: number, respawn: boolean): boolean;
    queueShip(): void;
    serialize(): string;
    packet(): number[];
    toData(): any;
    start(): void;
    update(): void;
    upgradeMaxEnergy(): void;
    upgradeMaxHealth(): void;
    upgradeHealRate(): void;
    upgradeInteractRadius(): void;
    upgradeRefiningRate(): void;
    upgradeRepairRate(): void;
    upgradeRefiningEfficiency(): void;
    spawnShip(energy: number): void;
}
