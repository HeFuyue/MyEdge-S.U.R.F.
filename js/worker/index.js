let spriteSetting, spriteCategory, pontoonArr

onmessage = function(e) {
    groupSetting = e.data.groupSetting
    spriteSetting = e.data.spriteSetting
    pontoonArr = e.data.pontoons
    spriteCategory = e.data.spriteCategory

    reset()
    group.init(groupSetting)

    postMessage({
        objects: group.objects,
        size: group.size,
        pontoonPosition: group.pontoonPosition
    }, [])
}

let groupObjectId = 0

class GroupGenerator {
    constructor() {
        this.position = {x: 0, y: 0},
        this.size = {width: undefined, height: undefined}
        this.objects = {
            obstacles: [],
            waves: [],
            bonus: []
        }
        this.waveNum = null
        this.randomObstacleNum = null
        this.pontoon = {}
        // this.init()
    }

    init(setting) {
        this.needOctopus = setting.needOctopus
        this.needPontoon = setting.needPontoon
        this.needJumpingBoard = setting.needJumpingBoard
        this.objects.obstacles = []
        this.objects.waves = []
        this.objects.bonus = []

        if (this.needPontoon) {
            genPontoon(this.pontoon)

            // console.log(leftMostPosition, rightMostPosition + 64, topMostPosition, botMostPosition + 64)
            this.pontoonPosition = {x: paddingLeft - leftMostPosition, y: paddingTop - topMostPosition}
            this.pontoonSize = {width: rightMostPosition - leftMostPosition + 64, height: botMostPosition - topMostPosition + 64}
            this.objects.obstacles = [...pontoonObj]
            // console.log(occupiedPositions)
        }

        this.getGroupSize()

        if (this.needJumpingBoard) {
            this.objects.bonus.push({
                groupObjectId: groupObjectId++,
                style: 'jumpingBoard',
                type: 'bonus',
                size: {width: spriteSetting.jumpingBoard.spriteWidth, height: spriteSetting.jumpingBoard.spriteHeight},
                position: {x: this.size.width / 2 - spriteSetting.jumpingBoard.spriteWidth, y: this.size.height / 2 - spriteSetting.jumpingBoard.spriteHeight},
                crashArea: spriteSetting.jumpingBoard.crashArea
            })
        }

        if (this.needOctopus) {
            const octopusPosition = genRandomPosition(this.size.width - 100, this.size.height, 'octopusHidden', 0, 0)
            const markPosition = genRandomPosition(this.size.width, this.size.height / 2, 'mark', this.size.width - 100, 0)
            this.objects.obstacles.push({
                groupObjectId: groupObjectId++,
                style: 'octopusHidden',
                obstacleId: 'octopusHidden',
                size: {width: spriteSetting.octopusHidden.spriteWidth, height: spriteSetting.octopusHidden.spriteHeight},
                position: octopusPosition,
                crashArea: {
                    position: {
                        x: spriteSetting.octopusHidden.crashArea.relativePositionX + octopusPosition.x,
                        y: spriteSetting.octopusHidden.crashArea.relativePositionY + octopusPosition.y
                    },
                    size: {
                        width: spriteSetting.octopusHidden.crashArea.width,
                        height: spriteSetting.octopusHidden.crashArea.height
                    }
                }
            })
            this.objects.obstacles.push({
                groupObjectId: groupObjectId++,
                style: 'mark',
                obstacleId: 'octopus',
                size: {width: spriteSetting.mark.spriteWidth, height: spriteSetting.mark.spriteHeight},
                position: markPosition,
                crashArea: {
                    position: {
                        x: spriteSetting.mark.crashArea.relativePositionX + markPosition.x,
                        y: spriteSetting.mark.crashArea.relativePositionY + markPosition.y
                    },
                    size: {
                        width: spriteSetting.mark.crashArea.width,
                        height: spriteSetting.mark.crashArea.height
                    }
                }
            })
        }
        
        this.waveNum = Math.ceil(this.size.width * this.size.height / 100000)
        this.randomObstacleNum = this.needPontoon ? this.waveNum + Math.floor(Math.random() * 5) + 3 : this.waveNum
        this.remainGenerateObstaclesNum = this.randomObstacleNum
        // console.log('waveNum: ', this.waveNum, 'ObstacleNum: ', this.randomObstacleNum)
        this.genWaves()
        genRandomObstacle.call(this)
    }

    getGroupSize() {
        if (this.needPontoon) {
            this.size.width = this.pontoonSize.width + 2 * paddingLeft
            this.size.height = this.pontoonSize.height + 2 * paddingTop
        } else if (this.needOctopus) {
            this.size.width = 800
            this.size.height = 600
        } else {
            this.size.width = 200 + Math.floor(500 * Math.random())
            this.size.height = 100 + Math.floor(300 * Math.random())
        }
    }

    genWaves() {
        // console.log(this.size)
        const generatedWavesNum = this.objects.waves.length
        if (generatedWavesNum === this.waveNum) return

        for (let i = generatedWavesNum; i < this.waveNum; i++) {
            let newWave = genRandomWave.call(this)
            for (let i = 0; i < this.objects.waves.length; i++) {
                if (detectCrash(newWave, this.objects.waves[i])) {
                    // console.log('crash')
                    return this.genWaves()
                }
            }
            this.objects.waves.push(newWave)
        }
    }
}

function reset() {
    unmatchTimes = 0
    currentOccupiedPosition = {x: 0, y: 0}
    occupiedPositions = []
    lastDirections = []
    movementX = 0
    movementY = 0
    leftMostPosition = 0
    rightMostPosition = 0
    topMostPosition = 0
    botMostPosition = 0
    paddingTop = 100
    paddingLeft = 100
    pontoonObj = []
}

// let pontoonList = {}
let unmatchTimes = 0
let currentOccupiedPosition = {x: 0, y: 0}
let occupiedPositions = []
let lastDirections = []


function genPontoon(pontoonList) {
    if (unmatchTimes === 5) {
        if (pontoonList.jointDirection) {
            Object.entries(pontoonList.jointDirection).forEach(([direction, flag]) => {
                if (flag) {
                    if (pontoonList.pontoonId === 9) {
                        genNextPontoon(pontoonList, direction)
                        if (pontoonList.next) addPontoon(pontoonList.next, pontoonList.direction)
                    }
                    lastDirections.push(direction)
                }
            })    
        }
        
        if (lastDirections.length > 1) {
           console.log('append')
           genNextPontoon(pontoonList, lastDirections[0])
           if (pontoonList.next) addPontoon(pontoonList.next, pontoonList.direction)
        }

        return
    }

    let index = Math.floor(Math.random() * pontoonArr.length)
    let nextPontoon = deepCloneObject(pontoonArr[index])

    if (pontoonList.jointDirection) {
        const currentJoints = pontoonList.jointDirection
        const nextJoints = nextPontoon.jointDirection
        const {isMatch, direction} = matchPontoon(currentJoints, nextJoints)

        if (isMatch) {
            genNextPontoon(pontoonList, direction, true, nextPontoon)
            if (pontoonList.next) addPontoon(pontoonList.next, pontoonList.direction)
        } else {
            unmatchTimes++
            return genPontoon(pontoonList)
        }

        if (pontoonList.next) return genPontoon(pontoonList.next)
    } else {
        if (index === 9) return genPontoon(pontoonList)
        // pontoonArr.splice(index, 1)
        pontoonList.next = nextPontoon
        occupiedPositions.push({x: currentOccupiedPosition.x, y: currentOccupiedPosition.y})
        addPontoon(nextPontoon)
        return genPontoon(pontoonList.next)
    }
}

function judgeOccupiedPosition(direction) {
    const {checkPositionX, checkPositionY} = genNextPosition(direction)

    for (let i = 0; i < occupiedPositions.length; i++) {
        if (occupiedPositions[i].x === checkPositionX && occupiedPositions[i].y === checkPositionY) {
            // console.log('occupied')
            return true
        }
    }

    return false
}

function genNextPosition(direction) {
    let checkPositionX = currentOccupiedPosition.x
    let checkPositionY = currentOccupiedPosition.y
    switch(direction) {
        case 'left':
            checkPositionX -= 1
            break
        case 'right':
            checkPositionX += 1
            break
        case 'top':
            checkPositionY += 1
            break
        case 'bot':
            checkPositionY -= 1
    }
    return {checkPositionX, checkPositionY}
}

function genMatchingPontoon(direction) {
    if (judgeOccupiedPosition(direction)) return
    
    switch (direction) {
        case 'left':
            return deepCloneObject(pontoonArr[0])
        case 'right':
            return deepCloneObject(pontoonArr[2])
        case 'top':
            return deepCloneObject(pontoonArr[5])
        case 'bot':
            return deepCloneObject(pontoonArr[1])
    }
}

function reverseDirection(direction) {
    switch (direction) {
        case 'left':
            return 'right'
        case 'right':
            return 'left'
        case 'top':
            return 'bot'
        case 'bot':
            return 'top'
    }
}

function genNextPontoon(pontoonList, direction, isRandom, next) {
    pontoonList.next = isRandom ? next : genMatchingPontoon(direction)
    if (pontoonList.next) {
        if (judgeOccupiedPosition(direction)) {
            delete pontoonList.next
            unmatchTimes++
            return // genPontoon(pontoonList)
        }

        const {checkPositionX, checkPositionY} = genNextPosition(direction)
        currentOccupiedPosition.x = checkPositionX
        currentOccupiedPosition.y = checkPositionY
        occupiedPositions.push({x: currentOccupiedPosition.x, y: currentOccupiedPosition.y})

        // if (index) pontoonArr.splice(index, 1)

        pontoonList.direction = direction
        pontoonList.jointDirection[direction] = false
        pontoonList.next.jointDirection[reverseDirection(direction)] = false
    }
}

function matchPontoon(currentPontoon, nextPontoon) {
    const directions = ['left', 'right', 'top', 'bot']

    for (let i = 0; i < directions.length; i++) {
        if (currentPontoon[directions[i]]  && nextPontoon[reverseDirection(directions[i])]) {
            return {isMatch: true, direction: directions[i]}
        }
    }

    return {isMatch: false, direction: null}
}

let movementX = 0
let movementY = 0
let leftMostPosition = 0
let rightMostPosition = 0
let topMostPosition = 0
let botMostPosition = 0
let paddingTop = 100
let paddingLeft = 100
let pontoonObj = []

function addPontoon(pontoonList, direction = null) {

    if (direction) {
        switch(direction) {
            case 'left':
                movementX -= 1
                break
            case 'right':
                movementX += 1
                break
            case 'top':
                movementY -= 1
                break
            case 'bot':
                movementY += 1
        }
    }

    const drawPositionX = movementX * 64
    const drawPositionY = pontoonList.size.height === 128 ? (movementY - 1) * 64 : movementY * 64
    genPontoonBoundary(drawPositionX, drawPositionY)

    pontoonObj.push({
        groupObjectId: groupObjectId++,
        pontoonId: pontoonList.pontoonId,
        // type: 'obstacle',
        spritePosition: pontoonList.position,
        size: pontoonList.size,
        relativePosition: {
            x: drawPositionX,
            y: drawPositionY
        }
    })
}

function genPontoonBoundary(positionX, positionY) {
    if (positionX < leftMostPosition) {
        leftMostPosition = positionX
    } else if (positionX > rightMostPosition) {
        rightMostPosition = positionX
    }

    if (positionY > botMostPosition) {
        botMostPosition = positionY
    } else if (positionY < topMostPosition) {
        topMostPosition = positionY
    }
}

function genRandomWave() {
    const waveId = Math.floor(Math.random() * 6)
    const size = waveId < 2 ? {width: 64, height: 64} : waveId < 4 ? {width: 128, height: 64} : {width: 192, height: 64}
    const position = {
        x: Math.floor(Math.random() * (this.size.width - size.width)),
        y: Math.floor(Math.random() * (this.size.height - size.height))
    }

    return {
        waveId,
        size,
        position,
        // type: 'wave'
    }
}

function genRandomObstacle(matchTimes = 0) {
    // console.log(this)
    
    let obstacleChosen, obstacleName, id, randomPosition, isCrash
    this.remainGenerateObstaclesNum = this.remainGenerateObstaclesNum - matchTimes
    matchTimes = 0
    
    if (this.remainGenerateObstaclesNum <= 0) return

    for (let i = 0; i < this.remainGenerateObstaclesNum; i++) {
        obstacleChosen = spriteCategory.obstacles[Math.floor(Math.random() * spriteCategory.obstacles.length)]
        obstacleName = obstacleChosen.name
        id = Math.floor(Math.random() * obstacleChosen.range)
        // console.log(obstacleName, id)

        randomPosition = genRandomPosition(this.size.width, this.size.height, obstacleName)
        let newObstacle = {
            position: {
                x: randomPosition.x + spriteSetting[obstacleName].crashArea.relativePositionX,
                y: randomPosition.y + spriteSetting[obstacleName].crashArea.relativePositionY
            },
            size: {
                width: spriteSetting[obstacleName].crashArea.width,
                height: spriteSetting[obstacleName].crashArea.height
            }
        }

        let checkTimes = 0
        for (let i = 0; i < this.objects.obstacles.length; i++) {
            checkTimes++
            isCrash = false

            let currentObstacle

            if (this.objects.obstacles[i].pontoonId !== undefined) {
                if (this.objects.obstacles[i].crashArea) {
                    currentObstacle = this.objects.obstacles[i].crashArea
                } else {
                    const pontoonStyle = this.objects.obstacles[i].size.height === 128 ? 'size64x128Pontoon' : 'size64x64Pontoon'
                    currentObstacle = {
                        position: {
                            x: this.objects.obstacles[i].relativePosition.x + this.pontoonPosition.x + spriteSetting[pontoonStyle].animationCrashArea.relativePositionX,
                            y: this.objects.obstacles[i].relativePosition.y + this.pontoonPosition.y + spriteSetting[pontoonStyle].animationCrashArea.relativePositionY
                        },
                        size: {
                            width: spriteSetting[pontoonStyle].animationCrashArea.width,
                            height: spriteSetting[pontoonStyle].animationCrashArea.height
                        }
                    }
                    this.objects.obstacles[i].crashArea = currentObstacle
                }
            } else if (this.objects.obstacles[i].obstacleId !== undefined) {
                currentObstacle = this.objects.obstacles[i].crashArea
            }

            if (detectCrash(currentObstacle, newObstacle)) {
                // console.log('obstacle--crash')
                isCrash = true
                break
            }
        }

        for (let i = 0; i < this.objects.bonus.length; i++) {
            if (detectCrash({position: this.objects.bonus[i].position, size: this.objects.bonus[i].size}, newObstacle)) {
                console.log('randomObstacle---jumpingBoard---crash')
                isCrash = true
                break
            }
        }

        if (isCrash) {
            // console.log('i: ', i, 'checkTimes: ', checkTimes, 'isCrash: ', isCrash)
            continue
        } else {
            matchTimes++
            this.objects.obstacles.push({
                groupObjectId: groupObjectId++,
                style: obstacleName,
                obstacleId: id,
                // type: 'obstacle',
                size: {width: spriteSetting[obstacleName].spriteWidth, height: spriteSetting[obstacleName].spriteHeight},
                position: randomPosition,
                crashArea: {
                    position: newObstacle.position,
                    size: newObstacle.size
                }
            })
        }
        // console.log('i: ', i, 'checkTimes: ', checkTimes, 'isCrash: ', isCrash)
    }

    if (matchTimes < this.randomObstacleNum) {
        return genRandomObstacle.call(this, matchTimes)
    }
}

function genRandomPosition(boardWidth, boardHeight, style, startPositionX = 0, startPositionY = 0) {
    const {spriteWidth, spriteHeight} = spriteSetting[style]

    return {
        x: Math.floor(Math.random() * (boardWidth - spriteWidth - startPositionX)) + startPositionX,
        y: Math.floor(Math.random() * (boardHeight - spriteHeight - startPositionY)) + startPositionY
    }
}

function detectCrash(rect1, rect2) {
    if (rect1.position.x < rect2.position.x + rect2.size.width && rect1.position.x + rect1.size.width > rect2.position.x && rect1.position.y < rect2.position.y + rect2.size.height && rect1.position.y + rect1.size.height > rect2.position.y) {
        return true
    } else {
        return false
    }
}

function deepCloneObject(obj) {
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

const group = new GroupGenerator()
