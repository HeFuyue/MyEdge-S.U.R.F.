import RenderObject from "./RenderObjects.js"

export default class RenderGroup extends RenderObject {
    constructor(ctx, speed) {
        super(ctx, speed, objectInfo, position)
        this.ctx = ctx
    }

    drawWaves(wavesList) {
        wavesList.forEach(waveObj => {
            const {waveId, size, position} = waveObj

            switch(waveId) {
                case 0:
                    RenderObject.drawObject('size64x64Wave', position)
                    break
                case 1:
                    RenderObject.drawObject('size64x64Weed', position)
                    break
                case 2:
                    RenderObject.drawObject('size128x64Wave', position)
                    break
                case 3:
                    RenderObject.drawObject('size128x64Weed', position)
                    break
                case 4:
                    RenderObject.drawObject('size192x64Wave', position)
                    break
                case 5:
                    RenderObject.drawObject('size192x64Weed', position)
                    break
            }
        })
    }
}