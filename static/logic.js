// FIXME: delete
const ILLEGAL_MOVE_FULL_COLUMN = 0x1;
const ILLEGAL_MOVE_COLUMN_DOESNT_EXIST = 0x2;

function takeTurnFactory(checkWinFn) {
  return (state, colIndex) => {
    const col = state.board.map((row) => row[colIndex]);

    // get index of last empty row for given column
    const rowIndex = col.length - 1 - col.reverse().findIndex((row) => row === null);

    if (colIndex >= state.board.length) {
      return {
        ...JSON.parse(JSON.stringify(state)),
        error: ILLEGAL_MOVE_COLUMN_DOESNT_EXIST,
      };
    }

    if (rowIndex >= col.length) {
      return {
        ...JSON.parse(JSON.stringify(state)),
        error: ILLEGAL_MOVE_FULL_COLUMN,
      };
    }

    const moves = state.moves.concat([[state.player, rowIndex, colIndex]]);
    const board = JSON.parse(JSON.stringify(state.board));
    board[rowIndex][colIndex] = state.player;
    const player = (state.player + 1) % 2;

    const { gameOver, winner } = checkWinFn({ moves, board, player });

    return {
      moves, board, player, gameOver, winner,
    };
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

/* istanbul ignore next */
// eslint-disable-next-line no-global-assign
module = module || {};
module.exports = {
  takeTurnFactory,
  checkWin,
  ILLEGAL_MOVE_COLUMN_DOESNT_EXIST,
  ILLEGAL_MOVE_FULL_COLUMN,
};
