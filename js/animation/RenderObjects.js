import Animation from './Animation.js'
import {animationParameters, spriteSetting, spritePosition} from './constant.js'

const objectsImage = new Image()
objectsImage.src = 'assets/objects.png'

export default class RenderObjects extends Animation {
    static objectsImage = objectsImage

    constructor(ctx, params, speed) {
        super(speed)
        this.ctx = ctx
        this.init(params)

        /* if (params.type === 'group') {
            this.objects = params.objects
            this.pontoonPosition = params.pontoonPosition
            this.draw = this.renderGroup()
        } else {
            this.objectInfo = params.objectInfo
            this.position = params.position
            this.draw = this.render()
            console.log(this.draw)
        } */
    }

    init(params) {
        if (params.type === 'group') {
            this.objects = params.objects
            this.pontoonPosition = params.pontoonPosition
            this.draw = this.renderGroup()
        } else {
            this.objectInfo = params.objectInfo
            this.position = params.position
            this.draw = this.render()
            this.drawOnce = this.renderOnce()
        }
    }

    render() {
        let {style, id = null} = this.objectInfo
        /* let renderFunc = this.drawObject(style, id)
        
        return () => {
            this.gameFrame++
            renderFunc()
        } */

        return () => {
            this.gameFrame++
            this.drawObject(style, id)
            this.ctx.setLineDash([])
            this.ctx.strokeStyle = 'blue'
            this.ctx.lineWidth = 5
            this.ctx.strokeRect(this.position.x, this.position.y, spriteSetting[style].spriteWidth, spriteSetting[style].spriteHeight)
        }
    }

    renderOnce() {
        let {style, id = null} = this.objectInfo

        return () => {
            if (this.gameFrame < (animationParameters[style].totalFrames - 1) * animationParameters[style].staggerFrames) this.gameFrame++
            this.drawObject(style, id)
        }
    }

    renderGroup() {
        const {waves} = this.objects
        const waveRenderParams = this.drawGroupWaves(waves)
        const obstacleRenders = this.drawGroupObstacles()

        return () => {
            this.gameFrame++
            waveRenderParams.forEach(params => {
                this.drawObjectForGroup(params)
            })

            obstacleRenders.forEach(render => render.func())
        }
    }

    flushRender() {
        this.gameFrame = 0
        this.draw = this.render()
        this.drawOnce = this.renderOnce()
    }

    drawRipple(positionX, positionY) {
        const {spriteWidth, spriteHeight} = spriteSetting.ripple

        // return () => this.ctx.drawImage(objectsImage, this.getPosition('ripple') * spriteWidth, 0, spriteWidth, spriteHeight, positionX, positionY, spriteWidth, spriteHeight)
        this.ctx.drawImage(objectsImage, this.getPosition('ripple') * spriteWidth, 0, spriteWidth, spriteHeight, positionX, positionY, spriteWidth, spriteHeight)
    }

    drawStaticObject(positionX, positionY, style, id) {
        const {spriteWidth, spriteHeight, needDrawRipple} = spriteSetting[style]
    
        const spritePositionX = spritePosition[style][id].x * spriteWidth
        const spritePositionY = spritePosition[style][id].y * spriteHeight
    
        /* if (needDrawRipple) {
            const ripple = spriteHeight === 64 ? this.drawRipple(positionX - 15, positionY + 10) : this.drawRipple(positionX - 15, positionY + 64)
            return () => {
                ripple()
                this.ctx.drawImage(objectsImage, spritePositionX, spritePositionY, spriteWidth, spriteHeight, positionX, positionY, spriteWidth, spriteHeight)
            }
        } else {
            return () => this.ctx.drawImage(objectsImage, spritePositionX, spritePositionY, spriteWidth, spriteHeight, positionX, positionY, spriteWidth, spriteHeight)
        } */
    
        if (needDrawRipple) spriteHeight === 64 ? this.drawRipple(positionX - 15, positionY + 10) : this.drawRipple(positionX - 15, positionY + 64)

        this.ctx.drawImage(objectsImage, spritePositionX, spritePositionY, spriteWidth, spriteHeight, positionX, positionY, spriteWidth, spriteHeight)
        this.drawCrashArea('static', style, positionX, positionY)
    }

    drawAnimationObject(positionX, positionY, style) {
        const {spriteWidth, spriteHeight, needDrawRipple} = spriteSetting[style]
        let spritePositionX, spritePositionY

        if (needDrawRipple) this.drawAnimationObject('ripple', positionX - 15, positionY + 10)

        if (animationParameters[style].direction === 'horizontal') {
            spritePositionX = this.getPosition(style) * spriteWidth
            spritePositionY = animationParameters[style].spritePosition * spriteHeight
        } else {
            spritePositionX = animationParameters[style].spritePosition * spriteWidth
            spritePositionY = this.getPosition(style) * spriteHeight
        }

        // return () => this.ctx.drawImage(objectsImage, spritePositionX, spritePositionY, spriteWidth, spriteHeight, positionX, positionY, spriteWidth, spriteHeight)
        this.ctx.drawImage(objectsImage, spritePositionX, spritePositionY, spriteWidth, spriteHeight, positionX, positionY, spriteWidth, spriteHeight)
        this.drawCrashArea('animation', style, positionX, positionY)
    }

    drawObject(style, id) {
        const {isStatic} = spriteSetting[style]

        // return isStatic ? this.drawStaticObject(this.position.x, this.position.y, style, id) : this.drawAnimationObject(this.position.x, this.position.y, style)
        isStatic ? this.drawStaticObject(this.position.x, this.position.y, style, id) : this.drawAnimationObject(this.position.x, this.position.y, style)
    }

    drawObjectForGroup({style, position, id}) {
        const {isStatic} = spriteSetting[style]

        // return isStatic ? this.drawStaticObject(position.x, position.y, style, id) : this.drawAnimationObject(position.x, position.y, style)
        isStatic ? this.drawStaticObject(position.x, position.y, style, id) : this.drawAnimationObject(position.x, position.y, style)
    }

    drawCrashArea(category, style, positionX, positionY) {
        const {crashArea} = spriteSetting[style]

        if (category === 'static') {
            this.ctx.setLineDash([])
            this.ctx.strokeStyle = 'black'
        } else if (category === 'animation') {
            this.ctx.setLineDash([10, 10])
            this.ctx.strokeStyle = 'red'
        }
        this.ctx.lineWidth = 5
        this.ctx.strokeRect(positionX + crashArea.relativePositionX, positionY + crashArea.relativePositionY, crashArea.width, crashArea.height)
    }

    drawGroupWaves() {
        const wavesList = this.objects.waves
        const waveRenders = []

        wavesList.forEach(waveObj => {
            const {waveId, position} = waveObj

            switch(waveId) {
                case 0:
                    waveRenders.push({style: 'size64x64Wave', position})
                    break
                case 1:
                    waveRenders.push({style: 'size64x64Weed', position})
                    break
                case 2:
                    waveRenders.push({style: 'size128x64Wave', position})
                    break
                case 3:
                    waveRenders.push({style: 'size128x64Weed', position})
                    break
                case 4:
                    waveRenders.push({style: 'size192x64Wave', position})
                    break
                case 5:
                    waveRenders.push({style: 'size192x64Weed', position})
                    break
            }
        })

        return waveRenders
    }

    drawGroupObstacles() {
        const obstacles = [...this.objects.obstacles, ...this.objects.bonus]
        console.log(obstacles)
        const renders = []
    
        obstacles.forEach(obstacle => {
            if (obstacle.pontoonId !== undefined) {
                const absolutePositionX =  obstacle.relativePosition.x  + this.pontoonPosition.x
                const absolutePositionY = obstacle.relativePosition.y + this.pontoonPosition.y
                const botPosition = absolutePositionY + obstacle.size.height
                const style = obstacle.size.height === 128 ? 'size64x128Pontoon' : 'size64x64Pontoon'
                renders.push({
                    compareFlag: botPosition,
                    func: () => {
                        this.ctx.drawImage(objectsImage, obstacle.spritePosition.x * obstacle.size.width, obstacle.spritePosition.y * obstacle.size.height, obstacle.size.width, obstacle.size.height, absolutePositionX, absolutePositionY, obstacle.size.width, obstacle.size.height)
                        this.drawCrashArea('static', style, absolutePositionX, absolutePositionY)
                    }
                })
            } else if (obstacle.obstacleId !== undefined) {
                const botPosition = obstacle.position.y + obstacle.size.height
                renders.push({
                    compareFlag: botPosition,
                    func: () => this.drawObjectForGroup({id: obstacle.obstacleId, ...obstacle})
                })
            } else if (obstacle.style === 'jumpingBoard') {
                const botPosition = obstacle.position.y + obstacle.size.height
                renders.push({
                    compareFlag: botPosition,
                    func: () => this.drawObjectForGroup({...obstacle})
                })
            }
        })
    
        // console.log(renders)
        renders.sort((prev, next) => prev.compareFlag - next.compareFlag)
    
        return renders
    }
}
