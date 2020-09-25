function initBoard(boardArray) {
  const board = document.querySelector('#main-game');
  const slot = document.querySelector('#slot-template').content;

  boardArray.forEach((row) => {
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
    event.detail.state.board.forEach((row, rowIndex) => {
      row.forEach((player, colIndex) => {
        const rowOffset = rowIndex * event.detail.state.board[0].length;
        if (player === null) {
          _placeCoin(null, rowOffset + colIndex);
        } else {
          _placeCoin(_initCoin(_getColor(player)), rowOffset + colIndex);
        }
      });
    });
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

    if (newStateEvent.detail.state.gameOver) {
      currentClickListener = undefined;
      return;
    }

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

function setSlot(coin, index) {
  const slot = document
    .querySelector('#main-game')
    .querySelectorAll('.slot')[index];

  slot.innerHTML = '';

  if (coin !== null) {
    slot.appendChild(coin);
  }
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

function onColumnSelectedTakeTurnFactory(target, takeTurnFn) {
  let currentClickListener;

  return (/** @type {CustomEvent} */ columnselectedEvent) => {
    target.removeEventListener('click', currentClickListener);
    currentClickListener = async () => {
      if (columnselectedEvent.detail.index !== null) {
        try {
          const newState = await takeTurnFn(
            columnselectedEvent.detail.state,
            columnselectedEvent.detail.index,
          );
          document.dispatchEvent(new CustomEvent('newstate', {
            detail: {
              state: newState,
            },
          }));
        } catch (e) {
          document.dispatchEvent(new CustomEvent('gameerror', {
            detail: e,
          }));
        }
      }
    };
    target.addEventListener('click', currentClickListener);
  };
}

async function getState() {
  try {
    const res = await fetch('/api/game/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return Promise.reject(new ApiError({
        source: ErrorSource.INIT_GAME,
      }));
    }

    return (await res.json()).state;
  } catch {
    return Promise.reject(new NetworkError({
      source: ErrorSource.INIT_GAME,
    }));
  }
}

async function takeTurn(_state, col) {
  try {
    const res = await fetch('/api/game/move', {
      method: 'POST',
      body: JSON.stringify({ col }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return Promise.reject(new ApiError({
        source: ErrorSource.TAKE_TURN,
      }));
    }

    return (await res.json()).state;
  } catch {
    return Promise.reject(new NetworkError({
      source: ErrorSource.TAKE_TURN,
    }));
  }
}

async function resetGame() {
  try {
    const res = await fetch('/api/game/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return Promise.reject(new ApiError({
        source: ErrorSource.RESET_GAME,
      }));
    }

    return (await res.json()).state;
  } catch {
    return Promise.reject(new NetworkError({
      source: ErrorSource.RESET_GAME,
    }));
  }
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

function onGameErrorShowNotification() {
  const notification = document.createElement('p');
  notification.append(document.createTextNode('Oops! Something went wrong, click '));
  const a = document.createElement('a');
  a.setAttribute('href', '..');
  a.textContent = 'here';
  notification.appendChild(a);
  notification.append(document.createTextNode(' to return to main menu.'));
  const notificationPanel = document.querySelector('#notification-panel');
  notificationPanel.appendChild(notification);
}

/* istanbul ignore next */
if (module) {
  module.exports = {
    initBoard,
    onNewStatePlaceCoinFactory,
    onNewStateSelectColumnFactory,
    onNewStateResetSelectedColumnFactory,
    onNewStateMaybeEmitGameOver,
    initCoin,
    setSlot,
    getColor,
    onColumnSelectedSetHighlightFactory,
    onColumnSelectedTakeTurnFactory,
    onGameOverShowWinnerFactory,
    onGameErrorShowNotification,
    takeTurn,
    getState,
    resetGame,
  };
}
