import {observe} from '../observe/index.js'

let id = 0

export default class Store {
    constructor(options) {
        this.id = id++

        if (options.collocation) this.collocation = options.collocation

        if (options.state) {
            this.state = options.state
            observe(this.state)
        }

        if (options.actions) {
            const _actions = options.actions
            this.actions = Object.create(null)

            forEachValue(_actions, (action, key) => {
                this.actions[key] = (payload) => {
                    action.call(this, this, payload)
                }
            })
        }

        if (options.mutations) {
            const _mutations = options.mutations
            this.mutations = Object.create(null)

            forEachValue(_mutations, (mutation, key) => {
                this.mutations[key] = (payload) => {
                    mutation.call(this, this, payload)
                }
            })
        }

        if (options.getters) {
            const _getters = options.getters
            this.getters = {}

            forEachValue(_getters, function(fn, key) {
                Object.defineProperty(this.getters, key, {
                    get: () => fn(this.state)
                })
            })
        }
    }

    dispatch = (type, payload) => {
        this.actions[type](payload)
    }

    commit = (type, payload) => {
        this.mutations[type](payload)
    }
}

function forEachValue(obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
}
