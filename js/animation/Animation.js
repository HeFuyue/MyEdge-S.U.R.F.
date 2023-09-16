import {animationParameters} from './constant.js'

export default class Animation {
    constructor(speed = 1) {
        this.speed = speed
        this.gameFrame = 0
        this.currentFrame = 0
    }

    flushFrame(type) {
        const staggerFrames = animationParameters[type].staggerFrames
        return Math.floor(this.gameFrame / staggerFrames)
    }
    
    _positionOfSingleWaySpriteAnimation(totalFrames, startPosition) {
        return this.currentFrame % totalFrames + startPosition
    }
    
    _positionOfRoundTripSpriteAnimation(totalFrames, startPosition) {
        return Math.pow(-1, Math.floor((this.currentFrame - 1) / (totalFrames - 1))) * (this.currentFrame - Math.floor((this.currentFrame + totalFrames - 2) / (2 * (totalFrames - 1))) * (2 * (totalFrames - 1))) + startPosition
    }

    getPosition(type) {
        const {startPosition, totalFrames, style} = animationParameters[type]
        this.currentFrame = this.flushFrame(type)
        if (style === 'singleWay') {
            return this._positionOfSingleWaySpriteAnimation(totalFrames, startPosition)
        } else if (style === 'roundTrip') {
            return this._positionOfRoundTripSpriteAnimation(totalFrames, startPosition)
        }
    }
}
