const { placeCoin } = require('./static/game')

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
                let td = document.createElement('td')
                let slot = document.createElement('div')
                slot.classList.add('slot')
                td.appendChild(slot)
                row.appendChild(td)
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
        expect(board.children[0].children[0].querySelector('.slot').firstElementChild).toBe(expected[0])
        expect(board.children[1].children[1].querySelector('.slot').firstElementChild).toBe(expected[1])
        expect(board.children[0].children[1].querySelector('.slot').firstElementChild).toBe(expected[2])
        expect(board.children[1].children[0].querySelector('.slot').firstElementChild).toBe(expected[3])
    })
})