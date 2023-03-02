import { checkForCollisions } from './collisions';
import { DummyRenderer } from './dummyRenderer';
import { GameObject } from '../objects/gameObject';
import {
    clearRenderQueue,
    DOMCallback,
    GameEndCallback,
    GameObjectList,
    GameObjectManager,
    GameStateManager,
    GAME_STARTED,
    GlobalCanvas,
    GlobalRender,
    GRAPHICS_ENABLED,
    H,
    MS,
    PAUSED,
    PhysicsCallback,
    RenderQueue,
    resetGameState,
    setGameObjectList,
    setGameObjectManager,
    setGameStarted,
    setGameStateManager,
    setRenderer,
    sortGameObjectList,
    spawn,
    STREAMING,
    TICKS_PER_FRAME,
    USER_CODE_MAX_SIZE,
    USER_CODE_TIMEOUT,
    W,
} from '../globals';
import { ObjectManager } from '../managers/objectManager';
import { Base, Ship } from '../objects/objects';
import { Vector2D } from './physics';
import { Renderer } from './renderer';
import { StateManager } from '../managers/stateManager';
import { checkMemory, clamp, create_UUID } from '../util/utils';
import { INITIAL_SHIPS_TEAM0, INITIAL_SHIPS_TEAM1 } from '../config/gameConfig';

let requestFrameID: number = null;

// @ts-ignore
let physicsTimeout: NodeJS.Timeout[] = [];
// @ts-ignore
let renderTimeout: NodeJS.Timeout = null;

const FIRST_FRAME_TIMEOUT = USER_CODE_TIMEOUT * 10;
let frame = 0;
let durationArrayTeam0 = new Array(100).fill(USER_CODE_TIMEOUT / 2);
let durationArrayTeam1 = new Array(100).fill(USER_CODE_TIMEOUT / 2);

export const setGameState = function (goList: GameObject[]) {
    clearPhysTimeouts();
    setGameObjectList(goList);
    GameObjectManager.indexObjects(GameObjectList);
};

export const initializeGameState = function () {
    console.log('Initializing game state...');

    setGameStarted(true);

    // INITALIZE GAME STATE MANAGER
    setGameStateManager(new StateManager());

    // CREATE OUR SHIT
    setGameObjectManager(new ObjectManager());

    spawn(new Base(create_UUID(), new Vector2D(W / 4, H / 2), 500, 0));
    spawn(new Base(create_UUID(), new Vector2D((3 * W) / 4, H / 2), 500, 1));

    GameObjectManager.indexObjects(GameObjectList);

    // Let users star with a X number of ships
    for (let i = 0; i < INITIAL_SHIPS_TEAM0; i++) 
    {
        spawn(new Ship(create_UUID(), new Vector2D(W / 4, i * 20 + (H / 4)), new Vector2D(0, 0), new Vector2D(0, 0), 100, 0));
    }

    for (let i = 0; i < INITIAL_SHIPS_TEAM1; i++) 
    {
        spawn(new Ship(create_UUID(), new Vector2D((3 * W) / 4, i * 20 + (3 * H) / 4), new Vector2D(0, 0), new Vector2D(0, 0), 100, 1),);
    }

    // populate the game field
    GameObjectManager.start();

    if (GRAPHICS_ENABLED) setRenderer(new Renderer(H, W, GlobalCanvas));
    // @ts-ignore
    else setRenderer(new DummyRenderer());

    frame = 0;
    durationArrayTeam0 = new Array(100).fill(USER_CODE_TIMEOUT / 2);
    durationArrayTeam1 = new Array(100).fill(USER_CODE_TIMEOUT / 2);

    console.log('Game state initialized!');
};

export const renderLoop = function () {
    if (GRAPHICS_ENABLED) {
        try {
            const frameStart = performance.now();
            if (!PAUSED && GAME_STARTED) {
                render();
                clearRenderQueue();
                DOMCallback();
            }

            let elapsed = performance.now() - frameStart;
            // console.log(`Render step took ${elapsed}ms`)

            renderTimeout = setTimeout(
                () => (requestFrameID = window.requestAnimationFrame(renderLoop)),
                clamp(MS - elapsed, 0, 1000),
            );
        } catch (e) {
            alert(`Failed to render \n Error: ${e}`);
        }
    }
};

// 60 FPS
// 16.66ms/frame
/**
 * CONTROLS THE LOGIC FOR EACH FRAME
 */
export const physicsLoop = function () {
    const frameStart = performance.now();

    if (!PAUSED && GAME_STARTED) {
        clearRenderQueue();
        updateField();
        PhysicsCallback();
    }

    let elapsed = performance.now() - frameStart;
    // console.log(`Physics step took ${elapsed}ms`)
    // console.log(clamp((MS/TICKS_PER_FRAME) - elapsed,0,1000))
    physicsTimeout.shift();
    physicsTimeout.push(setTimeout(physicsLoop, clamp(MS - elapsed, 0, 1000)));
    frame++;
};

/**
 * Runs in order:
 *
 * Dead object collection
 * Point-mass simulation
 * Collisions
 * Queue up "dumb" object spawning
 * AI Logic
 *
 */
const updateField = function () {
    // SORT BY X POSITION (ALLOWS US TO DO COLLISION CHECKS)
    sortGameObjectList();

    // COLLECT DEAD OBJECTS, SIMULATE ALIVE ONES
    for (let i = GameObjectList.length - 1; i >= 0; i--) {
        const value = GameObjectList[i];

        if (value.type === 'DEAD') GameObjectList.splice(i, 1);
        else value.simulate(MS);
    }

    if(isGameOver()){
        stop()
        return
    }


    // SORT BY X POSITION
    sortGameObjectList();

    checkForCollisions(GameObjectList);

    // manage the game objects
    GameObjectManager.update();

    // RUN AI LOGIC
    if (!STREAMING) {
        for (let i = GameObjectList.length - 1; i >= 0; i--) {
            const value = GameObjectList[i];

            if ((value.type === 'SHIP' && value instanceof Ship) || (value.type === 'BASE' && value instanceof Base)) {

                

                try {
                    // how long does user codde take to run?
                    const start = performance.now();
                    value.update();
                    const elapsed = performance.now() - start;

                    // average time user code takes to run
                    let avg = 0;
                    if (value.team == 0) {
                        durationArrayTeam0.shift();
                        durationArrayTeam0.push(elapsed);
                        avg =
                            durationArrayTeam0.reduce((partialSum, a) => partialSum + a, 0) / durationArrayTeam0.length;
                    } else {
                        durationArrayTeam1.shift();
                        durationArrayTeam1.push(elapsed);
                        avg =
                            durationArrayTeam1.reduce((partialSum, a) => partialSum + a, 0) / durationArrayTeam1.length;
                    }

                    // account for memory initialization at start of game
                    const CODE_TIMEOUT = frame <= 1 ? FIRST_FRAME_TIMEOUT : USER_CODE_TIMEOUT;

                    // if user code ran too long, make that user lose
                    if (elapsed > CODE_TIMEOUT && avg > CODE_TIMEOUT) {
                        console.log(
                            `Player ${value.team} ${value.type} Update code ran in an average of ${avg}ms, more than ${CODE_TIMEOUT}ms timeout`,
                        );
                        alert(
                            `Player ${value.team} ${value.type} Update code ran in an average of ${avg}ms, more than ${CODE_TIMEOUT}ms timeout`,
                        );
                        GameObjectManager.getBaseByTeam(value.team).type = 'DEAD';
                        GameEndCallback(value.team);
                        break;
                    } else if (checkMemory(value)) {
                        console.log(
                            `Player ${value.team} ${value.type} Update code used more than ${USER_CODE_MAX_SIZE} kb`,
                        );
                        alert(`Player ${value.team} ${value.type} Update code used more than ${USER_CODE_MAX_SIZE} kb`);
                        GameObjectManager.getBaseByTeam(value.team).type = 'DEAD';
                        GameEndCallback(value.team);
                        break;
                    }
                } catch (e) {
                    console.log(`User code failed with ${e}. Game exiting...`);
                    break;
                }
            }
        }
    }
};

/**
 * Renders a frame
 */
const render = function () {
    // call the rendering functions for each object. This doesn't actually render,
    // it queues up rendering calls in the queue
    for (let i = 0; i < GameObjectList.length; i++) {
        if (GameObjectList[i] != null) GameObjectList[i].render(GlobalRender);
    }

    GlobalRender.newFrame();

    // render by depth
    for (const [key, value] of Object.entries(RenderQueue)) {
        for (const renderFunc of value) {
            renderFunc.next();
        }
    }
};

export const run = function () {
    console.log(`GAME STARTED: ${GAME_STARTED}`);
    if (GAME_STARTED === false) {
        console.log('Game starting!');
        initializeGameState();
        setupLoops();
    }
};

export const setupLoops = function () {
    console.log(`Initializing game loops...`);
    clearTimeouts();
    // set multiple timeouts over interval. So one timeout at 16ms, one at 32ms, etc
    for (let i = 0; i < TICKS_PER_FRAME; i++) {
        physicsTimeout.push(setTimeout(physicsLoop, (MS / TICKS_PER_FRAME) * i));
    }
    renderLoop();
};

const clearTimeouts = function () {
    clearPhysTimeouts();
    clearRenderTimeouts();
};

const clearRenderTimeouts = function () {
    if (requestFrameID != null) cancelAnimationFrame(requestFrameID);

    if (renderTimeout != null) clearTimeout(renderTimeout);
};

const clearPhysTimeouts = function () {
    for (let timeout of physicsTimeout) {
        clearTimeout(timeout);
    }
};

export const stop = function () {
    setGameStarted(false);
    clearTimeouts();
    resetGameState();
};

const isGameOver = function () {
    // this checks if the base is dead and ends the game
    return GameStateManager.update();
};
