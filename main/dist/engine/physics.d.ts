export declare class Vector2D {
    type: string;
    x: number;
    y: number;
    magnitude: number;
    constructor(x: number, y: number);
    add(newVector: Vector2D): Vector2D;
    subtract(newVector: Vector2D): Vector2D;
    multiply(scalar: number): Vector2D;
    divide(scalar: number): Vector2D;
    dot(newVector: Vector2D): number;
    normal(): Vector2D;
    copy(): Vector2D;
    rotate(degrees: number): Vector2D;
    static random(): Vector2D;
    static dist(v1: Vector2D, v2: Vector2D): number;
    serialize(): string;
    packet(): number[];
}
export declare class Transform {
    type: string;
    mass: number;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    constructor(mass: number, position: Vector2D, velocity: Vector2D);
    simulate(deltaTime: number): void;
    serialize(): string;
    packet(): number[];
}
export declare class Collider {
    type: string;
    radius: number;
    constructor(radius: number);
    serialize(): string;
}
