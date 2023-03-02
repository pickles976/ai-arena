export declare class StateManager {
    deaths: [number, number];
    kills: [number, number];
    metal: [number, number];
    energy: [number, number];
    constructor();
    addDeath(team: number): void;
    addKill(team: number): void;
    addMetal(team: number, amount: number): void;
    addEnergy(team: number, amount: number): void;
    update(): boolean;
    getTeamInfo(team: number): {
        kills: number;
        deaths: number;
        metal: string;
        energy: string;
    };
    serialize(): string;
    packet(): Float32Array;
    loadFromPacket(arr: Float32Array): void;
    recordKill(uuid: number): void;
}
