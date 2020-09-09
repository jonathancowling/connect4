function takeTurnFactory(checkWinFn) {
  return (state, colIndex) => {
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

    // FIXME: this should be new state
    const { gameOver, winner } = checkWinFn(state);

    newState.gameOver = gameOver;
    newState.winner = winner;

    return newState;
  };
}

const CONSECUTIVE_CELLS_TO_WIN = 4;

function checkWin(state) {
  const numRows = state.board.length;
  if (numRows === 0) {
    return {
      gameOver: true,
      winner: undefined,
    };
  }

  const numCols = state.board[0].length;
  if (numCols === 0) {
    return {
      gameOver: true,
      winner: undefined,
    };
  }

  if (state.moves.length === 0) {
    return {
      gameOver: false,
      winner: undefined,
    };
  }

  const [currentPlayer, rowIndex, colIndex] = state.moves[state.moves.length - 1];

  for (let direction = 0; direction < 8; direction += 1) {
    let rowIndicies;
    let colIndicies;

    switch (direction) {
      case 0:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill(colIndex);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => rowIndex - index);
        break;
      case 1:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => colIndex + index);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => rowIndex - index);
        break;
      case 2:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => colIndex + index);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill(rowIndex);
        break;
      case 3:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => colIndex + index);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => rowIndex + index);
        break;
      case 4:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill(colIndex);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => rowIndex + index);
        break;
      case 5:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => colIndex - index);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => rowIndex + index);
        break;
      case 6:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => colIndex - index);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill(rowIndex);
        break;
      case 7:
        colIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => colIndex - index);
        rowIndicies = Array(CONSECUTIVE_CELLS_TO_WIN)
          .fill()
          .map((_value, index) => rowIndex - index);
        break;
      // no default
    }

    const currentPlayerWon = rowIndicies
      .map((_rowIndex, i) => [_rowIndex, colIndicies[i]])
      .reduce((winningSoFar, [currentRowIndex, currentColIndex]) => {
        if (!winningSoFar) {
          return false;
        }
        if (currentRowIndex < 0 || currentRowIndex >= state.board.length) {
          return false;
        }
        if (currentColIndex < 0 || currentColIndex >= state.board[0].length) {
          return false;
        }
        return state.board[currentRowIndex][currentColIndex] === currentPlayer;
      }, true);

    if (currentPlayerWon) {
      return {
        gameOver: true,
        winner: currentPlayer,
      };
    }
  }

  const boardIsFull = [].concat(...state.board).every((cell) => cell !== null);

  return {
    gameOver: boardIsFull,
    winner: undefined,
  };
}

const ILLEGAL_MOVE_FULL_COLUMN = 0x1;
const ILLEGAL_MOVE_COLUMN_DOESNT_EXIST = 0x2;

/* istanbul ignore next */
// eslint-disable-next-line no-global-assign
module = module || {};
module.exports = {
  takeTurnFactory,
  checkWin,
  ILLEGAL_MOVE_COLUMN_DOESNT_EXIST,
  ILLEGAL_MOVE_FULL_COLUMN,
};
