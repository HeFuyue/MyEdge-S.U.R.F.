import {useStore} from './js/component/Component.js'

export const canvas = document.getElementById('game-canvas')
export const ctx = canvas.getContext("2d")

export const backgroundCanvas = document.getElementById('background-canvas')
export const bgctx = backgroundCanvas.getContext("2d")

export const playerCanvas = document.getElementById('player-canvas')
export const playerctx = playerCanvas.getContext("2d")

export const offscreenCanvas = document.createElement('canvas')
export const offscreen = offscreenCanvas.transferControlToOffscreen()
export const ofsctx = offscreen.getContext("2d")

const $store = useStore()
$store.state.settings.ctx = ctx
$store.state.settings.bgctx = bgctx
$store.state.settings.ofsctx = ofsctx
$store.state.settings.playerctx = playerctx
