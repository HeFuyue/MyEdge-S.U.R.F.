import Animation from './Animation.js'
import {animationParameters, playerStatus} from './constant.js'

const playerImage = new Image()
playerImage.src = 'assets/player.png'

export default class RenderPlayer extends Animation {
    static spriteWidth = 64
    static spriteHeight = 64
    static playerImage = playerImage

    constructor(ctx, params, speed) {
        super(speed)
        this.ctx = ctx
        this.playerInfo = params.playerInfo
        this.position = params.drawPosition
        this.crashArea = params.crashArea
        this.size = params.size || {x: RenderPlayer.spriteWidth, y: RenderPlayer.spriteHeight}

        if (Array.isArray(params)) {
            this.draw = this.drawingBoard(params)
        } else {
            if(params.isStatic) {
                this.draw = this.drawStatic(params)
            } else if (params.isPlayerStatic) {
                this.draw = this.drawStaticPlayer(params)
            } else {
                this.draw = this.drawAnimation(params)
            }
        }
    }

    getFrameByPosition(type) {
        const direction = animationParameters[type].direction
        return this.getPosition(type) * (direction === 'horizontal' ? RenderPlayer.spriteWidth : RenderPlayer.spriteHeight)
    }

    drawStatic() {
        return () => {
            this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y)
            this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, (this.playerInfo.playerId + 3) * RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y)
        }
    }

    drawStaticPlayer() {
        return () => {
            this.gameFrame += this.speed
            this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, this.getFrameByPosition('surfBoardY'), RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y)
            this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, (this.playerInfo.playerId + 3) * RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y)

            if (this.crashArea) {
                this.ctx.setLineDash([])
                this.ctx.fillStyle = 'black'
                this.ctx.lineWidth = 5
                this.ctx.strokeRect(this.crashArea.position.x, this.crashArea.position.y, this.crashArea.size.width, this.crashArea.size.height)
            }
        }
    }

    drawAnimation() {
        return () => {
            this.gameFrame += this.speed
            this.ctx.drawImage(RenderPlayer.playerImage, this.getFrameByPosition('surfBoardX'), this.getFrameByPosition('surfBoardY'), RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y)
            this.ctx.drawImage(RenderPlayer.playerImage, this.getFrameByPosition('player'), (this.playerInfo.playerId + 3) * RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y)
        }
    }

    changePlayer(flag) {
        if (this.playerInfo.playerId === 1 && flag < 0) {
            this.playerInfo.playerId = 7
        } else if (this.playerInfo.playerId === 7 && flag > 0) {
            this.playerInfo.playerId = 1
        } else {
            this.playerInfo.playerId += flag
        }
    }

    changePlayerStatus(status) {
        this.playerInfo.direction = status
    }

    drawingBoard(elements) {
        const drawings = []
        elements.forEach(params => {
            const {playerInfo, isStatic, isPlayerStatic} = params
            if (isStatic) {
                drawings.push(() => this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y))
                drawings.push(() => this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, (playerInfo.playerId + 3) * RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y))
            } else if (isPlayerStatic) {
                drawings.push(() => this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, this.getFrameByPosition('surfBoardY'), RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y))
                drawings.push(() => this.ctx.drawImage(RenderPlayer.playerImage, playerStatus[this.playerInfo.direction] * RenderPlayer.spriteWidth, (playerInfo.playerId + 3) * RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y))
            } else {
                drawings.push(() => this.ctx.drawImage(RenderPlayer.playerImage, this.getFrameByPosition('surfBoardX'), this.getFrameByPosition('surfBoardY'), RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y))
                drawings.push(() => this.ctx.drawImage(RenderPlayer.playerImage, this.getFrameByPosition('player'), (playerInfo.playerId + 3) * RenderPlayer.spriteHeight, RenderPlayer.spriteWidth, RenderPlayer.spriteHeight, this.position.x, this.position.y, this.size.x, this.size.y))
            }
        })

        return () => {
            this.gameFrame += this.speed
            drawings.forEach(draw => draw())
        }
    }
}
