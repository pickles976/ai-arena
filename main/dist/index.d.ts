import { Code } from './types';
export declare var testPackage: () => string;
export declare var getScore: () => any;
export declare var getShipsInfo: () => {
    team0: import("./objects/objects").Ship[];
    team1: import("./objects/objects").Ship[];
};
export declare var getBasesInfo: () => {
    team0: any;
    team1: any;
};
export declare var getGameState: () => any;
export declare var togglePause: () => void;
export declare var stepFrame: () => void;
export declare var runGame: () => void;
export declare var stopGame: () => void;
export declare var restart: () => void;
export declare var setCallbacks: (callbacks: any) => void;
export declare function setUserCode(code: Code): void;
import { setEngineConfig } from './config/engineConfig.js';
export { setEngineConfig };
