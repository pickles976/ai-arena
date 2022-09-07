import {setCanvas, testPackage, runGame, setTicksPerFrame} from './dist/index.js'

console.log(testPackage())
setCanvas(document.getElementById("game-canvas"))
setTicksPerFrame(2)
runGame()