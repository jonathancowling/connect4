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

function onNewStatePlaceCoinFactory(_initCoin, _placeCoin, _getColor) {
  return (/** @type {CustomEvent} */ event) => {
    if (event.detail.state.moves.length === 0) {
      return;
    }

    const [player, row, col] = event.detail.state.moves[event.detail.state.moves.length - 1];

    const rowOffset = row * event.detail.state.board[0].length;

    _placeCoin(_initCoin(_getColor(player)), rowOffset + col);
  };
}

function getColor(player) {
  switch (player) {
    case 0: return 'red';
    case 1: return 'yellow';
    default: return 'transparent';
  }
}

function onNewStateSelectColumnFactory(/** @type {Node} */target, index) {
  let currentClickListener;

  return (/** @type {CustomEvent} */ newStateEvent) => {
    target.removeEventListener('click', currentClickListener);
    currentClickListener = () => {
      document.dispatchEvent(new CustomEvent('columnselected', {
        detail: {
          state: newStateEvent.detail.state,
          index,
        },
      }));
    };
    target.addEventListener('click', currentClickListener);
  };
}

function onNewStateResetSelectedColumnFactory() {
  return () => {
    document.dispatchEvent(new CustomEvent('columnselected', {
      detail: {
        state: null,
        index: null,
      },
    }));
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

function onColumnSelectedSetHighlightFactory(
  index,
  /** @type {Element} */target,
  {
    highlighted, unhighlighted,
  },
) {
  return (columnselectedEvent) => {
    if (columnselectedEvent.detail.index === index) {
      // eslint-disable-next-line no-param-reassign
      target.style.backgroundColor = highlighted;
    } else {
      // eslint-disable-next-line no-param-reassign
      target.style.backgroundColor = unhighlighted;
    }
  };
}

function onColumnSelectedTakeTurnFactory(target, takeTurn) {
  let currentClickListener;

  return (/** @type {CustomEvent} */ columnselectedEvent) => {
    target.removeEventListener('click', currentClickListener);
    currentClickListener = () => {
      // FIXME: only if game's not over
      if (columnselectedEvent.detail.index !== null) {
        document.dispatchEvent(new CustomEvent('newstate', {
          detail: {
            state: takeTurn(columnselectedEvent.detail.state, columnselectedEvent.detail.index),
          },
        }));
      }
    };
    target.addEventListener('click', currentClickListener);
  };
}

function onNewStateMaybeEmitGameOver(event) {
  const { detail: { state } } = event;
  if (state.gameOver) {
    document.dispatchEvent(new CustomEvent('gameover', {
      detail: {
        winner: state.winner,
      },
    }));
  }
}

function onGameOverShowWinnerFactory(getWinnerName) {
  return (event) => {
    const notification = document.createElement('p');
    notification.innerHTML = `${getWinnerName(event.detail.winner)} wins!`;
    const notificationPanel = document.querySelector('#notification-panel');
    notificationPanel.appendChild(notification);
    setTimeout(() => {
      notificationPanel.removeChild(notification);
    }, 3000);
  };
}

/* istanbul ignore next */
// eslint-disable-next-line no-global-assign
module = module || {};
module.exports = {
  initBoard,
  onNewStatePlaceCoinFactory,
  onNewStateSelectColumnFactory,
  onNewStateResetSelectedColumnFactory,
  onNewStateMaybeEmitGameOver,
  initCoin,
  placeCoin,
  getColor,
  onColumnSelectedSetHighlightFactory,
  onColumnSelectedTakeTurnFactory,
  onGameOverShowWinnerFactory,
};
