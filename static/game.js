// TODO: snippet for creating coin
// let coin = document.querySelector('#coin-template').content.cloneNode(true)
// coin.firstElementChild // only usable before in document
// coin.firstElementChild.style.backgroundColor = 'red'
// document.querySelector('#main-game').appendChild(coin)

/**
 * @returns {Element}
 */
function initCoin(color) {
    const coin = document
        .querySelector('#coin-template')
        .content
        .cloneNode(true)
        .firstElementChild
    
    coin.style.backgroundColor = color

    return coin
}

function placeCoin(coin, row, col) {
    document
      .querySelector('#main-game')
      .children[row].children[col]
      .querySelector('.slot')
      .appendChild(coin)
}

function takeTurn(state, colIndex) {
    const newState = JSON.parse(JSON.stringify(state))
    delete newState.error

    const col = newState.board.map((row) => row[colIndex])
    
    // get index of last empty row for given column
    const rowIndex = col.length - 1 - col.reverse().findIndex((row) => row === null)

    if (colIndex >= newState.board.length) {
        newState.error = ILLEGAL_MOVE_COLUMN_DOESNT_EXIST
        return newState
    }
    
    if (rowIndex >= col.length) {
        newState.error = ILLEGAL_MOVE_FULL_COLUMN
        return newState
    }

    newState.board[rowIndex][colIndex] = state.player

    newState.player = (state.player +1) % 2
    
    return newState
}



const ILLEGAL_MOVE_FULL_COLUMN = 0x1
const ILLEGAL_MOVE_COLUMN_DOESNT_EXIST = 0x2

module = module || {};
module.exports = { initCoin, placeCoin, takeTurn, ILLEGAL_MOVE_COLUMN_DOESNT_EXIST, ILLEGAL_MOVE_FULL_COLUMN };