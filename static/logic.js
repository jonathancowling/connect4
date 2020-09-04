function takeTurn(state, colIndex) {
  const newState = JSON.parse(JSON.stringify(state));
  delete newState.error;

  const col = newState.board.map((row) => row[colIndex]);

  // get index of last empty row for given column
  const rowIndex = col.length - 1 - col.reverse().findIndex((row) => row === null);

  if (colIndex >= newState.board.length) {
    // eslint-disable-next-line no-use-before-define
    newState.error = ILLEGAL_MOVE_COLUMN_DOESNT_EXIST;
    return newState;
  }

  if (rowIndex >= col.length) {
    // eslint-disable-next-line no-use-before-define
    newState.error = ILLEGAL_MOVE_FULL_COLUMN;
    return newState;
  }

  newState.moves.push([state.player, rowIndex, colIndex]);
  newState.board[rowIndex][colIndex] = state.player;
  newState.player = (state.player + 1) % 2;

  return newState;
}

const ILLEGAL_MOVE_FULL_COLUMN = 0x1;
const ILLEGAL_MOVE_COLUMN_DOESNT_EXIST = 0x2;

/* istanbul ignore next */
// eslint-disable-next-line no-global-assign
module = module || {};
module.exports = { takeTurn, ILLEGAL_MOVE_COLUMN_DOESNT_EXIST, ILLEGAL_MOVE_FULL_COLUMN };
