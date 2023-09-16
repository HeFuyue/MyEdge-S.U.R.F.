import {pubsub} from './event/index.js'
import {useStore} from './component/Component.js'

const $store = useStore()
const canvas = document.getElementById('game-canvas')
const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')
const setting = document.getElementById('setting')
const mask = document.getElementById('mask')

leftArrow.addEventListener('click', () => changePlayerId(-1))
rightArrow.addEventListener('click', () => changePlayerId(1))

const updateLife = pubsub.subscribe('life', 'any', value => {
    const lifeChildDOM = document.querySelectorAll('#heart div')

    for (let i = 0; i < lifeChildDOM.length; i++) {
        if (i < value) {
            lifeChildDOM[i].className = 'solid-heart'
        } else {
            lifeChildDOM[i].className = 'empty-heart'
        }
    }
})

const updateFlash = pubsub.subscribe('speedUp', 'any', value => {
    const flashChildDOM = document.querySelectorAll('#flash div')

    for (let i = 0; i < flashChildDOM.length; i++) {
        if (i < value) {
            flashChildDOM[i].className = 'solid-flash'
        } else {
            flashChildDOM[i].className = 'empty-flash'
        }
    }
})

const updateScore = pubsub.subscribe('score', 'any', value => {
    const scoreDOM = document.getElementById('score')
    scoreDOM.innerHTML = value
})

function changePlayerId(flag) {
    let playerId = $store.state.player.playerId
    if (playerId === 1 && flag < 0) {
        playerId = 9
    } else if (playerId === 9 && flag > 0) {
        playerId = 1
    } else {
        playerId += flag
    }
    $store.state.player.playerId = playerId
    console.log($store.state.player.playerId)
}

export function showSetting(flag) {
    setting.style.display = flag ? 'block' : 'none'
}

export function showArrow(flag) {
    leftArrow.style.display = flag ? 'block' : 'none'
    rightArrow.style.display = flag ? 'block' : 'none'
}

export function changeBackgroundPosition(num) {
    canvas.style.backgroundPositionX = -num + 'px'
    canvas.style.backgroundPositionY = -num + 'px'
}

export function showMask() {
    mask.style.display = 'block'
}

export function hideMask() {
    mask.style.display = 'none'
}

/* let num = 0
setInterval(() => {
    changeBackgroundPosition(num)
    num++
}, 10) */
