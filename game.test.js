const { initCoin, placeCoin, takeTurn, ILLEGAL_MOVE_FULL_COLUMN, ILLEGAL_MOVE_COLUMN_DOESNT_EXIST } = require('./static/game')



describe('initCoin', () => {
    it('creates a red coin', () => {

        const template = document.createElement('template')
        template.setAttribute('id', 'coin-template')
        const templateContent = document.createElement('div')
        template.content.appendChild(templateContent)
        document.body.appendChild(template)

        const el = initCoin('red')
        expect(el).toBeInstanceOf(Element)
        expect(el.style.backgroundColor).toBe('red')
    })

    it('creates a yellow coin', () => {
        const template = document.createElement('template')
        template.setAttribute('id', 'coin-template')
        const templateContent = document.createElement('div')
        template.content.appendChild(templateContent)
        document.body.appendChild(template)

        const el = initCoin('yellow')
        expect(el).toBeInstanceOf(Element)
        expect(el.style.backgroundColor).toBe('yellow')
    })
})

describe('placeCoin', () => {

    let board

    afterAll(() => {
        document.body.innerHTML = '';
        document.head.innerHTML = '';
    })

    beforeAll(() => {
        board = document.createElement('table')
        board.setAttribute('id', 'main-game')
        for (let i = 0; i < 2; i++) {
            const row = document.createElement('tr')
            for (let j = 0; j < 2; j++) {
                row.appendChild(document.createElement('td'))
            }
            board.appendChild(row)
        }
        document.body.appendChild(board)
    })

    const coin1 = document.createElement('div')
    const coin2 = document.createElement('div')
    const coin3 = document.createElement('div')
    const coin4 = document.createElement('div')

    it.each([
        [coin1, 0, 0, [coin1, null, null, null]],
        [coin2, 1, 1, [coin1, coin2, null, null]],
        [coin3, 0, 1, [coin1, coin2, coin3, null]],
        [coin4, 1, 0, [coin1, coin2, coin3, coin4]]
    ])('places coins in the correct cells', (coin, row, col, expected) => {
        placeCoin(coin, row, col)
        expect(board.children[0].children[0].firstElementChild).toBe(expected[0])
        expect(board.children[1].children[1].firstElementChild).toBe(expected[1])
        expect(board.children[0].children[1].firstElementChild).toBe(expected[2])
        expect(board.children[1].children[0].firstElementChild).toBe(expected[3])
    })
})

describe('takeTurn', () => {

    it.each([
        [
            {
                board: [
                    [null, null],
                    [null, null]
                ],
                winner: null,
                player: 0
            },
            0,
            {
                board: [
                    [null, null],
                    [0, null]
                ],
                winner: null,
                player: 1
            }
        ],
        [
            {
                board: [
                    [null, null],
                    [0, null]
                ],
                winner: null,
                player: 0
            },
            0,
            {
                board: [
                    [0, null],
                    [0, null]
                ],
                winner: null,
                player: 1
            }
        ],
        [
            {
                board: [
                    [0, null],
                    [0, null]
                ],
                winner: null,
                player: 0
            },
            1,
            {
                board: [
                    [0, null],
                    [0, 0]
                ],
                winner: null,
                player: 1
            }
        ],
        [
            {
                board: [
                    [0, null],
                    [0, 0]
                ],
                winner: null,
                player: 0
            },
            1,
            {
                board: [
                    [0, 0],
                    [0, 0]
                ],
                winner: null,
                player: 1
            }
        ],
        [
            {
                board: [
                    [0, null],
                    [0, null]],
                winner: null,
                player: 1
            },
            1,
            {
                board: [
                    [0, null],
                    [0, 1]
                ],
                winner: null,
                player: 0
            }
        ]
    ])('correctly updates board and player (happy path)', (initialState, col, expectedState) => {
        expect(takeTurn(initialState, col)).toEqual(expectedState)
    })

    it('sets full column error if coin placed on full column', () => {
        const initialState = {
            board: [
                [0]
            ],
            winner: null,
            player: 0
        }

        const expectedState = {
            board: [
                [0]
            ],
            winner: null,
            player: 0,
            error: ILLEGAL_MOVE_FULL_COLUMN
        }

        expect(takeTurn(initialState, 0)).toEqual(expectedState)
    })

    it('sets no column exists error if coin placed on a column that doesn\'t exists', () => {
        const initialState = {
            board: [
                [null],
            ],
            winner: null,
            player: 0
        }

        const expectedState = {
            board: [
                [null],
            ],
            winner: null,
            player: 0,
            error: ILLEGAL_MOVE_COLUMN_DOESNT_EXIST
        }

        expect(takeTurn(initialState, 1)).toEqual(expectedState)
    })

    it('clears error on legal move', () => {
        const initialState = {
            board: [
                [null, null],
                [null, null]
            ],
            winner: null,
            player: 0,
            error: ILLEGAL_MOVE_FULL_COLUMN
        }
        
        const expectedState = {
            board: [
                [null, null],
                [0, null]
            ],
            winner: null,
            player: 1
        }

        expect(takeTurn(initialState, 0)).toEqual(expectedState)
    })
})

test.todo("checkWin on an empty board doesn't change state")

test.todo("checkWin on a board with 1 red doesn't change state")

test.todo("checkWin on a board with 4 reds not in a row doesn't change state")

test.todo("checkWin on a board with 4 reds in a row changes state")

test.todo("checkWin on a board with 4 yellows in a row changes state")
