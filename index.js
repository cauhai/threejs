import { showBox } from './box.js'
import { showBalls } from './balls'

const clearCanvas = () => {
    const oldCanvas = document.querySelector('canvas')
    if (oldCanvas) oldCanvas.remove()
}
clearCanvas()

document.getElementById("button-box").addEventListener("click", showBox)
document.getElementById("button-balls").addEventListener("click", showBalls)
document.getElementById("button-clear").addEventListener("click", clearCanvas)
