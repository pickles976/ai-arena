export declare class TeamCode {
    baseStart: string;
    baseUpdate: string;
    shipStart: string;
    shipUpdate: string;
    constructor(baseStart: string, baseUpdate: string, shipStart: string, shipUpdate: string);
}
export declare class Code {
    team0: TeamCode | null;
    team1: TeamCode | null;
    constructor(team0: TeamCode | null, team1: TeamCode | null);
}
export declare class GameConfig {
    team0_ships: number | null;
    team1_ships: number | null;
    damage_ratio: number | null;
    num_asteroids: number | null;
    num_obstacles: number | null;
    num_energy: number | null;
    constructor();
}
export declare class EngineConfig {
    canvas: HTMLCanvasElement | null;
    graphics: boolean | null;
    framerate: number | null;
    ticksPerFrame: number | null;
    streaming: boolean | null;
    nodejs: boolean | null;
    userCodeTimeout: number | null;
    constructor();
}
