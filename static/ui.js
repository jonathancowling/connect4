function initBoard(state) {
  const board = document.querySelector('#main-game');
  const slot = document.querySelector('#slot-template').content;

  state.board.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach(() => {
      const td = document.createElement('td');
      td.appendChild(slot.cloneNode(true).firstElementChild);
      tr.appendChild(td);
    });
    board.appendChild(tr);
  });
}

function onNewStatePlaceCoinFactory(_initCoin, _placeCoin) {
  return (/** @type {CustomEvent} */ event) => {
    const [, row, col] = event.detail.state.moves[event.detail.state.moves.length - 1];

    const rowOffset = row * event.detail.state.board[0].length;

    _placeCoin(_initCoin(), rowOffset + col);
  };
}

function onNewStateSelectColumnFactory(/** @type {Node} */target, index) {
  let currentClickListener;

  return (/** @type {CustomEvent} */ newStateEvent) => {
    target.removeEventListener('click', currentClickListener);
    currentClickListener = () => {
      target.dispatchEvent(new CustomEvent('columnselected', {
        detail: {
          state: newStateEvent.detail.state,
          index,
        },
      }));
    };
    target.addEventListener('click', currentClickListener);
  };
}

/**
 * @returns {Element}
 */
function initCoin(color) {
  const coin = document
    .querySelector('#coin-template')
    .content
    .cloneNode(true)
    .firstElementChild;

  coin.style.backgroundColor = color;

  return coin;
}

function placeCoin(coin, index) {
  document
    .querySelector('#main-game')
    .querySelectorAll('.slot')[index]
    .appendChild(coin);
}

// eslint-disable-next-line no-unused-vars
function selectColumnFactory(_index) {
  // eslint-disable-next-line no-unused-vars
  return (/** @type {Event} */ _event) => {};
}

// eslint-disable-next-line no-global-assign
module = module || {};
module.exports = {
  initBoard,
  onNewStatePlaceCoinFactory,
  onNewStateSelectColumnFactory,
  initCoin,
  placeCoin,
  selectColumnFactory,
};
