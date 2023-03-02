import { GameObject } from '../objects/gameObject';
import { Vector2D } from './physics';
export declare const checkForCollisions: (gameObjArray: Array<GameObject>) => void;
export declare const overlapCircle: (position: Vector2D, radius: number) => GameObject[];
