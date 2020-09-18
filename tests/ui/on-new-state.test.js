const {
  onNewStatePlaceCoinFactory,
  onNewStateSelectColumnFactory,
  onNewStateResetSelectedColumnFactory,
  onNewStateMaybeEmitGameOver,
} = require('../../static/ui');

document.dispatchEvent = jest.fn();
beforeEach(() => {
  document.dispatchEvent.mockReset();
});

describe('on new state', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  test.each([
    [
      {
        board: [[0]],
        winner: null,
        player: 0,
        moves: [[0, 0, 0]],
      },
    ],
    [
      {
        board: [[0, 1]],
        winner: null,
        player: 0,
        moves: [[0, 0, 0], [1, 0, 1]],
      },
    ],
    [
      {
        board: [
          [1],
          [0],
        ],
        winner: null,
        player: 0,
        moves: [[0, 1, 0], [1, 0, 0]],
      },
    ],
    [
      {
        board: [
          [1, null],
          [0, 1],
        ],
        winner: null,
        player: 0,
        moves: [[0, 1, 0], [1, 1, 0], [1, 1, 1]],
      },
    ],
    [
      {
        board: [[0]],
        winner: null,
        player: 0,
        moves: [],
      },
    ],
  ])(
    '%#. coins are placed in the correct places',
    (state) => {
      const e = new CustomEvent('newstate', {
        target: jest.fn(),
        detail: { state },
      });

      const mockInitCoin = jest.fn(() => jest.fn());
      const mockPlaceCoin = jest.fn();
      const mockGetColor = jest.fn();

      mockGetColor.mockReturnValue('bg-color');

      const cells = state.board.flat();

      onNewStatePlaceCoinFactory(mockInitCoin, mockPlaceCoin, mockGetColor)(e);

      expect(mockGetColor.mock.calls).toEqual(
        cells.filter((player) => player !== null).map((player) => [player]),
      );
      expect(mockInitCoin.mock.calls).toEqual(
        cells.filter((player) => player !== null).map(() => ['bg-color']),
      );

      const entries = cells.map((player, location) => [player, location]);
      const mockPlaceCoinNonNullCoins = entries
        .filter(([player]) => player !== null)
        .map(([, location], index) => [mockInitCoin.mock.results[index].value, location]);

      const mockPlaceCoinNullCoins = entries
        .filter(([player]) => player === null)
        .map(([, location]) => [null, location]);

      const expectedMockPlaceCoinCalls = [
        ...mockPlaceCoinNonNullCoins,
        ...mockPlaceCoinNullCoins,
      ].sort(([, leftLocation], [, rightLocation]) => leftLocation - rightLocation);

      expect(mockPlaceCoin.mock.calls).toEqual(expectedMockPlaceCoinCalls);
    },
  );

  test.each([
    [
      {
        board: [
          [1, null],
          [0, 1],
        ],
        winner: undefined,
        gameOver: false,
        player: 0,
        moves: [[0, 1, 0], [1, 1, 0], [1, 1, 1]],
      },
    ],
    [
      {
        board: [
          [1, null],
          [0, 1],
        ],
        winner: undefined,
        gameOver: true,
        player: 0,
        moves: [[0, 1, 0], [1, 1, 0], [1, 1, 1]],
      },
    ],
    [
      {
        board: [
          [1, null],
          [0, 1],
        ],
        winner: 0,
        gameOver: true,
        player: 0,
        moves: [[0, 1, 0], [1, 1, 0], [1, 1, 1]],
      },
    ],
  ])('%#. if there\'s a winner, emit a gameover event', (state) => {
    const e = new CustomEvent('newstate', {
      target: jest.fn(),
      detail: { state },
    });

    onNewStateMaybeEmitGameOver(e);

    if (state.gameOver) {
      expect(document.dispatchEvent.mock.calls).toEqual([
        [expect.any(CustomEvent)],
      ]);

      expect(document.dispatchEvent.mock.calls[0][0].type).toEqual('gameover');
      expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({
        winner: state.winner,
      });
    } else {
      expect(document.dispatchEvent).not.toBeCalled();
    }
  });

  test('selected column is reset', () => {
    const e = new CustomEvent('newstate', {
      target: jest.fn(),
      detail: {
        state: null,
      },
    });

    onNewStateResetSelectedColumnFactory()(e);

    expect(document.dispatchEvent.mock.calls).toEqual([
      [expect.any(CustomEvent)],
    ]);

    expect(document.dispatchEvent.mock.calls[0][0].type).toEqual('columnselected');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({
      index: null,
      state: null,
    });
  });

  test('no coins are placed if there are no moves', () => {
    const e = new CustomEvent('newstate', {
      target: jest.fn(),
      detail: {
        state: {
          board: [],
          winner: null,
          player: 0,
          moves: [],
        },
      },
    });

    const mockCoin = jest.fn();
    const mockInitCoin = jest.fn(() => mockCoin);
    const mockPlaceCoin = jest.fn();
    const mockSelectColumnFactory = jest.fn();

    const listener = jest.fn();

    mockSelectColumnFactory.mockImplementation(() => listener);

    onNewStatePlaceCoinFactory(mockInitCoin, mockPlaceCoin)(e);

    expect(mockInitCoin).not.toHaveBeenCalled();
    expect(mockPlaceCoin).not.toHaveBeenCalled();
  });

  test('columnselected emiting click listeners are replaced', () => {
    const event1 = new CustomEvent('newstate', {
      detail: { state: jest.fn() },
    });

    const event2 = new CustomEvent('newstate', {
      detail: { state: jest.fn() },
    });

    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const expectedIndex = 0;

    const selectColumn = onNewStateSelectColumnFactory(target, expectedIndex);
    selectColumn(event1);
    selectColumn(event2);

    expect(target.addEventListener.mock.calls).toEqual([
      ['click', expect.any(Function)],
      ['click', expect.any(Function)],
    ]);

    const firstClickListener = target.addEventListener.mock.calls[0][1];

    expect(target.removeEventListener.mock.calls).toEqual([
      ['click', undefined],
      ['click', firstClickListener],
    ]);

    const secondClickListener = target.addEventListener.mock.calls[1][1];
    secondClickListener();

    expect(document.dispatchEvent.mock.calls).toEqual([
      [expect.any(CustomEvent)],
    ]);
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('columnselected');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({
      state: event2.detail.state,
      index: expectedIndex,
    });
  });

  test('if game over columnselected emiting click listeners are removed', () => {
    const event1 = new CustomEvent('newstate', {
      detail: {
        state: {
          gameOver: false,
        },
      },
    });
    const event2 = new CustomEvent('newstate', {
      detail: {
        state: {
          gameOver: true,
        },
      },
    });

    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const expectedIndex = 0;

    const selectColumn = onNewStateSelectColumnFactory(target, expectedIndex);
    selectColumn(event1);
    selectColumn(event2);

    expect(target.addEventListener.mock.calls).toEqual([
      ['click', expect.any(Function)],
    ]);

    const firstClickListener = target.addEventListener.mock.calls[0][1];

    expect(target.removeEventListener.mock.calls).toEqual([
      ['click', undefined],
      ['click', firstClickListener],
    ]);
  });
});
