function initBoard(state) {
    const board = document.querySelector('#main-game')

    for (let row of state.board) {
        const tr = document.createElement('tr')
        for (let _ in row) {
            tr.appendChild(document.createElement('td'))
        }
        board.appendChild(tr)
    }
}

module = module || {}
module.exports = { initBoard }