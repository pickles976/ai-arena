import { DummyRenderer } from '../engine/dummyRenderer';
import { GameObject } from './gameObject';
import { ObjectManager } from '../managers/objectManager';
import { Base, Ship } from './objects';
import { Renderer } from '../engine/renderer';
export declare class ProxyMan {
    static createRendererProxy: (renderer: Renderer | DummyRenderer) => Renderer;
    static createGameObjectProxy: (gameObject: GameObject) => GameObject;
    static createShipProxy: (ship: Ship) => Ship;
    static createBaseProxy: (base: Base) => Base;
    static createObjectManagerProxy: (gameManager: ObjectManager) => ObjectManager;
}
