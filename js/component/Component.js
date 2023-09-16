import Store from '../store/Store.js'
import RenderPlayer from '../animation/RenderPlayer.js'
import RenderObjects from '../animation/RenderObjects.js'
import store from '../store/index.js'
import {pontoons} from '../animation/constant.js'
import {detectCrash} from '../crash/index.js'
import {spriteSetting, spriteCategory} from '../animation/constant.js'
import {offscreen} from '../../index.js'

let id = 0
let objectId = 0

export class Component {
    // static $store = new Store() // instance.__proto__.constructor.$store
    
    constructor() {
        this.id = id++
    }

    genInitialPosition(startPosition = 'bottom') {
        if (startPosition === 'bottom') {
            this.position.x = Math.floor(Math.random() * this.$store.state.settings.canvasSize.width),
            this.position.y = this.$store.state.settings.canvasSize.height
        } else {
            this.position.x = Math.floor(Math.random() * this.$store.state.settings.canvasSize.width),
            this.position.y = - spriteSetting[this.style].spriteHeight
        }
    }

    flushRender() {
        this.draw.flushRender()
    }

    static clearDeps() {
        Component.prototype.deps = {}
    }

    static flushStore() {
        Component.prototype.$store.commit('RESET')
    }
}

Component.prototype.$store = new Store(store) // instance.$store
Component.prototype.deps = {}

export class Player extends Component {
    constructor() {
        super(id)
        this.playerInfo = {
            playerId: this.$store.state.player.playerId,
            direction: this.$store.state.control.direction
        }
        this.position = {x: undefined, y: undefined}
        this.crashArea = {
            position: {x: undefined, y: undefined},
            size: {width: 24, height: 24}
        }
        this.init()
    }

    init() {
        this.$store.dispatch('addPlayer', this)

        this.position.x = this.$store.state.settings.canvasSize.width / 2 - RenderPlayer.spriteWidth / 2
        this.position.y = this.$store.state.settings.canvasSize.height * 2 / 5 - RenderPlayer.spriteHeight / 2
        this.crashArea.position.x = this.position.x + 20
        this.crashArea.position.y = this.position.y + 30
        
        this.render = new RenderPlayer(this.$store.state.settings.playerctx, {
            playerInfo: this.playerInfo,
            isPlayerStatic: true,
            drawPosition: this.position,
            crashArea: this.crashArea
        }, this.$store.state.control.speed).draw
    }
}

export class GameObject extends Component {
    constructor(style, objectId) {
        super(id)
        this.style = style
        this.objectId = objectId
        this.position = {x: undefined, y: undefined}
        this.isShow = true
        this.type = 'obstacle'
        this.draw = undefined
        this.size = {
            width: spriteSetting[style].spriteWidth,
            height: spriteSetting[style].spriteHeight
        }
        this.init()
    }

    init(params) {
        // this.$store.dispatch('addObject', this)
        if (params) {
            this.style = params.objectInfo.style
            this.objectId = params.objectInfo.id
            this.size = {
                width: spriteSetting[params.objectInfo.style].spriteWidth,
                height: spriteSetting[params.objectInfo.style].spriteHeight
            }
        }

        this.genInitialPosition()
        if (this.draw) {
            this.draw.init({position: this.position, ...params})
        } else {
            this.draw = new RenderObjects(this.$store.state.settings.ctx, {
                objectInfo: {style: this.style, id: this.objectId},
                position: this.position
            }, this.$store.state.control.speed)

            this.render = () => {
                if (this.isShow) this.draw.draw()
            }
            this.renderOnce = () => {
                if (this.isShow) this.draw.drawOnce()
            }
        }
    }

    genCrashArea() {
        return {
            objectId: objectId++,
            position: {
                x: this.position.x + spriteSetting[this.style].crashArea.relativePositionX,
                y: this.position.y + spriteSetting[this.style].crashArea.relativePositionY
            },
            size: {
                width: spriteSetting[this.style].crashArea.width,
                height: spriteSetting[this.style].crashArea.height
            }
        }
    }
}

export class Wave extends Component {
    constructor(style) {
        super(id)
        this.style = style
        this.position = {x: undefined, y: undefined}
        this.size = {width: spriteSetting[style].spriteWidth, height: spriteSetting[style].spriteHeight}
        this.type = 'wave'
        this.draw = undefined
        this.status = 'prepared'
        this.isShow = true
        this.init()
    }

    init(params) {
        this.genInitialPosition()

        if(this.ignoreCrashCheck) this.ignoreCrashCheck = false

        if (params) {
            this.style = params.objectInfo.style
            this.size = {
                width: spriteSetting[params.objectInfo.style].spriteWidth,
                height: spriteSetting[params.objectInfo.style].spriteHeight
            }
        }
        if (this.draw) {
            this.draw.init({position: this.position, objectInfo: {style: this.style}})
        } else {
            this.draw = new RenderObjects(this.$store.state.settings.ctx, {
                objectInfo: {style: this.style},
                position: this.position
            }, this.$store.state.control.speed)

            this.render = () => {
                if (this.isShow) this.draw.draw()
            }
        }
        this.status = 'prepared'
    }

    genCrashArea() {
        return {
            position: {
                x: this.position.x + spriteSetting[this.style].crashArea.relativePositionX,
                y: this.position.y + spriteSetting[this.style].crashArea.relativePositionY
            },
            size: {
                width: spriteSetting[this.style].crashArea.width,
                height: spriteSetting[this.style].crashArea.height
            } 
        }
    }

    changeDirection(direction) {
        this.direction = direction
        this.draw.id = direction
    }
}

export class RandomPlayer extends Component {
    constructor(playerId) {
        super(id)
        this.style = `player${playerId}`
        this.playerId = playerId
        this.position = {x: undefined, y: undefined}
        this.size = {width: spriteSetting[this.style].spriteWidth, height: spriteSetting[this.style].spriteHeight}
        this.isShow = false
        this.type = 'randomPlayer'
        this.direction = 'left'
        this.draw = undefined
        this.changeDirectionFromFallDownFrame = 50
        this.changeDirectionFrame = 200
        this.objectInfo = {
            style: this.style,
            id: this.direction
        }
        this.init()
    }

    init(playerId) {
        this.genInitialPosition()

        if (playerId) {
            this.style = `player${playerId}`
            this.playerId = playerId
            this.objectInfo = {
                style: this.style,
                id: this.direction
            }
        }
        if (this.draw) {
            this.draw.init({position: this.position, objectInfo: this.objectInfo})
        } else {
            this.draw = new RenderObjects(this.$store.state.settings.ctx, {
                objectInfo: this.objectInfo,
                position: this.position
            }, this.$store.state.control.speed)

            this.render = () => {
                if (this.isShow) this.draw.draw()
            }
        }
    }

    genCrashArea() {
        return {
            position: {
                x: this.position.x + spriteSetting[this.style].crashArea.relativePositionX,
                y: this.position.y + spriteSetting[this.style].crashArea.relativePositionY
            },
            size: {
                width: spriteSetting[this.style].crashArea.width,
                height: spriteSetting[this.style].crashArea.height
            }
        }
    }

    flushRender() {
        this.draw.flushRender()
    }
}

export class Group extends Component {
    constructor() {
        super(id)
        this.position = {x: 0, y: 0},
        this.size = {width: undefined, height: undefined}
        this.objects = {
            obstacles: [],
            waves: []
        }
        this.type = 'group'
        this.isShow = true
        this.status = 'prepared'
        this.nextTimeGenOctopus = 1000
        this.worker = new Worker('./js/worker/index.js')
        this.init()
    }

    init() {
        this.reset()
        this.genInitialPosition()
        this.genSetting()

        this.worker.postMessage({
            groupSetting: {
                needPontoon: this.needPontoon,
                needJumpingBoard: this.needJumpingBoard,
                needOctopus: this.needOctopus
            },
            spriteSetting: spriteSetting,
            pontoons: pontoons,
            spriteCategory: spriteCategory
        }, [])

        this.worker.onmessage = e => {
            this.objects = e.data.objects
            this.size = e.data.size
            this.pontoonPosition = e.data.pontoonPosition

            if (this.render) {
                this.render.init(this)
            } else {
                this.render = new RenderObjects(this.$store.state.settings.ofsctx, this, this.$store.state.control.speed)
            }

            this.status = 'ready'
        }
    }

    reset() {
        this.position = {x: 0, y: 0},
        this.size = {width: undefined, height: undefined}
        this.objects = {
            obstacles: [],
            waves: []
        }
        this.status = 'prepared'
        this.needPontoon = undefined
        this.needJumpingBoard = undefined
        this.needOctopus = undefined
    }

    renderGroupFromOffscreen() {
        offscreen.width = this.size.width
        offscreen.height = this.size.height

        if (this.status === 'ready') {
            this.render.draw()
            this.$store.state.settings.ctx.drawImage(offscreen, 0, 0, this.size.width, this.size.height, this.position.x, this.position.y, this.size.width, this.size.height)
        }
    }

    genSetting() {
        if (this.$store.state.settings.score > 500) {
            this.needJumpingBoard = Math.floor(Math.random() * 10) < 1
            if (this.needJumpingBoard) return
        }

        if (this.$store.state.settings.score > this.nextTimeGenOctopus && !this.needJumpingBoard) {
            this.needOctopus = true
            this.nextTimeGenOctopus = this.$store.state.settings.score + 1000
            if (this.needOctopus) return
        }

        this.needPontoon = Math.floor(Math.random() * 3) < 1
    }

    getGroupSize() {
        if (this.needPontoon) {
            this.size.width = this.size.width + 2 * paddingLeft
            this.size.height = this.size.height + 2 * paddingTop
        } else if (this.needOctopus) {
            this.size.width = 800
            this.size.height = 600
        } else {
            this.size.width = 200 + Math.floor(500 * Math.random())
            this.size.height = 100 + Math.floor(300 * Math.random())
        }
    }

    genWaves() {
        const generatedWavesNum = this.objects.waves.length
        if (generatedWavesNum === this.waveNum) return

        for (let i = generatedWavesNum; i < this.waveNum; i++) {
            let newWave = genRandomWave.call(this)
            for (let i = 0; i < this.objects.waves.length; i++) {
                if (detectCrash(newWave, this.objects.waves[i])) {
                    console.log('crash')
                    return this.genWaves()
                }
            }
            this.objects.waves.push(newWave)
        }
    }

    genCrashArea() {
        return {
            position: this.position,
            size: this.size
        }
    }

    genGroupDeps() {
        let groupDeps = []

        this.objects.obstacles.forEach(obstacle => {
            groupDeps.push({groupObjectId: obstacle.groupObjectId, type: 'obstacle', crashArea: obstacle.crashArea})
        })

        this.objects.waves.forEach(wave => {
            groupDeps.push({type: 'wave', style: wave.style, crashArea: {position: wave.position, size: wave.size}})
        })

        this.objects.bonus.forEach(bonus => {
            groupDeps.push({type: 'bonus', style: bonus.style, crashArea: {position: bonus.position, size: bonus.size}})
        })

        return groupDeps
    }
}

export function useStore() {
    return Component.prototype.$store
}
