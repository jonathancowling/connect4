/**
 * @jest-environment node
 */

const {
  takeTurnFactory,
  checkWin,
  ILLEGAL_MOVE_FULL_COLUMN,
  ILLEGAL_MOVE_COLUMN_DOESNT_EXIST,
} = require('../logic');

describe('takeTurn', () => {
  it.each([
    [
      {
        board: [
          [null, null],
          [null, null],
        ],
        moves: [],
        gameOver: false,
        winner: null,
        player: 0,
      },
      jest.fn(() => ({ gameOver: false, winner: null })),
      0,
      {
        board: [
          [null, null],
          [0, null],
        ],
        moves: [[0, 1, 0]],
        gameOver: false,
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
        gameOver: false,
        winner: null,
        player: 0,
      },
      jest.fn(() => ({ gameOver: false, winner: null })),
      0,
      {
        board: [
          [0, null],
          [0, null],
        ],
        moves: [[0, 1, 0], [0, 0, 0]],
        gameOver: false,
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
        gameOver: false,
        winner: null,
        player: 0,
      },
      jest.fn(() => ({ gameOver: false, winner: null })),
      1,
      {
        board: [
          [0, null],
          [0, 0],
        ],
        gameOver: false,
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
        gameOver: false,
        winner: null,
        player: 0,
      },
      jest.fn(() => ({ gameOver: false, winner: null })),
      1,
      {
        board: [
          [0, 0],
          [0, 0],
        ],
        moves: [[0, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 1]],
        gameOver: false,
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
        gameOver: false,
        winner: null,
        moves: [[0, 1, 0], [0, 0, 0]],
        player: 1,
      },
      jest.fn(() => ({ gameOver: false, winner: null })),
      1,
      {
        board: [
          [0, null],
          [0, 1],
        ],
        moves: [[0, 1, 0], [0, 0, 0], [1, 1, 1]],
        gameOver: false,
        winner: null,
        player: 0,
      },
    ],
    [
      {
        board: [
          [0, null],
          [0, null],
        ],
        gameOver: false,
        winner: null,
        moves: [[0, 1, 0], [0, 0, 0]],
        player: 1,
      },
      jest.fn(() => ({ gameOver: true, winner: 0 })),
      1,
      {
        board: [
          [0, null],
          [0, 1],
        ],
        moves: [[0, 1, 0], [0, 0, 0], [1, 1, 1]],
        gameOver: true,
        winner: 0,
        player: 0,
      },
    ],
  ])('%#. correctly updates board and player (happy path)', (initialState, mockCheckWin, col, expectedState) => {
    expect(takeTurnFactory(mockCheckWin)(initialState, col)).toEqual(expectedState);

    const checkWinState = {
      player: expectedState.player,
      moves: expectedState.moves,
      board: expectedState.board,
    };

    expect(mockCheckWin.mock.calls).toEqual([
      [checkWinState],
    ]);
  });

  it('sets full column error if coin placed on full column', () => {
    const initialState = {
      board: [
        [0],
      ],
      gameOver: false,
      winner: null,
      moves: [],
      player: 0,
    };

    const expectedState = {
      board: [
        [0],
      ],
      moves: [],
      gameOver: false,
      winner: null,
      player: 0,
      error: ILLEGAL_MOVE_FULL_COLUMN,
    };

    expect(takeTurnFactory()(initialState, 0)).toEqual(expectedState);
  });

  it('sets no column exists error if coin placed on a column that doesn\'t exists', () => {
    const initialState = {
      board: [
        [null],
      ],
      moves: [],
      gameOver: false,
      winner: null,
      player: 0,
    };

    const expectedState = {
      board: [
        [null],
      ],
      gameOver: false,
      winner: null,
      player: 0,
      moves: [],
      error: ILLEGAL_MOVE_COLUMN_DOESNT_EXIST,
    };

    const mockCheckWin = jest.fn(() => ({ gameOver: false, winner: null }));

    expect(takeTurnFactory(mockCheckWin)(initialState, 1)).toEqual(expectedState);
  });

  it('clears error on legal move', () => {
    const initialState = {
      board: [
        [null, null],
        [null, null],
      ],
      moves: [],
      gameOver: false,
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
      gameOver: false,
      winner: null,
      player: 1,
    };

    const mockCheckWin = jest.fn(() => ({ gameOver: false, winner: null }));

    expect(takeTurnFactory(mockCheckWin)(initialState, 0)).toEqual(expectedState);
  });
});

test.each([
  [
    { board: [], moves: [] },
    {
      gameOver: true,
      winner: null,
    },
  ],
  [
    { board: [[]], moves: [] },
    {
      gameOver: true,
      winner: null,
    },
  ],
  [
    { board: [[null]], moves: [] },
    {
      gameOver: false,
      winner: null,
    },
  ],
  [
    { board: [[0]], moves: [[0, 0, 0]] },
    {
      gameOver: true,
      winner: null,
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
      winner: null,
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
      winner: null,
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
      winner: null,
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
      winner: null,
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
      winner: null,
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
      winner: null,
    },
  ],

])('%#. checkWin returns the winner and game over state correctly', (board, expectedResult) => {
  expect(checkWin(board)).toEqual(expectedResult);
});
