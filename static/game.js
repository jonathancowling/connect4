document.addEventListener('newstate', onNewStatePlaceCoinFactory(initCoin, setSlot, getColor));
document.addEventListener('newstate', onNewStateResetSelectedColumnFactory());
document.addEventListener('newstate', onNewStateMaybeEmitGameOver);
document.addEventListener('gameover', onGameOverShowWinnerFactory(getColor));
document.addEventListener('gameerror', onGameErrorShowNotification);
document.addEventListener(
  'columnselected',
  onColumnSelectedTakeTurnFactory(document.querySelector('#drop-button'), takeTurn),
);

getState().then((state) => {
  initBoard(state.board);

  document.querySelector('#reset-button').addEventListener('click', async () => {
    try {
      const newState = await resetGame();
      document.dispatchEvent(new CustomEvent('newstate', {
        detail: { state: newState },
      }));
    } catch (e) {
      document.dispatchEvent(new CustomEvent('gameerror', { detail: e.detail }));
    }
  });

  Array.from(document.querySelectorAll('.slot')).forEach((element, index) => {
    document.addEventListener('columnselected', onColumnSelectedSetHighlightFactory(index % state.board[0].length, element, {
      highlighted: 'lightgrey', unhighlighted: 'white',
    }));
    document.addEventListener('newstate', onNewStateSelectColumnFactory(element, index % state.board[0].length));
  });

  document.dispatchEvent(new CustomEvent('newstate', { detail: { state } }));
}).catch((e) => {
  document.dispatchEvent(new CustomEvent('gameerror', { detail: e.detail }));
});
