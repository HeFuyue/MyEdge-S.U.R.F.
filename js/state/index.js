import {mountFirstScreen, unmountFirstScreen} from '../first-screen.js'
import {showSetting, showMask, hideMask} from '../game-ui.js'
import {mountMainGame, pauseMainGame, unmountMainGame, restartFromPause, handleGameOver} from '../main.js'

function gameState(state = 'first-screen') {

    return new Promise((resolve, reject) => {
        // console.log(state)
        switch (state) {
            case 'first-time-play': 
                console.log('first-time-play')
                unmountFirstScreen()
                mountMainGame()
                resolve('pause')
                break
            
            case 'play':
                console.log('play')
                showSetting(false)
                hideMask()
                restartFromPause()
                resolve('pause')
                break

            case 'pause': 
                console.log('pause')
                pauseMainGame()
                showSetting(true)
                showMask()
                resolve('play')
                break

            case 'first-screen': 
                console.log('first-screen')
                hideMask()
                unmountMainGame()
                mountFirstScreen()
                resolve('first-time-play')
                break

            case 'pending': 
                console.log('pending')
                resolve('first-screen')
                break

            case 'fail': 
                console.log('fail')
                showSetting(true)
                handleGameOver()
                reject('fail')
                break
        }
    }).catch((err) => {
        console.log(err)
        gameState('pending')
    })
}

let currentGameState = gameState('first-screen')

window.addEventListener('dblclick', () => {
    console.log(currentGameState)
    currentGameState = currentGameState.then(
        state => gameState(state)
    )
})

export function gameOver() {
    currentGameState = gameState('fail')
}

/* setTimeout(() => {
    currentGameState = gameState('fail')
}, 10000) */
