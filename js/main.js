import {Component, Player, GameObject, Wave, Group, useStore, RandomPlayer} from './component/Component.js'
import RenderPlayer from './animation/RenderPlayer.js'
import {pubsub} from './event/index.js'
import {addMouseControl, removeMouseControl} from './control/index.js'
import {drawBackground, backgroundImage} from './canvas-setting.js'
import {spriteCategory, spriteSetting} from './animation/constant.js'
import { detectCrash } from './crash/index.js'
import { gameOver } from './state/index.js'

const $store = useStore()
const ctx = $store.state.settings.ctx
const bgctx = $store.state.settings.bgctx
const playerctx = $store.state.settings.playerctx
let player = new Player()
let group = new Group()
let octopus = new GameObject('octopusChase')
let randomPlayer = new RandomPlayer(1)
octopus.direction = {x: 0, y: 0}
let backgroundPositionX = 0
let backgroundPositionY = 0
let gameSpeed = $store.state.control.gameSpeed
let gameFrame = 0
let genObstacleFrame = 1000
let genGroupFrame = 0
let genWavesFrame = 1000
let updateObstacleFrame = 1000
let genRandomPlayerFrame = 500
let fallDownBufferingFrame = 0
let jumpingOffFrame = undefined
let countJumpingShadowFrame = 0
let countFrame = 0
let randomPlayerChangeDirectionFrame = 100
let randomPlayerAvoidCrashCheckFrame = 0
let randomPlayerSpeed = 3
let octopusStartChasing = false
let octopusCountingFrame = 0
let octopusCrashingObjectFrame = 0
let octopusCrashedObjectArr = []
let isGameOver = false
let x = 0
let {flagX, flagY} = genDirection(player.$store.state.control.direction)
let shouldStopAnimation = false
let req

$store.collocation.group = group

console.log($store)
console.log(group)
console.log(octopus)

function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    bgctx.clearRect(0, 0, bgctx.canvas.width, bgctx.canvas.height)
    playerctx.clearRect(0, 0, playerctx.canvas.width, playerctx.canvas.height)
    drawBackground(bgctx, backgroundImage, backgroundPositionX, backgroundPositionY)
    player.render()
    changeSpeed()
    addCrashCheck()
    handlePlayerFallDown()
    handlePlayerJumpingOff()
    addRandomObstacle()
    addRandomWave()
    addGroup()
    addOctopus()
    gameObjDispatchingCenter()
    genRandomPlayer()

    backgroundPositionX += flagX * gameSpeed
    backgroundPositionY += flagY * gameSpeed

    player.$store.dispatch('changeScore', gameSpeed)
    gameFrame += Math.floor(gameSpeed)

    req = requestAnimationFrame(animate)
}

function changeSpeed() {
    if (player.$store.state.control.status === 'freeze' || player.$store.state.control.direction === 'fallDown' || player.$store.state.control.direction === 'defeated') {
        gameSpeed = 0
        return
    } else if (player.$store.state.control.direction === 'jumpingOff') {
        gameSpeed = 7
        return
    } else if (player.$store.state.control.status === 'unfreeze') {
        gameSpeed = player.$store.state.control.gameSpeed
    }

    if (player.$store.state.control.direction === 'pause') {
        gameSpeed =  0
    } else {
        gameSpeed += 0.02
    }

    if (gameSpeed >= 5) gameSpeed = 5

    if ($store.state.control.gameSpeed !== gameSpeed) $store.dispatch('changeGameSpeed', gameSpeed)
}

function genDirection(direction) {
    let flagX, flagY
    switch (direction) {
        case 'forward':
            flagX = 0
            flagY = 1
            break
        case 'forwardLeft':
            flagX = -0.173
            flagY = 0.985
            break
        case 'forwardRight':
            flagX = 0.173
            flagY = 0.985
            break
        case 'leftForward':
            flagX = -0.5
            flagY = 0.866
            break
        case 'rightForward':
            flagX = 0.5
            flagY = 0.866
            break
        case 'pause':
            flagX = 0
            flagY = 0
            break
        case 'fallDown':
            flagX = 0
            flagY = 0
            break
        case 'defeated':
            flagX = 0
            flagY = 0
            break
        case 'jumpingOff':
            flagX = 0
            flagY = 1
            break
    }
    return {flagX, flagY}
}

function reverseDirection(direction) {
    switch(direction) {
        case 'forward':
            return Math.floor(Math.random()) === 1 ? 'leftForward' : 'rightForward'
        case 'leftForward':
            return 'rightForward'
        case 'forwardLeft':
            return 'forwardRight'
        case 'rightForward':
            return 'leftForward'
        case 'forwardRight':
            return 'forwardLeft'
    }
}

function genRandomObstacle(gameObject) {
    // if (gameFrame <= genObstacleFrame) return

    const obstacleChosen = spriteCategory.obstacles[Math.floor(Math.random() * spriteCategory.obstacles.length)]
    const obstacleName = obstacleChosen.name
    const id = Math.floor(Math.random() * obstacleChosen.range)

    if (!gameObject) {
        return new GameObject(obstacleName, id)
    } else {
        console.log(gameObject.style, gameObject.objectId, obstacleName, id)
        gameObject.init({objectInfo: {style: obstacleName, id}})
    }
}

function genRandomWave(wave) {
    const newWaveStyle = spriteCategory.waves[Math.floor(Math.random() * spriteCategory.waves.length)]

    if (!wave) {
        return new Wave(newWaveStyle)
    } else {
        wave.init({objectInfo: {style: newWaveStyle}})
    }
}

function checkPlayerCrashingObject(deps, type = 'gameObject') {
    if (type === 'gameObject') {
        // console.log('#')
        Object.values(deps).forEach(dep => {
            if (detectCrash(player.crashArea, dep.genCrashArea())) {
                if (dep.type === 'group') {
                    return checkPlayerCrashingObject(dep.genGroupDeps(), 'group')
                } else {
                    console.log('crash---player')
                    if (dep.type === 'obstacle' || dep.type === 'randomPlayer') {
                        player.$store.dispatch('changeDirection', 'fallDown')
                        player.$store.dispatch('changeGameSpeed', 0)
                        player.$store.dispatch('decreaseLife')
                        fallDownBufferingFrame = gameFrame + 200
                    } else if (dep.type === 'wave') {
                        if (dep.style === 'whirlpool') {
                            console.log('wave---changeDirection')
                            if (!dep.ignoreCrashCheck) {
                                dep.ignoreCrashCheck = true
                                $store.dispatch('changeDirection', reverseDirection($store.state.control.direction))
                            }
                        } else {
                            console.log('wave---slowdown')
                            if (gameSpeed > 3) {
                                player.$store.dispatch('changeGameSpeed', gameSpeed - 0.5)
                            } else if (gameSpeed > 1) {
                                player.$store.dispatch('changeGameSpeed', gameSpeed - 0.1)
                            } else if (gameSpeed > 0) {
                                player.$store.dispatch('changeGameSpeed', gameSpeed - 0.01)
                            }
                        }
                    }
                }
            }
        })
    } else if (type === 'group') {
        // console.log('@')
        const playerRelativeCrashArea = {
            position: {
                x: player.crashArea.position.x - group.position.x,
                y: player.crashArea.position.y - group.position.y
            },
            size: player.crashArea.size
        }

        Object.values(deps).forEach(dep => {

            if (detectCrash(playerRelativeCrashArea, dep.crashArea)) {
                console.log('crash---player')
                if (dep.type === 'obstacle') {
                    player.$store.dispatch('changeDirection', 'fallDown')
                    player.$store.dispatch('changeGameSpeed', 0)
                    player.$store.dispatch('decreaseLife')
                    fallDownBufferingFrame = gameFrame + 200
                } else if (dep.type === 'wave') {
                    console.log('wave---slowdown')
                    if (gameSpeed > 3) {
                        player.$store.dispatch('changeGameSpeed', gameSpeed - 0.5)
                    } else if (gameSpeed > 1) {
                        player.$store.dispatch('changeGameSpeed', gameSpeed - 0.1)
                    } else if (gameSpeed > 0) {
                        player.$store.dispatch('changeGameSpeed', gameSpeed - 0.01)
                    }
                } else if (dep.type === 'bonus') {
                    if (dep.style === 'jumpingBoard') {
                        player.$store.dispatch('changeGameSpeed', 7)
                        player.$store.dispatch('changeDirection', 'jumpingOff')
                        jumpingOffFrame = gameFrame + 1000
                    }
                }
            }
        })
    }
}

function addCrashCheck() {
    if (($store.state.control.direction !== 'fallDown' && gameFrame > fallDownBufferingFrame && $store.state.control.direction !== 'jumpingOff' && !isGameOver)) {
        countJumpingShadowFrame = 0
        checkPlayerCrashingObject(player.deps)
    }

    if ($store.state.settings.life === 0 && !isGameOver) {
        isGameOver = true
        gameOver()
        gameSpeed = 0
    }
}

function handlePlayerFallDown() {
    if (isGameOver) return

    if ($store.state.control.direction === 'fallDown' || $store.state.control.direction === 'defeated') {
        countFrame++
        if (countFrame > 100) {
            console.log('changeToReady')
            $store.dispatch('changeDirection', 'defeated')
        }

    } else if (gameFrame < fallDownBufferingFrame) {
        countFrame++
    } else {
        countFrame = 0
        $store.state.settings.playerctx.globalAlpha = 1
    }

    if (countFrame > 0) {
        if (Math.floor(countFrame / 20) % 2 === 1) {
            $store.state.settings.playerctx.globalAlpha = 0.5
        } else {
            $store.state.settings.playerctx.globalAlpha = 0.8
        }
    }
}

function handlePlayerJumpingOff() {
    if (jumpingOffFrame) {
        if (gameFrame > jumpingOffFrame) {
            $store.dispatch('changeDirection', 'forward')
            $store.dispatch('changeGameSpeed', 5)
            jumpingOffFrame = undefined
        }
    }

    if ($store.state.control.direction === 'jumpingOff') {
        console.log('jumpingOff')
        console.log(countJumpingShadowFrame)
        countJumpingShadowFrame++
        let shadowPositionY = 0
        let shadowRadius = 0
        let opacity = 0

        if (countJumpingShadowFrame > 110 && countJumpingShadowFrame <= 140) {
            shadowPositionY = player.position.y + 80 - (countJumpingShadowFrame - 110) * 8 / 3
            shadowRadius = 10 - (countJumpingShadowFrame - 110) / 3
            opacity = 0.3 - (countJumpingShadowFrame - 110) / 100
        } else if (countJumpingShadowFrame < 30) {
            shadowPositionY = player.position.y + countJumpingShadowFrame * 8 / 3
            shadowRadius = countJumpingShadowFrame / 3
            opacity = countJumpingShadowFrame / 100
        } else if (countJumpingShadowFrame >= 30 && countJumpingShadowFrame <= 110) {
            shadowPositionY = player.position.y + 80
            shadowRadius = 10
            opacity = 0.3
        }

        playerctx.beginPath()
        playerctx.ellipse(player.position.x + 32, shadowPositionY, shadowRadius * 2, shadowRadius, 0, 0, 2 * Math.PI)
        playerctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        playerctx.fill()
    }
}

function addRandomObstacle() {
    let newGameObject
    if ($store.collocation.gameObjects.length < 10 && gameFrame >= genObstacleFrame) {
        newGameObject = genRandomObstacle()
        $store.collocation.gameObjects.push(newGameObject)
        $store.collocation.dispatchingQueue.push(newGameObject)
        genObstacleFrame = gameFrame + Math.floor(Math.random() * 1000) + 1000
        updateObstacleFrame = genObstacleFrame + 1000
    }
    if (gameFrame >= updateObstacleFrame && $store.collocation.gameObjects.length === 10) {
        newGameObject = $store.collocation.gameObjects[Math.floor(Math.random() * 10)]
        if (newGameObject.status === 'prepared') $store.collocation.dispatchingQueue.push(newGameObject)
        updateObstacleFrame = gameFrame + Math.floor(Math.random() * 1000) + 1000
    }
}

function addRandomWave() {
    let newWave
    if ($store.collocation.waves.length < 5 && gameFrame > genWavesFrame) {
        newWave = genRandomWave()
        console.log(newWave)
        $store.collocation.waves.push(newWave)
        $store.collocation.dispatchingQueue.push(newWave)
        genWavesFrame = gameFrame + Math.floor(Math.random() * 500) + 500
    } else if ($store.collocation.waves.length === 5 && gameFrame > genWavesFrame) {
        genWavesFrame = gameFrame + Math.floor(Math.random() * 500) + 500
        newWave = $store.collocation.waves[Math.floor(Math.random() * 5)]
        if (newWave.status === 'prepared') $store.collocation.dispatchingQueue.push(newWave)
    }
}

function addOctopus() {
    let octopusSpeed

    if (octopusStartChasing) {
        octopusCountingFrame++
        octopusCrashingObjectFrame--

        if (octopusCountingFrame < 50 || octopusCrashingObjectFrame > 0) {
            octopusSpeed = 3 - gameSpeed
        } else if (octopus.position.y < 0) {
            octopusSpeed = 3
        } else {
            octopusSpeed = 5 - gameSpeed
        }

        if (octopusCrashedObjectArr.length === 3) {
            octopus.position.x -= flagX * gameSpeed
            octopus.position.y -= flagY * gameSpeed
        } else if (!isGameOver) {
            octopus.position.x += octopus.direction.x * Math.abs(octopusSpeed) + Math.sin(x / 20) * 3
            octopus.position.y += octopus.direction.y * octopusSpeed
        } else {
            octopus.position.x += octopus.direction.x * 10
            octopus.position.y += octopus.direction.y * 10
        }

        x++
        if (!isGameOver) {
            octopus.render()
        } else {
            octopus.renderOnce()
        }
    
        // if (flagY === 0) {
        octopus.direction.x = (player.position.x - octopus.position.x - 32) / Math.sqrt(Math.pow((octopus.position.x - player.position.x - 32), 2) + Math.pow((octopus.position.y - player.position.y - 32), 2))
        octopus.direction.y = (player.position.y - octopus.position.y - 64) / Math.sqrt(Math.pow((octopus.position.x - player.position.x - 64), 2) + Math.pow((octopus.position.y - player.position.y - 64), 2))
        /* } else {
            octopus.direction.x = flagX
            octopus.direction.y = flagY
        } */

        let depHasCollected = false

        if (isGameOver) return

        Object.values(octopus.deps).forEach(dep => {
            if (detectCrash({position: octopus.position, size: octopus.size}, dep.genCrashArea())) {
                if (dep.type === 'randomPlayer') return
                if (dep.type === 'group') {
                    const octopusRelativeCrashArea = {
                        position: {
                            x: octopus.position.x - group.position.x,
                            y: octopus.position.y - group.position.y
                        },
                        size: octopus.size
                    }
                
                    Object.values(dep.genGroupDeps()).forEach(dep => {
                        if (detectCrash(octopusRelativeCrashArea, dep.crashArea)) {
                            if (dep.type === 'obstacle') {
                                console.log('octopus---obstacle---crash')
                                octopusCrashingObjectFrame = 100
                                octopusCrashedObjectArr.forEach(crashed => {
                                    if (crashed.groupObjectId === dep.groupObjectId) depHasCollected = true
                                })
                                if (!depHasCollected) octopusCrashedObjectArr.push(dep)
                            }
                        }
                    })
                } else {
                    if (dep.type === 'obstacle') {
                        console.log('randomPlayer---obstacle---crash')
                        octopusCrashingObjectFrame = 100
                        octopusCrashedObjectArr.forEach(crashed => {
                            if (crashed.objectId === dep.objectId) depHasCollected = true
                        })
                        if (!depHasCollected) octopusCrashedObjectArr.push(dep)
                    }
                }
            }
        })

        if (detectCrash({position: octopus.position, size: octopus.size}, player.crashArea) && !isGameOver) {
            console.log('player---obstacle---crash')
            octopus.draw.objectInfo = {style: 'octopusCatch'}
            octopus.flushRender()
            player.$store.dispatch('changeDirection', 'defeated')
            gameSpeed = 0
            isGameOver = true
            gameOver()
        }
    }
    
}

function addGroup() {
    $store.state.settings.ctx.setLineDash([])
    $store.state.settings.ctx.strokeStyle = 'pink'
    $store.state.settings.ctx.lineWidth = 5
    $store.state.settings.ctx.strokeRect(group.position.x, group.position.y, group.size.width, group.size.height)

    if (gameFrame > genGroupFrame && group.status === 'ready') {
        genGroupFrame = gameFrame + 1000
        $store.collocation.dispatchingQueue.push(group)
    }
}

function gameObjDispatchingCenter() {
    let isCrash = false
    if ($store.collocation.dispatchingQueue.length && !isGameOver) {
        const gameObject = $store.collocation.dispatchingQueue[0]
        Object.values(gameObject.deps).forEach(dep => {
            if (dep.type === 'randomPlayer') return
            if (detectCrash({position: gameObject.position, size: gameObject.size}, {position: dep.position, size: dep.size})) {
                console.log('initial---crash---detected')
                isCrash = true
            }
        })

        if (!isCrash) {
            gameObject.isShow = true
            gameObject.deps[gameObject.id] = gameObject
            $store.collocation.activeQueue.push(gameObject)
            $store.collocation.dispatchingQueue.shift()
        }
    }

    let inActiveObjects = []

    if ($store.collocation.activeQueue.length) {
        for (let i = 0; i < $store.collocation.activeQueue.length; i++) {
            let gameObject = $store.collocation.activeQueue[i]
            if (gameObject.type === 'group') {
                gameObject.renderGroupFromOffscreen()
            } else {
                gameObject.render()
            }
            gameObject.position.x -= flagX * gameSpeed
            gameObject.position.y -= flagY * gameSpeed

            if (gameObject.position.y < -gameObject.size.height) {
                inActiveObjects.push(i)
                delete gameObject.deps[gameObject.id]
                gameObject.isShow = false
                gameObject.status = 'used'
                if (gameObject.type === 'obstacle') {
                    genRandomObstacle(gameObject)
                } else if (gameObject.type === 'wave') {
                    genRandomWave(gameObject)
                } else if (gameObject.type === 'group') {
                    gameObject.init()
                    /* if (gameObject.needOctopus) {
                        octopusStartChasing = true
                    } */
                }
                gameObject.status = 'prepared'
            }

            if (gameObject.needOctopus && !octopusStartChasing) {
                if (gameObject.position.y && gameObject.objects.obstacles[0].position.y + gameObject.position.y < 0) {
                    octopus.position.x = gameObject.objects.obstacles[0].position.x + gameObject.position.x
                    octopus.position.y = -64
                    gameObject.objects.obstacles.shift()
                    gameObject.render.init(gameObject)
                    octopusStartChasing = true
                }
            }
        }

        let count = 0

        for (let i = 0; i < inActiveObjects.length; i++) {
            $store.collocation.activeQueue.splice(inActiveObjects[i] - count, 1)
            count++
        }

        inActiveObjects = []
    }
}

function genRandomPlayer() {
    if (gameFrame > genRandomPlayerFrame) {
        randomPlayer.isShow = true
        randomPlayer.deps[randomPlayer.id] = randomPlayer
    }

    if (randomPlayer.isShow) {
        randomPlayer.render()
        randomPlayerSurf()

        if (randomPlayer.position.y > 1000 || randomPlayer.position.y < -1000) {
            randomPlayer.isShow = false
            randomPlayer.init(Math.floor(Math.random() * 4) + 1)
            randomPlayer.flushRender()
            delete randomPlayer.deps[randomPlayer.id]
            genRandomPlayerFrame = gameFrame + 1000
        }
    }
}

function randomPlayerSurf() {

    if (randomPlayer.direction === 'fallDown') {
        randomPlayerChangeDirectionFrame += randomPlayer.changeDirectionFromFallDownFrame
        randomPlayer.changeDirectionFromFallDownFrame = 0
    }

    if (randomPlayer.changeDirectionFrame > randomPlayerChangeDirectionFrame) {
        if (randomPlayer.direction === 'left') {
            randomPlayer.direction = 'right'
        } else if (randomPlayer.direction === 'right') {
            randomPlayer.direction = 'left'
        } else if (randomPlayer.direction === 'fallDown') {
            randomPlayer.direction = 'left'
            randomPlayer.changeDirectionFromFallDownFrame = 50
        }
        randomPlayer.objectInfo.id = randomPlayer.direction
        randomPlayer.flushRender()
        randomPlayerChangeDirectionFrame += 100
    } else {
        randomPlayer.changeDirectionFrame++
    }

    if (randomPlayer.direction === 'left') {
        randomPlayer.position.x += (genDirection('forwardLeft').flagX - flagX) * randomPlayerSpeed
        randomPlayer.position.y += genDirection('forwardLeft').flagY * (randomPlayerSpeed - gameSpeed)
    } else if (randomPlayer.direction === 'right') {
        randomPlayer.position.x += (genDirection('forwardRight').flagX - flagX) * randomPlayerSpeed
        randomPlayer.position.y += genDirection('forwardRight').flagY * (randomPlayerSpeed - gameSpeed)
    } else if (randomPlayer.direction === 'fallDown') {
        randomPlayer.position.x -=  flagX * gameSpeed
        randomPlayer.position.y -=  flagY * gameSpeed
    }

    if (gameFrame > randomPlayerAvoidCrashCheckFrame && !isGameOver) {
        Object.values(randomPlayer.deps).forEach(dep => {
            if (dep.type === 'randomPlayer') return
            if (detectCrash(randomPlayer.genCrashArea(), dep.genCrashArea())) {
                if (dep.type === 'group') {
                    const randomPlayerRelativeCrashArea = {
                        position: {
                            x: randomPlayer.genCrashArea().position.x - group.position.x,
                            y: randomPlayer.genCrashArea().position.y - group.position.y
                        },
                        size: randomPlayer.genCrashArea().size
                    }
            
                    Object.values(dep.genGroupDeps()).forEach(dep => {
                        if (detectCrash(randomPlayerRelativeCrashArea, dep.crashArea)) {
                            if (dep.type === 'obstacle') {
                                console.log('randomPlayer---obstacle---crash')
                                randomPlayer.direction = 'fallDown'
                                randomPlayer.objectInfo.id = 'fallDown'
                                randomPlayer.flushRender()
                                randomPlayerAvoidCrashCheckFrame = gameFrame + 200
                            } else if (dep.type === 'wave') {
                                console.log('randomPlayer---wave---crash')
                                if (dep.style === 'whirlpool') {
                                    if (randomPlayer.direction === 'left') {
                                        randomPlayer.direction = 'right'
                                    } else if (randomPlayer.direction === 'right') {
                                        randomPlayer.direction = 'left'
                                    }
                                } else {
                                    randomPlayerSpeed -= 0.05
                                }
                            }
                        }
                    })
                } else {
                    if (dep.type === 'obstacle') {
                        console.log('randomPlayer---obstacle---crash')
                        randomPlayer.direction = 'fallDown'
                        randomPlayer.objectInfo.id = 'fallDown'
                        randomPlayer.flushRender()
                        randomPlayerAvoidCrashCheckFrame = gameFrame + 200
                    } else if (dep.type === 'wave') {
                        console.log('randomPlayer---wave---crash')
                        if (dep.style === 'whirlpool') {
                            if (randomPlayer.direction === 'left') {
                                randomPlayer.direction = 'right'
                            } else if (randomPlayer.direction === 'right') {
                                randomPlayer.direction = 'left'
                            }
                        } else {
                            randomPlayerSpeed -= 0.05
                        }
                    }
                }
            } else {
                randomPlayerSpeed = 3
            }
        })
    }
}

const pid1 = pubsub.subscribe('canvasSize', 'any', value => {
    console.log(value.width / 2, value.height / 2)
    player.$store.collocation.player.position.x = value.width / 2 - RenderPlayer.spriteWidth / 2
    player.$store.collocation.player.position.y = value.height * 2 / 5 - RenderPlayer.spriteHeight / 2
})

const pid2 = pubsub.subscribe('playerId', 'any', value => {
    console.log(value)
    player.$store.collocation.player.playerInfo.playerId = value
})

const pid3 = pubsub.subscribe('direction', 'any', value => {
    player.playerInfo.direction = value
    flagX = genDirection(value).flagX
    flagY = genDirection(value).flagY
})

function initMainGame() {
    player = new Player()
    group = new Group()
    octopus = new GameObject('octopusChase')
    randomPlayer = new RandomPlayer(1)
    octopus.direction = {x: 0, y: 0}
    backgroundPositionX = 0
    backgroundPositionY = 0
    gameSpeed = $store.state.control.gameSpeed
    gameFrame = 0
    genObstacleFrame = 1000
    genGroupFrame = 0
    genWavesFrame = 1000
    updateObstacleFrame = 1000
    genRandomPlayerFrame = 500
    fallDownBufferingFrame = 0
    jumpingOffFrame = undefined
    countJumpingShadowFrame = 0
    countFrame = 0
    randomPlayerChangeDirectionFrame = 100
    randomPlayerAvoidCrashCheckFrame = 0
    randomPlayerSpeed = 3
    octopusStartChasing = false
    octopusCountingFrame = 0
    octopusCrashingObjectFrame = 0
    octopusCrashedObjectArr = []
    isGameOver = false
    x = 0
    flagX = genDirection(player.$store.state.control.direction).flagX
    flagY = genDirection(player.$store.state.control.direction).flagY
}

export function mountMainGame() {
    shouldStopAnimation = false
    animate()
    addMouseControl()
}

export function unmountMainGame() {
    cancelAnimationFrame(req)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    bgctx.clearRect(0, 0, bgctx.canvas.width, bgctx.canvas.height)
    playerctx.clearRect(0, 0, playerctx.canvas.width, playerctx.canvas.height)
    let ofsctx = $store.state.settings.ofsctx
    ofsctx.clearRect(0, 0, ofsctx.canvas.width, ofsctx.canvas.height)
    Component.clearDeps()
    Component.flushStore()
    initMainGame()
}

export function pauseMainGame() {
    $store.dispatch('changeGameStatus', 'freeze')
    removeMouseControl()
    gameSpeed = 0
}

export function restartFromPause() {
    $store.dispatch('changeGameStatus', 'unfreeze')
    addMouseControl()
}

export function handleGameOver() {
    removeMouseControl()
}

/* setTimeout(() => {
    // unmountMainGame()
    initMainGame()
}, 10000) */

/* setTimeout(() => {
    mountMainGame()
}, 15000) */

/* setTimeout(() => {
    $store.dispatch('changeGameStatus', 'unfreeze')
}, 15000) */
