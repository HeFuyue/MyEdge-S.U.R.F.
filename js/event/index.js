export const pubsub = {
    _eventList: [],

    subscribe: (name, target, cb) => {
        // console.log('@subscribe')
        const event = pubsub._eventList.find(event => event.name == name)
        if (event) {
            event.handlers.push({
                target: target,
                cb: cb
            })
        } else {
            pubsub._eventList.push({
                name: name,
                handlers: [{
                    target: target,
                    cb: cb
                }]
            })
        }
    },

    publish: (name, target, params) => {
        // console.log('@publish')
        customEvent.detail = {
            name: name,
            target: target,
            params: params
        }

        window.dispatchEvent(customEvent)
    }
}

const customEvent = new Event('custom')

window.addEventListener('custom', e => {
    // console.log('@eventListener')
    const {name, target, params} = e.detail

    const event = pubsub._eventList.find(event => event.name == name)

    if (event) {
        event.handlers.forEach(handler => {
            if (handler.target == target) {
                handler.cb(params)
            }
        })
    }
})
