import { Collider, Transform } from '../engine/physics';
import { Renderer } from '../engine/renderer';

export class GameObject {
    uuid: number;
    type: string;
    transform: Transform;
    collider: Collider;

    constructor(uuid: number, type: string, transform: Transform, collider: Collider) {
        this.uuid = uuid;
        this.type = type;
        this.transform = transform;
        this.collider = collider;
    }

    destroy() {
        this.type = 'DEAD';
    }

    simulate(deltaTime: number) {
        this.transform.simulate(deltaTime);
    }

    render(renderer: Renderer) {}

    collide(otherObject: GameObject) {}

    serialize() {}

    packet(): Array<any> {
        return [];
    }
}
