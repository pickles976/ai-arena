/**
 * IMMUTABLE (GAME CONFIG/BALANCE)
 */

import {
    BaseStartTeam0,
    BaseStartTeam1,
    BaseUpdateTeam0,
    BaseUpdateTeam1,
    ShipStartTeam0,
    ShipStartTeam1,
    ShipUpdateTeam0,
    ShipUpdateTeam1,
} from './util/aiControls';
import { GameObject } from './objects/gameObject';
import { ObjectManager } from './managers/objectManager';
import { ProxyMan } from './objects/objectProxies';
import { Renderer } from './engine/renderer';
import { compileCode } from './util/safeEval';
import { StateManager } from './managers/stateManager';
import { EngineConfig } from './types';

export var W: number = 1080;
export var H: number = 720;
export var FRAMERATE: number = 30.0;
export var MS: number = 1000.0 / FRAMERATE;
export var TICKS_PER_FRAME: number = 1;

// 50,000 for 60 FPS
export var VELOCITY_FACTOR = FRAMERATE * 1000;

// 0.01, 0.05 for 60 FPS
export var SPEED_RANGE: [number, number] = [0.0002 * FRAMERATE, 0.001 * FRAMERATE];

/**
 * MUTABLE
 */
export var NODEJS = false;
export var GRAPHICS_ENABLED = true;
export var GAME_STARTED = false;
export var PAUSED: boolean = false;
export var STREAMING: boolean = false; // if we are showing a game running on the server
export var USER_CODE_TIMEOUT: number = 1.0; // how many ms user code will timeout in
export var USER_CODE_MAX_SIZE: number = 8.0; //kb

export var GlobalRender: Renderer;
export var GlobalRenderProxy: Renderer;
export var RenderQueue: { [key: number]: Array<Generator> } = {};
export var GameObjectManager: ObjectManager;
export var GameObjectManagerProxy: ObjectManager;
export var GameStateManager: StateManager;
export var GameObjectList: Array<GameObject> = [];

// COLORS
export var teamColors: Array<string> = ['#FF0000', '#0000FF'];
export var resourceColors: Array<string> = ['#666666', '#ADD8E6', '#00FF00'];
export var obstacleColor: string = '#A52A2A';
export var bulletColor: string = '#FFFF00';
export var backgroundColor: string = '#000000';

// Ordered x positions of GameObjectList, cached for circleOverlap
export var xArray: Array<number> = [];

interface CodeStorage {
    BaseStartCode: string;
    BaseUpdateCode: string;
    ShipStartCode: string;
    ShipUpdateCode: string;
}

interface CompiledCodeStorage {
    BaseStartCode: Function;
    BaseUpdateCode: Function;
    ShipStartCode: Function;
    ShipUpdateCode: Function;
}

export var UserCode: CodeStorage[] = [
    {
        BaseStartCode: BaseStartTeam0,
        BaseUpdateCode: BaseUpdateTeam0,
        ShipStartCode: ShipStartTeam0,
        ShipUpdateCode: ShipUpdateTeam0,
    },
    {
        BaseStartCode: BaseStartTeam1,
        BaseUpdateCode: BaseUpdateTeam1,
        ShipStartCode: ShipStartTeam1,
        ShipUpdateCode: ShipUpdateTeam1,
    },
];

export var UserCompiledCode: CompiledCodeStorage[] = [
    {
        BaseStartCode: compileCode(BaseStartTeam0),
        BaseUpdateCode: compileCode(BaseUpdateTeam0),
        ShipStartCode: compileCode(ShipStartTeam0),
        ShipUpdateCode: compileCode(ShipUpdateTeam0),
    },
    {
        BaseStartCode: compileCode(BaseStartTeam1),
        BaseUpdateCode: compileCode(BaseUpdateTeam1),
        ShipStartCode: compileCode(ShipStartTeam1),
        ShipUpdateCode: compileCode(ShipUpdateTeam1),
    },
];

// HTML ELEMENTS
export var GlobalCanvas: HTMLCanvasElement;
export var DOMCallback: Function = function () {};
export var PhysicsCallback: Function = function () {};
export var GameEndCallback: Function = function () {};

/*
    SETTERS
*/
export var setPaused = function (value: boolean) {
    PAUSED = value;
};

export var setFramerate = function (value: number) {
    FRAMERATE = value;
};

export var setTicksPerFrame = function (value: number) {
    TICKS_PER_FRAME = value;
};

export var setBaseStartCode = function (team: number, code: string) {
    UserCode[team]['BaseStartCode'] = code;
    UserCompiledCode[team]['BaseStartCode'] = compileCode(code);
};

export var setBaseUpdateCode = function (team: number, code: string) {
    UserCode[team]['BaseUpdateCode'] = code;
    UserCompiledCode[team]['BaseUpdateCode'] = compileCode(code);
};

export var setShipStartCode = function (team: number, code: string) {
    UserCode[team]['ShipStartCode'] = code;
    UserCompiledCode[team]['ShipStartCode'] = compileCode(code);
};

export var setShipUpdateCode = function (team: number, code: string) {
    UserCode[team]['ShipUpdateCode'] = code;
    UserCompiledCode[team]['ShipUpdateCode'] = compileCode(code);
};

export var setGraphics = function (value: boolean) {
    GRAPHICS_ENABLED = value;
};

export var setCanvasElement = function (canvasElement: HTMLCanvasElement) {
    GlobalCanvas = canvasElement;
    GlobalCanvas.width = W;
    GlobalCanvas.height = H;
};

export var setGameStarted = function (value: boolean) {
    GAME_STARTED = value;
};

export var setGameStateManager = function (value: StateManager) {
    GameStateManager = value;
};

export var setGameObjectManager = function (value: ObjectManager) {
    GameObjectManager = value;
    GameObjectManagerProxy = ProxyMan.createObjectManagerProxy(GameObjectManager);
};

export var setRenderer = function (value: Renderer) {
    GlobalRender = value;
    GlobalRenderProxy = ProxyMan.createRendererProxy(GlobalRender);
};

export var resetGameState = function () {
    GAME_STARTED = false;
    GameObjectList = [];
    RenderQueue = {};
};

export const clearRenderQueue = function () {
    RenderQueue = {};
};

/**
 * This mutates GameObjectList btw
 */
export const sortGameObjectList = function () {
    GameObjectList.sort(function (a, b) {
        const circleA = a.transform;
        const circleB = b.transform;
        return circleA.position.x - circleB.position.x;
    });

    // save a cached array of X values for operations
    xArray = GameObjectList.map((value) => value.transform.position.x);
};

export const spawn = function (obj: GameObject) {
    GameObjectList.push(obj);

    if (!STREAMING && (obj.type === 'SHIP' || obj.type === 'BASE')) {
        console.log('Initializing player-controlled code');
        const start = performance.now();
        //@ts-ignore
        obj.start();
        const elapsed = performance.now() - start;

        if (elapsed > USER_CODE_TIMEOUT * 2) {
            //@ts-ignore
            console.log(`Player ${obj.team} ${obj.type} start code timed out`);
            //@ts-ignore
            GameEndCallback(obj.team);
        }
    }
};

export var setUICallback = function (value: Function) {
    DOMCallback = value;
};

export var setPhysicsCallback = function (value: Function) {
    PhysicsCallback = value;
};

export var setGameObjectList = function (goList: GameObject[]) {
    GameObjectList = goList;
};

export var setIsStreaming = function (value: boolean) {
    STREAMING = value;
};

export var setGameEndCallback = function (value: Function) {
    GameEndCallback = value;
};

export var setNodeJS = function (value: boolean) {
    NODEJS = value;
};

export var setUserCodeTimeout = function (value: number) {
    USER_CODE_TIMEOUT = value;
};

export function setEngineConfig(options: EngineConfig) {
    
    if (options.canvas) { setCanvasElement(options.canvas) }
    if (options.ticksPerFrame) { setTicksPerFrame(options.ticksPerFrame)}
    GRAPHICS_ENABLED = options.graphics ?? GRAPHICS_ENABLED
    FRAMERATE = options.framerate ?? FRAMERATE
    STREAMING = options.streaming ?? STREAMING
    NODEJS = options.nodejs ?? NODEJS
    USER_CODE_TIMEOUT = options.userCodeTimeout ?? USER_CODE_TIMEOUT

}