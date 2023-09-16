import RenderPlayer from './animation/RenderPlayer.js'
import {useStore} from './component/Component.js'
import {pubsub} from './event/index.js'
import {showSetting, showArrow} from './game-ui.js'

const $store = useStore()
const ctx = $store.state.settings.ctx
let CANVAS_WIDTH = $store.state.settings.canvasSize.width
let CANVAS_HEIGHT = $store.state.settings.canvasSize.height
let playerId = $store.state.player.playerId
let req

const playerImage = new Image()
playerImage.src = './assets/player.png'

const animations = []

for (let i = 0; i < 5; i++) {
    let renderConfigs = {
        playerInfo: {
            playerId: playerId + i - 2,
            direction: 'forward'
        },
        isStatic: i === 2 ? false : true,
        drawPosition: {
            x: CANVAS_WIDTH / 2 + (i - 2) * 100 - (i > 2 ? 160 - (i * 20) : (i * 20) + 80) / 2,
            y: CANVAS_HEIGHT / 2 - (i > 2 ? 110 - (i * 10) : (i * 10) + 70)
        }, 
        size: {
            x: i > 2 ? 160 - (i * 20) : (i * 20) + 80,
            y: i > 2 ? 160 - (i * 20) : (i * 20) + 80
        }
    }

    animations.push(new RenderPlayer(ctx, renderConfigs))
}

const pid1 = pubsub.subscribe('canvasSize', 'any', value => {
    for (let i = 0; i < animations.length; i++) {
        animations[i].position.x = value.width / 2 + (i - 2) * 100 - (i > 2 ? 160 - (i * 20) : (i * 20) + 80) / 2,
        animations[i].position.y = value.height / 2 - (i > 2 ? 110 - (i * 10) : (i * 10) + 70)
    }
})

const pid2 = pubsub.subscribe('playerId', 'any', value => {
    for (let i = 0; i < animations.length; i++) {
        let newValue = value + i - 2
        if (newValue > 9) newValue -= 9
        if (newValue < 1) newValue += 9

        animations[i].playerInfo.playerId = newValue
    }
})

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    animations.forEach(animation => animation.draw())
    req = requestAnimationFrame(animate)
}

export function mountFirstScreen() {
    ctx.canvas.style.backgroundImage = "url(/src/assets/bg.png)"
    animate()
    showSetting(true)
    showArrow(true)
}

export function unmountFirstScreen() {
    ctx.canvas.style.backgroundImage = "none"
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    cancelAnimationFrame(req)
    showSetting(false)
    showArrow(false)
}
