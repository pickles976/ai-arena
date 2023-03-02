import { GameObject } from './objects/gameObject';
import {
    GameObjectList,
    GameObjectManager,
    GameStateManager,
    PAUSED,
    resetGameState,
    setBaseStartCode,
    setBaseUpdateCode,
    setUICallback,
    setPaused,
    setShipStartCode,
    setShipUpdateCode,
    MS,
    setPhysicsCallback,
    setGameEndCallback,
    setErrorCallback
} from './globals.js';
import { run, setGameState, setupLoops, stop } from './engine/runner';
import { Serializer } from './managers/serializer';
import { Code } from './types';

export var testPackage = function () {
    Serializer.test();
    return 'ai-arena package has loaded successfully!';
};

// Get Game Info

export var getScore = function () {
    return JSON.parse(GameStateManager.serialize());
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

        if (callbacks.error !== undefined) {
            setErrorCallback(callbacks.error)
        }
    }
};

export function setUserCode(code: Code) {

    if (code.team0) {
        let temp = code.team0
        setBaseStartCode(0, temp.baseStart)
        setBaseUpdateCode(0, temp.baseUpdate)
        setShipStartCode(0, temp.shipStart)
        setShipUpdateCode(0, temp.shipUpdate)
    }

    if (code.team1) {
        let temp = code.team1
        setBaseStartCode(1, temp.baseStart)
        setBaseUpdateCode(1, temp.baseUpdate)
        setShipStartCode(1, temp.shipStart)
        setShipUpdateCode(1, temp.shipUpdate)
    }

}


import { setGameConfig } from './config/gameConfig'
import { setEngineConfig } from './globals.js';
export { setGameConfig, setEngineConfig, setupLoops }