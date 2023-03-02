import { BaseStartTeam0, BaseStartTeam1, BaseUpdateTeam0, BaseUpdateTeam1, ShipStartTeam0, ShipStartTeam1, ShipUpdateTeam0, ShipUpdateTeam1, } from '../objects/aiControls.js';
import { ProxyMan } from '../objects/objectProxies';
import { compileCode } from '../engine/safeEval';
import { setupLoops } from '../engine/runner';
export var W = 1080;
export var H = 720;
export var FRAMERATE = 30.0;
export var MS = 1000.0 / FRAMERATE;
export var TICKS_PER_FRAME = 1;
export var VELOCITY_FACTOR = FRAMERATE * 1000;
export var NODEJS = false;
export var GRAPHICS_ENABLED = true;
export var GAME_STARTED = false;
export var PAUSED = false;
export var STREAMING = false;
export var USER_CODE_TIMEOUT = 1.0;
export var USER_CODE_MAX_SIZE = 8.0;
export var GlobalRender;
export var GlobalRenderProxy;
export var RenderQueue = {};
export var GameObjectManager;
export var GameObjectManagerProxy;
export var GameStateManager;
export var GameObjectList = [];
export var teamColors = ['#FF0000', '#0000FF'];
export var resourceColors = ['#666666', '#ADD8E6', '#00FF00'];
export var obstacleColor = '#A52A2A';
export var bulletColor = '#FFFF00';
export var backgroundColor = '#000000';
export var xArray = [];
export var UserCode = [
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
export var UserCompiledCode = [
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
export var GlobalCanvas;
export var DOMCallback = function () { };
export var PhysicsCallback = function () { };
export var GameEndCallback = function () { };
export var ErrorCallback = function () { };
export var setPaused = function (value) {
    PAUSED = value;
};
export var setFramerate = function (value) {
    FRAMERATE = value;
};
export var setTicksPerFrame = function (value) {
    TICKS_PER_FRAME = value;
    setupLoops();
};
export var setBaseStartCode = function (team, code) {
    UserCode[team]['BaseStartCode'] = code;
    UserCompiledCode[team]['BaseStartCode'] = compileCode(code);
};
export var setBaseUpdateCode = function (team, code) {
    UserCode[team]['BaseUpdateCode'] = code;
    UserCompiledCode[team]['BaseUpdateCode'] = compileCode(code);
};
export var setShipStartCode = function (team, code) {
    UserCode[team]['ShipStartCode'] = code;
    UserCompiledCode[team]['ShipStartCode'] = compileCode(code);
};
export var setShipUpdateCode = function (team, code) {
    UserCode[team]['ShipUpdateCode'] = code;
    UserCompiledCode[team]['ShipUpdateCode'] = compileCode(code);
};
export var setCanvasElement = function (canvasElement) {
    GlobalCanvas = canvasElement;
    GlobalCanvas.width = W;
    GlobalCanvas.height = H;
};
export var setGameStarted = function (value) {
    GAME_STARTED = value;
};
export var setGameStateManager = function (value) {
    GameStateManager = value;
};
export var setGameObjectManager = function (value) {
    GameObjectManager = value;
    GameObjectManagerProxy = ProxyMan.createObjectManagerProxy(GameObjectManager);
};
export var setRenderer = function (value) {
    GlobalRender = value;
    GlobalRenderProxy = ProxyMan.createRendererProxy(GlobalRender);
};
export var resetGameState = function () {
    GAME_STARTED = false;
    GameObjectList = [];
    RenderQueue = {};
};
export var clearRenderQueue = function () {
    RenderQueue = {};
};
export var sortGameObjectList = function () {
    GameObjectList.sort(function (a, b) {
        var circleA = a.transform;
        var circleB = b.transform;
        return circleA.position.x - circleB.position.x;
    });
    xArray = GameObjectList.map(function (value) { return value.transform.position.x; });
};
export var spawn = function (obj) {
    GameObjectList.push(obj);
    if (!STREAMING && (obj.type === 'SHIP' || obj.type === 'BASE')) {
        console.log('Initializing player-controlled code');
        var start = performance.now();
        obj.start();
        var elapsed = performance.now() - start;
        if (elapsed > USER_CODE_TIMEOUT * 2) {
            console.log("Player ".concat(obj.team, " ").concat(obj.type, " start code timed out"));
            GameEndCallback(obj.team);
        }
    }
};
export var setUICallback = function (value) {
    DOMCallback = value;
};
export var setPhysicsCallback = function (value) {
    PhysicsCallback = value;
};
export var setErrorCallback = function (value) {
    ErrorCallback = value;
};
export var setGameObjectList = function (goList) {
    GameObjectList = goList;
};
export var setGameEndCallback = function (value) {
    GameEndCallback = value;
};
export function setEngineConfig(options) {
    var _a, _b, _c, _d, _e;
    if (options.canvas) {
        setCanvasElement(options.canvas);
    }
    if (options.ticksPerFrame) {
        setTicksPerFrame(options.ticksPerFrame);
    }
    GRAPHICS_ENABLED = (_a = options.graphics) !== null && _a !== void 0 ? _a : GRAPHICS_ENABLED;
    FRAMERATE = (_b = options.framerate) !== null && _b !== void 0 ? _b : FRAMERATE;
    STREAMING = (_c = options.streaming) !== null && _c !== void 0 ? _c : STREAMING;
    NODEJS = (_d = options.nodejs) !== null && _d !== void 0 ? _d : NODEJS;
    USER_CODE_TIMEOUT = (_e = options.userCodeTimeout) !== null && _e !== void 0 ? _e : USER_CODE_TIMEOUT;
}
//# sourceMappingURL=engineConfig.js.map