const { default: each } = require('jest-each')
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
    it('places coins in the correct cells', () => {
        const board = document.createElement('table')
        board.setAttribute('id', 'main-game')
        for (let i = 0; i < 2; i++) {
            const row = document.createElement('tr')
            for (let j = 0; j < 2; j++) {
                row.appendChild(document.createElement('td'))
            }
            board.appendChild(row)
        }
        document.body.appendChild(board)

        const coin1 = document.createElement('div')
        const coin2 = document.createElement('div')
        const coin3 = document.createElement('div')
        const coin4 = document.createElement('div')

        placeCoin(coin1, 0, 0)
        expect(board.children[0].children[0].firstElementChild).toBe(coin1)
        expect(board.children[1].children[1].firstElementChild).toBe(null)
        expect(board.children[0].children[1].firstElementChild).toBe(null)
        expect(board.children[1].children[0].firstElementChild).toBe(null)

        placeCoin(coin2, 1, 1)
        expect(board.children[0].children[0].firstElementChild).toBe(coin1)
        expect(board.children[1].children[1].firstElementChild).toBe(coin2)
        expect(board.children[0].children[1].firstElementChild).toBe(null)
        expect(board.children[1].children[0].firstElementChild).toBe(null)
        placeCoin(coin3, 0, 1)
        expect(board.children[0].children[0].firstElementChild).toBe(coin1)
        expect(board.children[1].children[1].firstElementChild).toBe(coin2)
        expect(board.children[0].children[1].firstElementChild).toBe(coin3)
        expect(board.children[1].children[0].firstElementChild).toBe(null)
        
        placeCoin(coin4, 1, 0)
        expect(board.children[0].children[0].firstElementChild).toBe(coin1)
        expect(board.children[1].children[1].firstElementChild).toBe(coin2)
        expect(board.children[0].children[1].firstElementChild).toBe(coin3)
        expect(board.children[1].children[0].firstElementChild).toBe(coin4)
    })
})

describe('takeTurn', () => {

    each([
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
    ]).it('correctly updates board and player (happy path)', (initialState, col, expectedState) => {
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
