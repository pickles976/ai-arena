import {setConfig, testPackage, runGame, setUserCode, setCallbacks} from './dist/index.js'

console.log(testPackage())

setConfig({
    canvas: document.getElementById("game-canvas"),
    graphics: true,
    ticksPerFrame: 2,
    framerate: 60,
    streaming: false,
    nodejs: false,
    userCodeTimeout: 1.0,
})

setUserCode({
    team0 : {
        // BaseStartCode : 'seek(d)'
    }
})

setCallbacks({
    // gameEnd: 'x',
    // ui: 'y',
    // physics: 'z',
})

runGame()