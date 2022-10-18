/**
 * Renderer object used in Node.js
 */
import { Vector2D } from './physics.js';

export class DummyRenderer {
    H: number;
    W: number;
    ctx: CanvasRenderingContext2D;

    constructor() {}

    queueAction() {
        // do nothing
    }

    newFrame() {
        // do nothing
    }

    drawText(text: string, position: Vector2D, size: number, color: string) {
        // do nothing
    }

    drawLine(start: Vector2D, end: Vector2D, color: string) {
        // do nothing
    }

    drawCircleTransparent(pos: Vector2D, radius: number, color: string, opacity: number) {
        // do nothing
    }

    drawCircle(pos: Vector2D, radius: number, color: string) {
        // do nothing
    }

    drawArc(pos: Vector2D, radius: number, start: number, end: number, color: string) {
        // do nothing
    }

    drawExhaust(position: Vector2D, rotation: number, scale: number) {
        // do nothing
    }
}
