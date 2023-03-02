import {setConfig, testPackage, runGame, setUserCode, setCallbacks} from 'ai-arena'

console.log(testPackage())

setConfig({
    canvas: document.getElementById("game-canvas"),
    graphics: true,
    ticksPerFrame: 32,
    framerate: 60,
    streaming: false,
    nodejs: false,
    userCodeTimeout: 1.0,
})

// setUserCode({
//     team1 : {
//         BaseStartCode : "", 
//         BaseUpdateCode : "", 
//         ShipStartCode : "",
//         ShipUpdateCode : ""
//     }
// })

setCallbacks({
    // gameEnd: 'x',
    // ui: 'y',
    // physics: 'z',
})

runGame()