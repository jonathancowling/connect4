const { initBoard } = require('./static/initBoard')

describe('initBoard', () => {

    beforeEach(() => {
        document.body.innerHTML = ''
        document.head.innerHTML = ''
    })

    it.each([
        [{
            board: [[null]],
            winner: null,
            player: 0
        }, 1, 1],
        [{
            board: [[null], [null]],
            winner: null,
            player: 0
        }, 2, 1],
        [{
            board: [[null, null], [null, null]],
            winner: null,
            player: 0
        }, 2, 2],
        [{
            board: [[null, null]],
            winner: null,
            player: 0
        }, 1, 2]
    ])('can create a correct n * m board', (state, n, m) => {
        const board = document.createElement('table')
        board.setAttribute('id', 'main-game')
        document.body.appendChild(board)

        initBoard(state)
        expect(board.childElementCount).toBe(n)
        for (row of board.children) {
            expect(row.nodeName).toBe('TR')
            expect(row.childElementCount).toBe(m)
            for (cell of row.children) {
                expect(cell.nodeName).toBe('TD')
            }
        }
    })
})