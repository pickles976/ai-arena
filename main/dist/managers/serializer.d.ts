import { GameObject } from "../objects/gameObject";
import { Asteroid, Base, Bullet, EnergyCell, Obstacle, Resources, Ship } from "../objects/objects";
import { Collider, Transform, Vector2D } from "../engine/physics";
export declare class Serializer {
    static packetifyGameObjectList(gol: Array<GameObject>): Float32Array;
    static serializeGameObjectList(gol: Array<GameObject>): string;
    static deserializeGameObjectList(str: string): any;
    static deserialize(str: string): any[] | Vector2D | Transform | Collider | Resources | Asteroid | Obstacle | EnergyCell | Ship | Bullet | Base;
    static listToObj(list: Array<any>): any[] | Vector2D | Transform | Collider | Resources | Asteroid | Obstacle | EnergyCell | Ship | Bullet | Base;
    static unpacketify(arr: Float32Array): (Asteroid | Obstacle | EnergyCell | Ship | Bullet | Base)[];
    static test(): void;
}
