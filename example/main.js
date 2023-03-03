import {setEngineConfig, testPackage, runGame, setUserCode, setCallbacks, setGameConfig, setupLoops} from 'ai-arena'
import { Code, TeamCode } from 'ai-arena'

console.log(testPackage())

setGameConfig({
})

setEngineConfig({
    canvas: document.getElementById("game-canvas"),
    graphics: true,
    ticksPerFrame: 2,
    framerate: 60,
    streaming: false,
    nodejs: false,
    userCodeTimeout: 1.0,
})

// setUserCode({
//     team1 : new TeamCode("","","","")
// })

setCallbacks({
    // gameEnd: 'x',
    // ui: 'y',
    // physics: 'z',
})

runGame()