export const animationParameters = {
    surfBoardX: {
        direction: 'horizontal',
        startPosition: 1,
        totalFrames: 5,
        staggerFrames: 15,
        style: 'roundTrip'
    },

    surfBoardY: {
        direction: 'vertical',
        startPosition: 0,
        totalFrames: 3,
        staggerFrames: 5,
        style: 'singleWay'
    },

    player: {
        direction: 'horizontal',
        startPosition: 1,
        totalFrames: 5,
        staggerFrames: 15,
        style: 'roundTrip'
    },

    ripple: {
        direction: 'horizontal',
        startPosition: 1,
        spritePosition: 0,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },

    jumpingBoard: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 15,
        totalFrames: 4,
        staggerFrames: 10,
        style: 'singleWay'
    },

    flash: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 16,
        totalFrames: 4,
        staggerFrames: 10,
        style: 'singleWay'
    },

    heart: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 17,
        totalFrames: 4,
        staggerFrames: 10,
        style: 'singleWay'
    },

    whirlpool: {
        direction: 'horizontal',
        startPosition: 0,
        spritePosition: 1,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },

    octopusHidden: {
        direction: 'vertical',
        startPosition: 4,
        spritePosition: 17,
        totalFrames: 4,
        staggerFrames: 10,
        style: 'singleWay'
    },

    octopusChase: {
        direction: 'horizontal',
        startPosition: 10,
        spritePosition: 2,
        totalFrames: 5,
        staggerFrames: 10,
        style: 'roundTrip'
    },

    octopusCatch: {
        direction: 'horizontal',
        startPosition: 10,
        spritePosition: 3,
        totalFrames: 5,
        staggerFrames: 10,
        style: 'singleWay'
    },

    size192x64Wave: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 8,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },

    size192x64Weed: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 9,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },

    size128x64Wave: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 12,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },

    size128x64Weed: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 14,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },
    
    size64x64Wave: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 24,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },

    size64x64Weed: {
        direction: 'vertical',
        startPosition: 0,
        spritePosition: 27,
        totalFrames: 3,
        staggerFrames: 10,
        style: 'singleWay'
    },
}

export const playerStatus = {
    pause: 0,
    leftForward: 1,
    forwardLeft: 2,
    forward: 3,
    forwardRight: 4,
    rightForward: 5,
    fallDown: 6,
    defeated: 7,
    jumpingOff: 8
}

export const spriteSetting = {
    rock: {spriteWidth: 64, spriteHeight: 64, needDrawRipple: true, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 32, width: 44, height: 24}},
    mark: {spriteWidth: 64, spriteHeight: 64, needDrawRipple: true, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 32, width: 44, height: 24}},
    float: {spriteWidth: 64, spriteHeight: 64, needDrawRipple: true, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 32, width: 44, height: 24}},
    size64x64Island: {spriteWidth: 64, spriteHeight: 64, needDrawRipple: true, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 32, width: 44, height: 24}},
    size64x128Island: {spriteWidth: 64, spriteHeight: 128, needDrawRipple: true, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 84, width: 44, height: 24}},
    size128x128Island: {spriteWidth: 128, spriteHeight: 128, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 56, width: 108, height: 56}},
    size192x128Island: {spriteWidth: 192, spriteHeight: 128, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 56, width: 172, height:56}},
    coral: {spriteWidth: 64, spriteHeight: 64, needDrawRipple: true, isStatic: true, crashArea: {relativePositionX: 10, relativePositionY: 32, width: 44, height: 24}},
    player1: {spriteWidth: 64, spriteHeight: 64, isStatic: true, crashArea: {relativePositionX: 20, relativePositionY: 30, width: 24, height: 24}},
    player2: {spriteWidth: 64, spriteHeight: 64, isStatic: true, crashArea: {relativePositionX: 20, relativePositionY: 30, width: 24, height: 24}},
    player3: {spriteWidth: 64, spriteHeight: 64, isStatic: true, crashArea: {relativePositionX: 20, relativePositionY: 30, width: 24, height: 24}},
    player4: {spriteWidth: 64, spriteHeight: 64, isStatic: true, crashArea: {relativePositionX: 20, relativePositionY: 30, width: 24, height: 24}},
    ripple: {spriteWidth: 95, spriteHeight: 64, isStatic: false},
    jumpingBoard: {spriteWidth: 64, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 64, height: 64}},
    flash: {spriteWidth: 64, spriteHeight: 64, isStatic: false},
    heart: {spriteWidth: 64, spriteHeight: 64, isStatic: false},
    whirlpool: {spriteWidth: 128, spriteHeight: 128, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 128, height: 128}},
    octopusHidden: {spriteWidth: 64, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 64, height: 64}},
    octopusChase: {spriteWidth: 128, spriteHeight: 128, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 128, height: 128}},
    octopusCatch: {spriteWidth: 128, spriteHeight: 128, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 128, height: 128}},
    size192x64Wave: {spriteWidth: 192, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 192, height: 64}},
    size192x64Weed: {spriteWidth: 192, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 192, height: 64}},
    size128x64Wave: {spriteWidth: 128, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 128, height: 64}},
    size128x64Weed: {spriteWidth: 128, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 128, height: 64}},
    size64x64Wave: {spriteWidth: 64, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 64, height: 64}},
    size64x64Weed: {spriteWidth: 64, spriteHeight: 64, isStatic: false, crashArea: {relativePositionX: 0, relativePositionY: 0, width: 64, height: 64}},
    size64x64Pontoon: {spriteWidth: 64, spriteHeight: 64, isStatic: true, animationCrashArea: {relativePositionX: 0, relativePositionY: 0, width: 64, height: 64}, crashArea: {relativePositionX: 5, relativePositionY: 10, width: 54, height: 36}},
    size64x128Pontoon: {spriteWidth: 64, spriteHeight: 128, isStatic: true, animationCrashArea: {relativePositionX: 0, relativePositionY: 0, width: 64, height: 128}, crashArea: {relativePositionX: 5, relativePositionY: 74, width: 54, height: 36}}
}

export const spriteCategory = {
    obstacles: [
        {
            name: 'rock',
            range: 5
        },
        {
            name: 'float',
            range: 8
        },
        {
            name: 'size64x64Island',
            range: 3
        },
        {
            name: 'size64x128Island',
            range: 5
        },
        {
            name: 'size128x128Island',
            range: 3
        },
        {
            name: 'size192x128Island',
            range: 3
        },
        {
            name: 'coral',
            range: 4
        }
    ],

    waves: ['size192x64Wave', 'size192x64Weed', 'size128x64Wave', 'size128x64Weed', 'size64x64Wave', 'size64x64Weed', 'whirlpool']
}

export const spritePosition = {
    rock: [
        {x: 6, y: 1},
        {x: 7, y: 1},
        {x: 8, y: 1},
        {x: 9, y: 1},
        {x: 10, y: 1}
    ],

    mark: {
        octopus: {x: 11, y: 1},
        start: {x: 9, y: 0}
    },

    float: [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 3, y: 1},
        {x: 4, y: 1},
        {x: 5, y: 1},
        {x: 6, y: 0},
        {x: 7, y: 0}
    ],

    size64x64Island: [
        {x: 12, y: 1},
        {x: 13, y: 1},
        {x: 14, y: 1}
    ],

    size64x128Island: [
        {x: 12, y: 2},
        {x: 13, y: 2},
        {x: 14, y: 2},
        {x: 13, y: 3},
        {x: 14, y: 3}
    ],

    size128x128Island: [
        {x: 3, y: 2},
        {x: 4, y: 2},
        {x: 5, y: 2}
    ],

    size192x128Island: [
        {x: 2, y: 1},
        {x: 3, y: 1},
        {x: 4, y: 1}
    ],

    coral: [
        {x: 11, y: 0},
        {x: 12, y: 0},
        {x: 13, y: 0},
        {x: 14, y: 0}
    ],

    player1: {
        left: {x: 18, y: 0},
        right: {x: 19, y: 0},
        fallDown: {x: 20, y: 0}
    },

    player2: {
        left: {x: 18, y: 1},
        right: {x: 19, y: 1},
        fallDown: {x: 20, y: 1}
    },

    player3: {
        left: {x: 18, y: 2},
        right: {x: 19, y: 2},
        fallDown: {x: 20, y: 2}
    },

    player4: {
        left: {x: 18, y: 3},
        right: {x: 19, y: 3},
        fallDown: {x: 20, y: 3}
    }
}

export const pontoons = [ 
    {
        pontoonId: 0,
        position: {x: 0, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            top: true,
            right: true
        }
    },
    {
        pontoonId: 1,
        position: {x: 1, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            top: true,
            left: true,
            right: true
        }
    },
    {
        pontoonId: 2,
        position: {x: 2, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            top: true,
            left: true
        }
    },
    {
        pontoonId: 3,
        position: {x: 3, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            top: true,
            bot: true,
            right: true
        }
    },
    {
        pontoonId: 4,
        position: {x: 4, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            top: true,
            bot: true,
            left: true
        }
    },
    {
        pontoonId: 5,
        position: {x: 5, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            top: true,
            bot: true
        }
    },
    {
        pontoonId: 6,
        position: {x: 6, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            top: true
        }
    },
    {
        pontoonId: 7,
        position: {x: 7, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            left: true,
            right: true
        }
    },
    {
        pontoonId: 8,
        position: {x: 8, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            left: true,
            right: true
        }
    },
    {
        pontoonId: 9,
        position: {x: 9, y: 7},
        size: {width: 64, height: 64},
        jointDirection: {
            left: true,
            right: true
        }
    },
    {
        pontoonId: 10,
        position: {x: 10, y: 3},
        size: {width: 64, height: 128},
        jointDirection: {
            left: true,
            right: true
        }
    },
    {
        pontoonId: 11,
        position: {x: 11, y: 3},
        size: {width: 64, height: 128},
        jointDirection: {
            left: true,
            right: true
        }
    },
]
