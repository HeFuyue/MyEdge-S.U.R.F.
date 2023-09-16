import {canvas, backgroundCanvas, playerCanvas} from '../index.js'
import {useStore} from './component/Component.js'
import {debounce} from './utils/index.js'

const body = document.getElementsByTagName('body')[0]
const $store = useStore()

export const backgroundImage = new Image()
backgroundImage.src = "./assets/bg.png"
// backgroundImage.onload = () => drawStaticBackground(bgctx, backgroundImage)

export function drawStaticBackground(ctx, bgImg) {
    const pattern = ctx.createPattern(bgImg, "repeat")
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, ctx.width, ctx.height)
}

export function drawBackground(ctx, bgImg, positionX, positionY) {
    const canvasWidth = ctx.canvas.width
    const canvasHeight = ctx.canvas.height
    const bgImgWidth = bgImg.width
    const bgImgHeight = bgImg.height

    positionX = positionX % bgImgWidth
    positionY = positionY % bgImgHeight
    
    const bgImgNumX = Math.ceil((canvasWidth - positionX) / bgImgWidth) + Math.ceil(positionX / bgImgWidth) + 2
    const bgImgNumY = Math.ceil((canvasHeight - positionY) / bgImgHeight) + Math.ceil(positionY / bgImgHeight) + 1
    
    // console.log(canvasWidth, canvasHeight, bgImgWidth, bgImgHeight, bgImgNumX, bgImgNumY)

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    for (let x = 0; x < bgImgNumX; x++) {
        for (let y = 0; y < bgImgNumY; y++) {
            ctx.drawImage(bgImg, (x - 1) * bgImgWidth - positionX, y * bgImgHeight - positionY, bgImgWidth, bgImgHeight)
        }
    }
}

console.log(body.clientWidth, body.clientHeight)

function setCanvasSize() {
    canvas.width = body.clientWidth
    canvas.height = body.clientHeight
    backgroundCanvas.width = body.clientWidth
    backgroundCanvas.height = body.clientHeight
    playerCanvas.width = body.clientWidth
    playerCanvas.height = body.clientHeight
    

    $store.dispatch('changeCanvasSize', {
        height: body.clientHeight,
        width: body.clientWidth
    })
}

setCanvasSize()

window.addEventListener('resize', debounce(() => {
    setCanvasSize()
}, 100))

/* setInterval(() => {
    console.log('@')
    bgctx.clearRect(0, 0, body.clientWidth, body.clientHeight)
    bgctx.translate(1, 1)
    drawBackground(bgctx)
}, 10) */
