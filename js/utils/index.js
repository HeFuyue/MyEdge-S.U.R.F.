/* export function throttle(func, delay) {
    let lock = false
    let timer

    return (...args) => {
        if (lock) {
            return
        } else {
            clearTimeout(timer)
        }

        func(...args)
        lock = true

        timer = setTimeout(() => {
            lock = false
        }, delay)
    }
} */

export function throttle(func, delay) {
    let last = 0

    return (...args) => {
        const now = Date.now()
        if (now - last < delay) return
        last = now
        return func(...args)
    }
}

/* setInterval(throttle(() => {
    console.log('@')
}, 1000), 10) */

export function debounce(func, delay) {
    let timer

    return function(...args) {
        const context = this
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

export function deepCloneObject(obj) {
    const newObj = {}
    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object') {
            newObj[key] = deepCloneObject(value)
        } else {
            newObj[key] = value
        }
    })

    return newObj
}
