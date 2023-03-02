import { GameObject } from './objects/gameObject';
import {
    GameObjectList,
    GameObjectManager,
    GameStateManager,
    PAUSED,
    resetGameState,
    setBaseStartCode,
    setBaseUpdateCode,
    setCanvasElement,
    setUICallback,
    setGraphics,
    setPaused,
    setShipStartCode,
    setShipUpdateCode,
    setFramerate,
    setTicksPerFrame,
    MS,
    setPhysicsCallback,
    setIsStreaming,
    setNodeJS,
    setGameEndCallback,
    setUserCodeTimeout,
} from './globals.js';
import { run, setGameState, setupLoops, stop } from './engine/runner';
import { Serializer } from './managers/serializer';

export var testPackage = function () {
    Serializer.test();
    return 'ai-arena package has loaded successfully!';
};

// Get Game Info

export var getScore = function () {
    return JSON.parse(getScoreString());
};

export var getScoreString = function () {
    return GameStateManager.serialize();
};

export var getShipsInfo = function () {
    return {
        team0: GameObjectManager.getShipsByTeam(0).filter((x) => x.toData()),
        team1: GameObjectManager.getShipsByTeam(1).filter((x) => x.toData()),
    };
};

export var getBasesInfo = function () {
    return { team0: GameObjectManager.getBaseByTeam(0).toData(), team1: GameObjectManager.getBaseByTeam(1).toData() };
};

export var getGameState = function () {
    return Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList));
};

// Packets
export var getGamePacket = function () {
    return Serializer.packetifyGameObjectList(GameObjectList);
};

export var loadGamePacket = function (gameState: Float32Array) {
    let objList: GameObject[] = Serializer.unpacketify(gameState);
    setGameState(objList);
};

export var getScorePacket = function () {
    return GameStateManager.packet();
};

export var loadScorePacket = function (arr: Float32Array) {
    GameStateManager.loadFromPacket(arr);
};

// Controls
export var togglePause = function () {
    if (PAUSED) {
        setPaused(false);
        console.log('Unpaused!');
    } else {
        setPaused(true);
        console.log('Paused!');
    }
};

export var stepFrame = function () {
    setPaused(false);
    setTimeout(() => setPaused(true), MS);
};

export var runGame = function () {
    run();
};

export var stopGame = function () {
    stop();
};

export var restart = function () {
    resetGameState();
};

export var setConfig = function (options: any) {
    if (options !== null && options !== undefined) {

        if (options.canvas != undefined) {
            setCanvasElement(options.canvas);
        }

        if (options.graphics != undefined) {
            setGraphics(options.graphics);
        }

        if (options.framerate != undefined) {
            setFramerate(options.framerate);
        }

        if (options.ticksPerFrame != undefined) {
            setTicksPerFrame(options.ticksPerFrame);
            setupLoops();
        }

        if (options.streaming != undefined) {
            setIsStreaming(options.streaming);
        }

        if (options.nodejs != undefined) {
            setNodeJS(options.nodejs);
        }

        if (options.userCodeTimeout != undefined) {
            setUserCodeTimeout(options.userCodeTimeout);
        }
    }
};

export var setCallbacks = function (callbacks: any) {
    if (callbacks !== null && callbacks !== undefined) {
        if (callbacks.gameEnd !== undefined) {
            setGameEndCallback(callbacks.gameEnd);
        }

        if (callbacks.ui !== undefined) {
            setUICallback(callbacks.ui);
        }

        if (callbacks.physics !== undefined) {
            setPhysicsCallback(callbacks.physics);
        }
    }
};

export var setUserCode = function (code: any) {
    if (code !== undefined && code !== null) {
        if (code.team0 !== undefined) {
            let temp = code.team0;

            if (temp.BaseStartCode !== undefined) {
                setBaseStartCode(0, temp.BaseStartCode);
            }
            if (temp.BaseUpdateCode !== undefined) {
                setBaseUpdateCode(0, temp.BaseUpdateCode);
            }
            if (temp.ShipStartCode !== undefined) {
                setShipStartCode(0, temp.ShipStartCode);
            }
            if (temp.ShipUpdateCode !== undefined) {
                setShipUpdateCode(0, temp.ShipUpdateCode);
            }
        }

        if (code.team1 !== undefined) {
            let temp = code.team1;

            if (temp.BaseStartCode !== undefined) {
                setBaseStartCode(1, temp.BaseStartCode);
            }
            if (temp.BaseUpdateCode !== undefined) {
                setBaseUpdateCode(1, temp.BaseUpdateCode);
            }
            if (temp.ShipStartCode !== undefined) {
                setShipStartCode(1, temp.ShipStartCode);
            }
            if (temp.ShipUpdateCode !== undefined) {
                setShipUpdateCode(1, temp.ShipUpdateCode);
            }
        }
    }
};
