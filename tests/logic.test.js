const {
  takeTurn,
  checkWin,
  ILLEGAL_MOVE_FULL_COLUMN,
  ILLEGAL_MOVE_COLUMN_DOESNT_EXIST,
} = require('../static/logic');

describe('takeTurn', () => {
  it.each([
    [
      {
        board: [
          [null, null],
          [null, null],
        ],
        moves: [],
        winner: null,
        player: 0,
      },
      0,
      {
        board: [
          [null, null],
          [0, null],
        ],
        moves: [[0, 1, 0]],
        winner: null,
        player: 1,
      },
    ],
    [
      {
        board: [
          [null, null],
          [0, null],
        ],
        moves: [[0, 1, 0]],
        winner: null,
        player: 0,
      },
      0,
      {
        board: [
          [0, null],
          [0, null],
        ],
        moves: [[0, 1, 0], [0, 0, 0]],
        winner: null,
        player: 1,
      },
    ],
    [
      {
        board: [
          [0, null],
          [0, null],
        ],
        moves: [[0, 1, 0], [0, 0, 0]],
        winner: null,
        player: 0,
      },
      1,
      {
        board: [
          [0, null],
          [0, 0],
        ],
        winner: null,
        moves: [[0, 1, 0], [0, 0, 0], [0, 1, 1]],
        player: 1,
      },
    ],
    [
      {
        board: [
          [0, null],
          [0, 0],
        ],
        moves: [[0, 1, 0], [0, 0, 0], [0, 1, 1]],
        winner: null,
        player: 0,
      },
      1,
      {
        board: [
          [0, 0],
          [0, 0],
        ],
        moves: [[0, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 1]],
        winner: null,
        player: 1,
      },
    ],
    [
      {
        board: [
          [0, null],
          [0, null]],
        winner: null,
        moves: [[0, 1, 0], [0, 0, 0]],
        player: 1,
      },
      1,
      {
        board: [
          [0, null],
          [0, 1],
        ],
        moves: [[0, 1, 0], [0, 0, 0], [1, 1, 1]],
        winner: null,
        player: 0,
      },
    ],
  ])('correctly updates board and player (happy path)', (initialState, col, expectedState) => {
    expect(takeTurn(initialState, col)).toEqual(expectedState);
  });

  it('sets full column error if coin placed on full column', () => {
    const initialState = {
      board: [
        [0],
      ],
      winner: null,
      moves: [],
      player: 0,
    };

    const expectedState = {
      board: [
        [0],
      ],
      moves: [],
      winner: null,
      player: 0,
      error: ILLEGAL_MOVE_FULL_COLUMN,
    };

    expect(takeTurn(initialState, 0)).toEqual(expectedState);
  });

  it('sets no column exists error if coin placed on a column that doesn\'t exists', () => {
    const initialState = {
      board: [
        [null],
      ],
      moves: [],
      winner: null,
      player: 0,
    };

    const expectedState = {
      board: [
        [null],
      ],
      winner: null,
      player: 0,
      moves: [],
      error: ILLEGAL_MOVE_COLUMN_DOESNT_EXIST,
    };

    expect(takeTurn(initialState, 1)).toEqual(expectedState);
  });

  it('clears error on legal move', () => {
    const initialState = {
      board: [
        [null, null],
        [null, null],
      ],
      moves: [],
      winner: null,
      player: 0,
      error: ILLEGAL_MOVE_FULL_COLUMN,
    };

    const expectedState = {
      board: [
        [null, null],
        [0, null],
      ],
      moves: [[0, 1, 0]],
      winner: null,
      player: 1,
    };

    expect(takeTurn(initialState, 0)).toEqual(expectedState);
  });
});

test.each([
  [
    { board: [], moves: [] },
    {
      gameOver: true,
      winner: undefined,
    },
  ],
  [
    { board: [[]], moves: [] },
    {
      gameOver: true,
      winner: undefined,
    },
  ],
  [
    { board: [[null]], moves: [] },
    {
      gameOver: false,
      winner: undefined,
    },
  ],
  [
    { board: [[0]], moves: [[0, 0, 0]] },
    {
      gameOver: true,
      winner: undefined,
    },
  ],
  [
    {
      moves: [],
      board: [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
      ],
    },
    {
      gameOver: false,
      winner: undefined,
    },
  ],
  [
    {
      moves: [[0, 5, 0], [0, 4, 0], [0, 3, 0], [0, 1, 0]],
      board: [
        [null, null, null, null, null, null],
        [0, null, null, null, null, null],
        [null, null, null, null, null, null],
        [0, null, null, null, null, null],
        [0, null, null, null, null, null],
        [0, null, null, null, null, null],
      ],
    },
    {
      gameOver: false,
      winner: undefined,
    },
  ],
  [
    {
      moves: [[0, 5, 0], [0, 4, 0], [0, 3, 0], [0, 2, 0]],
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [0, null, null, null, null, null],
        [0, null, null, null, null, null],
        [0, null, null, null, null, null],
        [0, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[0, 4, 1], [0, 3, 1], [0, 2, 1], [0, 1, 1]],
      board: [
        [null, null, null, null, null, null],
        [null, 0, null, null, null, null],
        [null, 0, null, null, null, null],
        [null, 0, null, null, null, null],
        [null, 0, null, null, null, null],
        [null, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[1, 4, 1], [1, 3, 1], [1, 2, 1], [1, 1, 1]],
      board: [
        [null, null, null, null, null, null],
        [null, 1, null, null, null, null],
        [null, 1, null, null, null, null],
        [null, 1, null, null, null, null],
        [null, 1, null, null, null, null],
        [null, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 1,
    },
  ],
  [
    {
      moves: [[0, 5, 0], [0, 5, 1], [0, 5, 2], [0, 5, 4]],
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [0, 0, 0, null, 0, null],
      ],
    },
    {
      gameOver: false,
      winner: undefined,
    },
  ],
  [
    {
      moves: [[0, 5, 0], [0, 5, 1], [0, 5, 2], [0, 5, 3]],
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [0, 0, 0, 0, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[0, 4, 1], [0, 4, 2], [0, 4, 3], [0, 4, 4]],
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, 0, 0, 0, 0, null],
        [null, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[0, 5, 0], [0, 4, 1], [0, 3, 2], [0, 1, 4]],
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, 0, null],
        [null, null, null, null, null, null],
        [null, null, 0, null, null, null],
        [null, 0, null, null, null, null],
        [0, null, null, null, null, null],
      ],
    },
    {
      gameOver: false,
      winner: undefined,
    },
  ],
  [
    {
      moves: [[0, 4, 1], [0, 3, 2], [0, 2, 3], [0, 1, 4]],
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, 0, null],
        [null, null, null, 0, null, null],
        [null, null, 0, null, null, null],
        [null, 0, null, null, null, null],
        [null, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[0, 5, 1], [0, 4, 2], [0, 3, 3], [0, 2, 4]],
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, 0, null, null],
        [null, null, null, 0, null, null, null],
        [null, null, 0, null, null, null, null],
        [null, 0, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[0, 1, 1], [0, 3, 3], [0, 4, 4], [0, 5, 5]],
      board: [
        [null, null, null, null, null, null],
        [null, 0, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, 0, null, null],
        [null, null, null, null, 0, null],
        [null, null, null, null, null, 0],
      ],
    },
    {
      gameOver: false,
      winner: undefined,
    },
  ],
  [
    {
      moves: [[0, 2, 2], [0, 3, 3], [0, 4, 4], [0, 5, 5]],
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, 0, null, null, null],
        [null, null, null, 0, null, null],
        [null, null, null, null, 0, null],
        [null, null, null, null, null, 0],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[0, 1, 1], [0, 2, 2], [0, 3, 3], [0, 4, 4]],
      board: [
        [null, null, null, null, null, null],
        [null, 0, null, null, null, null],
        [null, null, 0, null, null, null],
        [null, null, null, 0, null, null],
        [null, null, null, null, 0, null],
        [null, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [[0, 2, 2], [0, 3, 3], [0, 4, 4], [0, 5, 5]],
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, 0, null, null, null, null],
        [null, null, null, 0, null, null, null],
        [null, null, null, null, 0, null, null],
        [null, null, null, null, null, 0, null],
        [null, null, null, null, null, null, null],
      ],
    },
    {
      gameOver: true,
      winner: 0,
    },
  ],
  [
    {
      moves: [
        [0, 0, 0], [0, 0, 1], [1, 0, 2], [0, 0, 3], [0, 0, 4], [1, 0, 5],
        [0, 1, 0], [0, 1, 1], [1, 1, 2], [0, 1, 3], [0, 1, 4], [1, 1, 5],
        [0, 2, 0], [0, 2, 1], [1, 2, 2], [0, 2, 3], [0, 2, 4], [1, 2, 5],
        [1, 3, 0], [1, 3, 1], [0, 3, 2], [1, 3, 3], [1, 3, 4], [0, 3, 5],
        [1, 4, 0], [1, 4, 1], [0, 4, 2], [1, 4, 3], [1, 4, 4], [0, 4, 5],
        [1, 5, 0], [1, 5, 1], [0, 5, 2], [1, 5, 3], [1, 5, 4], [0, 5, 5],
      ],
      board: [
        [0, 0, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1],
        [1, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0],
      ],
    },
    {
      gameOver: true,
      winner: undefined,
    },
  ],

])('%#. checkWin returns the winner and game over state correctly', (board, expectedResult) => {
  expect(checkWin(board)).toEqual(expectedResult);
});

// TODO: test takeTurn uses checkWin
