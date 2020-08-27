const { initCoin, placeCoin } = require('./static/game')

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

test.todo('takeTurn places coin adjacent')

test.todo('takeTurn places coin adjacent')

test.todo('takeTurn places coin on top')

test.todo('takeTurn emits error event if coin placed on full column')

test.todo('takeTurn emits error event if coin placed outside of board')

test.todo("checkWin on an empty board doesn't change state")

test.todo("checkWin on a board with 1 red doesn't change state")

test.todo("checkWin on a board with 4 reds not in a row doesn't change state")

test.todo("checkWin on a board with 4 reds in a row changes state")

test.todo("checkWin on a board with 4 yellows in a row changes state")
