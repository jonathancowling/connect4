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

module = module || {};
module.exports = { initCoin };