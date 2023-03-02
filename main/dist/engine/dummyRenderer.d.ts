import { Vector2D } from './physics';
export declare class DummyRenderer {
    H: number;
    W: number;
    ctx: CanvasRenderingContext2D;
    constructor();
    queueAction(): void;
    newFrame(): void;
    drawText(text: string, position: Vector2D, size: number, color: string): void;
    drawLine(start: Vector2D, end: Vector2D, color: string): void;
    drawCircleTransparent(pos: Vector2D, radius: number, color: string, opacity: number): void;
    drawCircle(pos: Vector2D, radius: number, color: string): void;
    drawArc(pos: Vector2D, radius: number, start: number, end: number, color: string): void;
    drawExhaust(position: Vector2D, rotation: number, scale: number): void;
}
