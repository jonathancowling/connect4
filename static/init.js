// TODO: this one file will have a function to set event listeners and init board and all that

// i can test this separately by setting globals
const numCols = 5;
const numRows = 5;
const board = [];

Array(numRows).fill(undefined).forEach(() => {
  board.push(new Array(numCols).fill(null));
});

const initialState = {
  board,
  winner: null,
  player: 0,
  moves: [],
};

initBoard(initialState);

document.addEventListener('newstate', onNewStatePlaceCoinFactory(initCoin, placeCoin, getColor));
document.addEventListener('newstate', onNewStateResetSelectedColumnFactory());

Array.from(document.querySelectorAll('.slot')).forEach((element, index) => {
  document.addEventListener('columnselected', onColumnSelectedSetHighlightFactory(index % numCols, element, {
    highlighted: 'lightgrey', unhighlighted: 'white',
  }));
  document.addEventListener('newstate', onNewStateSelectColumnFactory(element, index % numCols));
});

document.addEventListener(
  'columnselected',
  onColumnSelectedTakeTurnFactory(document.querySelector('#drop-button'), takeTurn),
);

document.dispatchEvent(new CustomEvent('newstate', { detail: { state: initialState } }));
