import {setConfig, testPackage, runGame, setUserCode, setCallbacks, setEngineConfig} from './dist/index.js'

console.log(testPackage())

setEngineConfig({
    canvas: document.getElementById("game-canvas"),
    graphics: true,
    ticksPerFrame: 32,
    framerate: 60,
    streaming: false,
    nodejs: false,
    userCodeTimeout: 1.0
})

setUserCode({
    team1 : {
        baseStart : "", 
        baseUpdate : "", 
        shipStart : "",
        shipUpdate : ""
    }
})

setCallbacks({
    // gameEnd: 'x',
    // ui: 'y',
    // physics: 'z',
})

runGame()