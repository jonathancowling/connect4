const { initCoin } = require('./static/game')

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
})

test.todo('initCoin creates a yellow coin')

test.todo('dropCoin places coin in correct column')

test.todo('dropCoin places coin adjacent')

test.todo('dropCoin places coin on top')

test.todo('dropCoin emits error event if coin placed on full column')

test.todo('dropCoin emits error event if coin placed outside of board')

test.todo("checkWin on an empty board doesn't change state")

test.todo("checkWin on a board with 1 red doesn't change state")

test.todo("checkWin on a board with 4 reds not in a row doesn't change state")

test.todo("checkWin on a board with 4 reds in a row changes state")

test.todo("checkWin on a board with 4 yellows in a row changes state")
