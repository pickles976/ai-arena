import { GameObjectList, GameObjectManager, GameStateManager, PAUSED, resetGameState, setBaseStartCode, setBaseUpdateCode, setUICallback, setPaused, setShipStartCode, setShipUpdateCode, MS, setPhysicsCallback, setGameEndCallback, setErrorCallback, } from './config/engineConfig';
import { run, stop } from './engine/runner';
import { Serializer } from './managers/serializer';
export var testPackage = function () {
    Serializer.test();
    return 'ai-arena package has loaded successfully!';
};
export var getScore = function () {
    return JSON.parse(GameStateManager.serialize());
};
export var getShipsInfo = function () {
    return {
        team0: GameObjectManager.getShipsByTeam(0).filter(function (x) { return x.toData(); }),
        team1: GameObjectManager.getShipsByTeam(1).filter(function (x) { return x.toData(); }),
    };
};
export var getBasesInfo = function () {
    return { team0: GameObjectManager.getBaseByTeam(0).toData(), team1: GameObjectManager.getBaseByTeam(1).toData() };
};
export var getGameState = function () {
    return Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList));
};
export var togglePause = function () {
    if (PAUSED) {
        setPaused(false);
        console.log('Unpaused!');
    }
    else {
        setPaused(true);
        console.log('Paused!');
    }
};
export var stepFrame = function () {
    setPaused(false);
    setTimeout(function () { return setPaused(true); }, MS);
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
export var setCallbacks = function (callbacks) {
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
            setErrorCallback(callbacks.error);
        }
    }
};
export function setUserCode(code) {
    if (code.team0) {
        var temp = code.team0;
        setBaseStartCode(0, temp.baseStart);
        setBaseUpdateCode(0, temp.baseUpdate);
        setShipStartCode(0, temp.shipStart);
        setShipUpdateCode(0, temp.shipUpdate);
    }
    if (code.team1) {
        var temp = code.team1;
        setBaseStartCode(0, temp.baseStart);
        setBaseUpdateCode(0, temp.baseUpdate);
        setShipStartCode(0, temp.shipStart);
        setShipUpdateCode(0, temp.shipUpdate);
    }
}
import { setEngineConfig } from './config/engineConfig.js';
export { setEngineConfig };
//# sourceMappingURL=index.js.map