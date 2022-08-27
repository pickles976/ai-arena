import {setCanvas, testPackage, runGame} from './dist/index.js'

console.log(testPackage())
setCanvas(document.getElementById("game-canvas"))
runGame()