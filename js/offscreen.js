// import {Group} from './component/Component.js'

onmessage = function(e) {
    console.log(e)
    const offscreenCanvas = e.data.canvas
    const spriteSetting = e.data.spriteSetting
    const ofsctx = offscreenCanvas.getContext('2d')

    let x = 0
    function animate() {
        ofsctx.fillStyle = 'black'
        ofsctx.fillRect(x, 0, 100, 100)
        x += 1
        requestAnimationFrame(animate)
    }

    animate()
    
    console.log(ofsctx)
    self.ofsctx = ofsctx

    const imageBitmap = offscreenCanvas.transferToImageBitmap()
    postMessage({imageBitmap: imageBitmap, spriteSetting: spriteSetting}, [imageBitmap])
}

console.log(self)
