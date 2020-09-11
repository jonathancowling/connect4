initBoard(INITIAL_STATE.board);

document.addEventListener('newstate', onNewStatePlaceCoinFactory(initCoin, setSlot, getColor));
document.addEventListener('newstate', onNewStateResetSelectedColumnFactory());
document.addEventListener('newstate', onNewStateMaybeEmitGameOver);
document.addEventListener('gameover', onGameOverShowWinnerFactory(getColor));
document.addEventListener(
  'columnselected',
  onColumnSelectedTakeTurnFactory(document.querySelector('#drop-button'), takeTurnFactory(checkWin)),
);

document.querySelector('#reset-button').addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('newstate', {
    detail: { state: INITIAL_STATE },
  }));
});

Array.from(document.querySelectorAll('.slot')).forEach((element, index) => {
  document.addEventListener('columnselected', onColumnSelectedSetHighlightFactory(index % NUM_COLS, element, {
    highlighted: 'lightgrey', unhighlighted: 'white',
  }));
  document.addEventListener('newstate', onNewStateSelectColumnFactory(element, index % NUM_COLS));
});

// TODO: this should be set via request
document.dispatchEvent(new CustomEvent('newstate', { detail: { state: INITIAL_STATE } }));
