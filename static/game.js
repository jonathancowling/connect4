document.addEventListener('newstate', onNewStatePlaceCoinFactory(initCoin, setSlot, getColor));
document.addEventListener('newstate', onNewStateResetSelectedColumnFactory());
document.addEventListener('newstate', onNewStateMaybeEmitGameOver);
document.addEventListener('gameover', onGameOverShowWinnerFactory(getColor));
document.addEventListener('gameerror', onGameErrorShowNotification);
document.addEventListener(
  'columnselected',
  onColumnSelectedTakeTurnFactory(document.querySelector('#drop-button'), takeTurn),
);

getInitialState().then((initialState) => {
  initBoard(initialState.board);

  // FIXME
  document.querySelector('#reset-button').addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('newstate', {
      detail: { state: initialState },
    }));
  });

  Array.from(document.querySelectorAll('.slot')).forEach((element, index) => {
    document.addEventListener('columnselected', onColumnSelectedSetHighlightFactory(index % initialState.board[0].length, element, {
      highlighted: 'lightgrey', unhighlighted: 'white',
    }));
    document.addEventListener('newstate', onNewStateSelectColumnFactory(element, index % initialState.board[0].length));
  });

  document.dispatchEvent(new CustomEvent('newstate', { detail: { state: initialState } }));
});
