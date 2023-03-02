import { checkForCollisions } from './collisions';
import { DummyRenderer } from './dummyRenderer';
import { clearRenderQueue, DOMCallback, GameEndCallback, GameObjectList, GameObjectManager, GameStateManager, GAME_STARTED, GlobalCanvas, GlobalRender, GRAPHICS_ENABLED, H, MS, PAUSED, PhysicsCallback, RenderQueue, resetGameState, setGameObjectList, setGameObjectManager, setGameStarted, setGameStateManager, setRenderer, sortGameObjectList, spawn, STREAMING, TICKS_PER_FRAME, USER_CODE_MAX_SIZE, USER_CODE_TIMEOUT, W, ErrorCallback, } from '../config/engineConfig';
import { ObjectManager } from '../managers/objectManager';
import { Base, Ship } from '../objects/objects';
import { Vector2D } from './physics';
import { Renderer } from './renderer';
import { StateManager } from '../managers/stateManager';
import { checkMemory, clamp, create_UUID } from './utils';
var requestFrameID = null;
var physicsTimeout = [];
var renderTimeout = null;
var FIRST_FRAME_TIMEOUT = USER_CODE_TIMEOUT * 10;
var frame = 0;
var durationArrayTeam0 = new Array(100).fill(USER_CODE_TIMEOUT / 2);
var durationArrayTeam1 = new Array(100).fill(USER_CODE_TIMEOUT / 2);
export var setGameState = function (goList) {
    clearPhysTimeouts();
    setGameObjectList(goList);
    GameObjectManager.indexObjects(GameObjectList);
};
export var initializeGameState = function () {
    console.log('Initializing game state...');
    setGameStarted(true);
    setGameStateManager(new StateManager());
    setGameObjectManager(new ObjectManager());
    spawn(new Base(create_UUID(), new Vector2D(W / 4, H / 2), 500, 0));
    spawn(new Base(create_UUID(), new Vector2D((3 * W) / 4, H / 2), 500, 1));
    GameObjectManager.indexObjects(GameObjectList);
    spawn(new Ship(create_UUID(), new Vector2D(W / 4, H / 4), new Vector2D(0, 0), new Vector2D(0, 0), 100, 0));
    spawn(new Ship(create_UUID(), new Vector2D((3 * W) / 4, (3 * H) / 4), new Vector2D(0, 0), new Vector2D(0, 0), 100, 1));
    GameObjectManager.start();
    if (GRAPHICS_ENABLED)
        setRenderer(new Renderer(H, W, GlobalCanvas));
    else
        setRenderer(new DummyRenderer());
    frame = 0;
    durationArrayTeam0 = new Array(100).fill(USER_CODE_TIMEOUT / 2);
    durationArrayTeam1 = new Array(100).fill(USER_CODE_TIMEOUT / 2);
    console.log('Game state initialized!');
};
export var renderLoop = function () {
    if (GRAPHICS_ENABLED) {
        try {
            var frameStart = performance.now();
            if (!PAUSED && GAME_STARTED) {
                render();
                clearRenderQueue();
                DOMCallback();
            }
            var elapsed = performance.now() - frameStart;
            renderTimeout = setTimeout(function () { return (requestFrameID = window.requestAnimationFrame(renderLoop)); }, clamp(MS - elapsed, 0, 1000));
        }
        catch (e) {
            ErrorCallback(e);
            console.log("Failed to render \n Error: ".concat(e));
        }
    }
};
export var physicsLoop = function () {
    var frameStart = performance.now();
    if (!PAUSED && GAME_STARTED) {
        clearRenderQueue();
        updateField();
        PhysicsCallback();
    }
    var elapsed = performance.now() - frameStart;
    physicsTimeout.shift();
    physicsTimeout.push(setTimeout(physicsLoop, clamp(MS - elapsed, 0, 1000)));
    frame++;
};
var updateField = function () {
    sortGameObjectList();
    for (var i = GameObjectList.length - 1; i >= 0; i--) {
        var value = GameObjectList[i];
        if (value.type === 'DEAD')
            GameObjectList.splice(i, 1);
        else
            value.simulate(MS);
    }
    if (isGameOver()) {
        stop();
        return;
    }
    sortGameObjectList();
    checkForCollisions(GameObjectList);
    GameObjectManager.update();
    if (!STREAMING) {
        for (var i = GameObjectList.length - 1; i >= 0; i--) {
            var value = GameObjectList[i];
            if ((value.type === 'SHIP' && value instanceof Ship) || (value.type === 'BASE' && value instanceof Base)) {
                try {
                    var start = performance.now();
                    value.update();
                    var elapsed = performance.now() - start;
                    var avg = 0;
                    if (value.team == 0) {
                        durationArrayTeam0.shift();
                        durationArrayTeam0.push(elapsed);
                        avg =
                            durationArrayTeam0.reduce(function (partialSum, a) { return partialSum + a; }, 0) / durationArrayTeam0.length;
                    }
                    else {
                        durationArrayTeam1.shift();
                        durationArrayTeam1.push(elapsed);
                        avg =
                            durationArrayTeam1.reduce(function (partialSum, a) { return partialSum + a; }, 0) / durationArrayTeam1.length;
                    }
                    var CODE_TIMEOUT = frame <= 1 ? FIRST_FRAME_TIMEOUT : USER_CODE_TIMEOUT;
                    if (elapsed > CODE_TIMEOUT && avg > CODE_TIMEOUT) {
                        console.log("Player ".concat(value.team, " ").concat(value.type, " Update code ran in an average of ").concat(avg, "ms, more than ").concat(CODE_TIMEOUT, "ms timeout"));
                        alert("Player ".concat(value.team, " ").concat(value.type, " Update code ran in an average of ").concat(avg, "ms, more than ").concat(CODE_TIMEOUT, "ms timeout"));
                        GameObjectManager.getBaseByTeam(value.team).type = 'DEAD';
                        GameEndCallback(value.team);
                        break;
                    }
                    else if (checkMemory(value)) {
                        console.log("Player ".concat(value.team, " ").concat(value.type, " Update code used more than ").concat(USER_CODE_MAX_SIZE, " kb"));
                        alert("Player ".concat(value.team, " ").concat(value.type, " Update code used more than ").concat(USER_CODE_MAX_SIZE, " kb"));
                        GameObjectManager.getBaseByTeam(value.team).type = 'DEAD';
                        GameEndCallback(value.team);
                        break;
                    }
                }
                catch (e) {
                    ErrorCallback(e);
                    console.log("User code failed with ".concat(e, ". Game exiting..."));
                    break;
                }
            }
        }
    }
};
var render = function () {
    for (var i = 0; i < GameObjectList.length; i++) {
        if (GameObjectList[i] != null)
            GameObjectList[i].render(GlobalRender);
    }
    GlobalRender.newFrame();
    for (var _i = 0, _a = Object.entries(RenderQueue); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        for (var _c = 0, value_1 = value; _c < value_1.length; _c++) {
            var renderFunc = value_1[_c];
            renderFunc.next();
        }
    }
};
export var run = function () {
    console.log("GAME STARTED: ".concat(GAME_STARTED));
    if (GAME_STARTED === false) {
        console.log('Game starting!');
        initializeGameState();
        setupLoops();
    }
};
export var setupLoops = function () {
    console.log("Initializing game loops...");
    clearTimeouts();
    for (var i = 0; i < TICKS_PER_FRAME; i++) {
        physicsTimeout.push(setTimeout(physicsLoop, (MS / TICKS_PER_FRAME) * i));
    }
    renderLoop();
};
var clearTimeouts = function () {
    clearPhysTimeouts();
    clearRenderTimeouts();
};
var clearRenderTimeouts = function () {
    if (requestFrameID != null)
        cancelAnimationFrame(requestFrameID);
    if (renderTimeout != null)
        clearTimeout(renderTimeout);
};
var clearPhysTimeouts = function () {
    for (var _i = 0, physicsTimeout_1 = physicsTimeout; _i < physicsTimeout_1.length; _i++) {
        var timeout = physicsTimeout_1[_i];
        clearTimeout(timeout);
    }
};
export var stop = function () {
    setGameStarted(false);
    clearTimeouts();
    resetGameState();
};
var isGameOver = function () {
    return GameStateManager.update();
};
//# sourceMappingURL=runner.js.map