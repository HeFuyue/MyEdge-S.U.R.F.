export default {
    collocation: {
        increment: 0,
        player: {},
        gameObjects: [],
        waves: [],
        groups: [],
        dispatchingQueue: [],
        activeQueue: []
    },

    state: {
        settings: {
            ctx: undefined,
            bgctx: undefined,
            mode: 'infinite',
            life: 3,
            speedUp: 0,
            score: 0,
            canvasSize: {
                height: undefined,
                width: undefined
            }
        },

        control: {
            status: 'play',
            animationSpeed: 1,
            gameSpeed: 1,
            direction: 'forward'
        },

        player: {
            id: undefined,
            playerId: 5,
            position: {
                x: undefined,
                y: undefined
            }
        },

        obstacles: []
    },

    actions: {
        changeCanvasSize({commit}, currentSize) {
            commit('CANVASSIZE', currentSize)
        },

        addPlayer({commit}, playerInfo) {
            commit('ADDPLAYER', playerInfo)
        },

        changeDirection({state, commit}, direction) {
            if (state.control.direction !== direction) commit('DIRECTION', direction)
        },

        changeGameSpeed({commit}, gameSpeed) {
            commit('GAMESPEED', gameSpeed)
        },

        changeGameStatus({commit}, status) {
            commit('STATUS', status)
        },

        changeScore({commit, collocation}, gameSpeed) {
            const increment = gameSpeed / 10
            commit('INCREMENT', increment)

            const finalIncrement = Math.floor(increment) + Math.floor(collocation.increment)
            if(finalIncrement) commit('SCORE', finalIncrement)
        },

        decreaseLife({commit}) {
            commit('LIFE', -1)
        },

        addObject({commit}, object) {
            commit('ADDOBJECT', object)
        }
    },

    mutations: {
        CANVASSIZE({state}, currentSize) {
            state.settings.canvasSize = currentSize
        },

        ADDPLAYER({collocation, state}, playerInfo) {
            collocation.player = playerInfo
        },
        
        DIRECTION({collocation, state}, direction) {
            collocation.player.playerInfo.direction = direction
            state.control.direction = direction
        },

        GAMESPEED({state}, gameSpeed) {
            state.control.gameSpeed = gameSpeed
        },

        STATUS({state}, status) {
            state.control.status = status
        },

        SCORE({state}, increment) {
            state.settings.score += increment
        },

        INCREMENT({collocation}, gameSpeed) {
            if (collocation.increment >= 1) collocation.increment = 0
            collocation.increment += gameSpeed
        },

        LIFE({state}, flag) {
            state.settings.life += flag
        },

        ADDOBJECT({state, collocation}, object) {
            // state.obstacles.push(object)
            collocation.gameObjects.push(object)
        },

        RESET({state, collocation}) {
            collocation.increment = 0
            collocation.player = {}
            collocation.gameObjects = []
            collocation.waves = []
            collocation.groups = []
            collocation.dispatchingQueue = []
            collocation.activeQueue = []

            state.settings.mode = 'infinite'
            state.settings.life = 3
            state.settings.speedUp = 0
            state.settings.score = 0

            state.control.status = 'play'
            state.control.animationSpeed = 1
            state.control.gameSpeed = 1
            state.control.direction = 'forward'

            state.player.id = undefined
            state.player.playerId = 5
            state.player.position.x = undefined
            state.player.position.y = undefined

            state.obstacles = []
        }
    },
}
