import { Collider, Transform } from '../engine/physics';
import { Renderer } from '../engine/renderer';
export declare class GameObject {
    uuid: number;
    type: string;
    transform: Transform;
    collider: Collider;
    constructor(uuid: number, type: string, transform: Transform, collider: Collider);
    destroy(): void;
    simulate(deltaTime: number): void;
    render(renderer: Renderer): void;
    collide(otherObject: GameObject): void;
    serialize(): void;
    packet(): Array<any>;
}
