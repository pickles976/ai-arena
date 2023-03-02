import {setEngineConfig, testPackage, runGame, setUserCode, setCallbacks, setGameConfig} from 'ai-arena'
import { TeamCode } from 'ai-arena/dist/types'

console.log(testPackage())

setGameConfig({
})

setEngineConfig({
    canvas: document.getElementById("game-canvas"),
    graphics: true,
    ticksPerFrame: 8,
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