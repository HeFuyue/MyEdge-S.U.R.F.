import {canvas} from '../../index.js'
import {throttle} from '../utils/index.js'
import {useStore} from '../component/Component.js'
import { pubsub } from '../event/index.js'

const $store = useStore()

let centerX = $store.state.settings.canvasSize.width / 2
let centerY = $store.state.settings.canvasSize.height * 2 / 5
const forwardAreaDirection = 5.671
const forwardLeftAndRightAreaDirection = 1.732

let direction = 'forward'

let mouseControlFunc = throttle(e => {
    if ($store.state.control.direction === 'fallDown' || $store.state.control.direction === 'jumpingOff') return

    if (e.offsetY < centerY) {
        direction = 'pause'
    } else {
        direction = judgeDirection(e.offsetX, e.offsetY)
    }

    $store.dispatch('changeDirection', direction)
}, 100)

export function addMouseControl() {
    const pid = pubsub.subscribe('canvasSize', 'any', () => {
        centerX = $store.state.settings.canvasSize.width / 2
        centerY = $store.state.settings.canvasSize.height * 2 / 5
    })

    window.addEventListener('mousemove', mouseControlFunc)
}

export function removeMouseControl() {
    window.removeEventListener('mousemove', mouseControlFunc)
}

function judgeDirection(x, y) {
    if (isInsideArea(x, y, forwardAreaDirection)) {
        return 'forward'
    } else if (isInsideArea(x, y, forwardLeftAndRightAreaDirection)) {
        return x < centerX ? 'forwardLeft' : 'forwardRight'
    } else {
        return x < centerX ? 'leftForward' : 'rightForward'
    }
}

function isInsideArea(x, y, direction) {
    return y > direction * (x - centerX) + centerY && y > direction * (centerX - x) + centerY
}
