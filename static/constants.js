const NUM_ROWS = 8;
const NUM_COLS = 8;

const INITIAL_STATE = {
  board: Array(NUM_ROWS).fill(undefined).map(() => new Array(NUM_COLS).fill(null)),
  winner: null,
  player: 0,
  moves: [],
};

if (module) {
  module.exports = {
    INITIAL_STATE,
    NUM_COLS,
    NUM_ROWS,
  };
}
