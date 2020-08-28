function initBoard(state) {
    const board = document.querySelector('#main-game')
    const slot = document.querySelector('#slot-template').content

    for (let row of state.board) {
        const tr = document.createElement('tr')
        for (let _ in row) {
            const td = document.createElement('td')
            td.appendChild(slot.cloneNode(true).firstElementChild)
            tr.appendChild(td)
        }
        board.appendChild(tr)
    }
}

module = module || {}
module.exports = { initBoard }