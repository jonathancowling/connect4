const {
  initBoard,
  onNewStatePlaceCoinFactory,
  onNewStateSelectColumnFactory,
  onNewStateResetSelectedColumnFactory,
  onNewStateMaybeEmitGameOver,
  initCoin,
  placeCoin,
  onColumnSelectedSetHighlightFactory,
  onColumnSelectedTakeTurnFactory,
  getColor,
  onGameOverShowWinnerFactory,
} = require('../static/ui');

document.dispatchEvent = jest.fn();
beforeEach(() => {
  document.dispatchEvent.mockReset();
});

describe('initCoin', () => {
  it('creates a red coin', () => {
    const template = document.createElement('template');
    template.setAttribute('id', 'coin-template');
    const templateContent = document.createElement('div');
    template.content.appendChild(templateContent);
    document.body.appendChild(template);

    const el = initCoin('red');
    expect(el).toBeInstanceOf(Element);
    expect(el.style.backgroundColor).toBe('red');
  });

  it('creates a yellow coin', () => {
    const template = document.createElement('template');
    template.setAttribute('id', 'coin-template');
    const templateContent = document.createElement('div');
    template.content.appendChild(templateContent);
    document.body.appendChild(template);

    const el = initCoin('yellow');
    expect(el).toBeInstanceOf(Element);
    expect(el.style.backgroundColor).toBe('yellow');
  });
});

describe('placeCoin', () => {
  let board;
  const slots = [];

  afterAll(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  beforeAll(() => {
    board = document.createElement('div');
    board.setAttribute('id', 'main-game');
    Array(5).fill(undefined).forEach(() => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slots.push(slot);
      board.appendChild(slot);
    });
    document.body.appendChild(board);
  });

  const coins = [
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
    null,
    document.createElement('div'),
  ];

  it.each([
    [coins[0], 0, [[coins[0], 1], [null, 0], [null, 0], [null, 0], [null, 0]]],
    [coins[1], 1, [[coins[0], 1], [coins[1], 1], [null, 0], [null, 0], [null, 0]]],
    [coins[2], 2, [[coins[0], 1], [coins[1], 1], [coins[2], 1], [null, 0], [null, 0]]],
    [coins[3], 3, [[coins[0], 1], [coins[1], 1], [coins[2], 1], [coins[3], 1], [null, 0]]],
    [coins[4], 3, [[coins[0], 1], [coins[1], 1], [coins[2], 1], [coins[4], 0], [null, 0]]],
    [coins[5], 1, [[coins[0], 1], [coins[5], 1], [coins[2], 1], [coins[4], 0], [null, 0]]],
  ])('%#. places coins in the correct cells', (coin, index, expected) => {
    placeCoin(coin, index);

    expect(slots[0].childElementCount).toBe(expected[0][1]);
    expect(slots[1].childElementCount).toBe(expected[1][1]);
    expect(slots[2].childElementCount).toBe(expected[2][1]);
    expect(slots[3].childElementCount).toBe(expected[3][1]);
    expect(slots[4].childElementCount).toBe(expected[4][1]);

    expect(slots[0].firstElementChild).toBe(expected[0][0]);
    expect(slots[1].firstElementChild).toBe(expected[1][0]);
    expect(slots[2].firstElementChild).toBe(expected[2][0]);
    expect(slots[3].firstElementChild).toBe(expected[3][0]);
    expect(slots[4].firstElementChild).toBe(expected[4][0]);
  });
});

describe('initBoard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it.each([
    [{
      board: [[null]],
      winner: null,
      player: 0,
    }, 1, 1],
    [{
      board: [[null], [null]],
      winner: null,
      player: 0,
    }, 2, 1],
    [{
      board: [[null, null], [null, null]],
      winner: null,
      player: 0,
    }, 2, 2],
    [{
      board: [[null, null]],
      winner: null,
      player: 0,
    }, 1, 2],
  ])('can create a correct n * m board', (state, n, m) => {
    const board = document.createElement('table');
    board.setAttribute('id', 'main-game');
    document.body.appendChild(board);

    const slotTemplate = document.createElement('template');
    slotTemplate.id = 'slot-template';
    const slotTemplateContent = document.createElement('div');
    slotTemplateContent.classList.add('slot');
    slotTemplate.content.appendChild(slotTemplateContent);
    document.body.appendChild(slotTemplate);

    initBoard(state);
    expect(board.childElementCount).toBe(n);
    Array.from(board.children).forEach((row) => {
      expect(row.nodeName).toBe('TR');
      expect(row.childElementCount).toBe(m);
      Array.from(row.children).forEach((cell) => {
        expect(cell.nodeName).toBe('TD');
        expect(cell.childElementCount).toBe(1);
        expect(
          cell.firstElementChild.isEqualNode(slotTemplate.content.firstElementChild),
        ).toBe(true);
      });
    });
  });
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
      0,
    ],
    [
      {
        board: [[0, 1]],
        winner: null,
        player: 0,
        moves: [[0, 0, 0], [1, 0, 1]],
      },
      1,
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
      0,
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
      3,
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

      expect(mockGetColor.mock.calls).toEqual(cells.map((player) => [player]));
      expect(mockInitCoin.mock.calls).toEqual(cells.map(() => ['bg-color']));
      expect(mockPlaceCoin.mock.calls).toEqual(cells.map((_player, index) => [
        mockInitCoin.mock.results[index].value,
        index,
      ]));
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

describe('on game over', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
  });

  test('notification shown for a fixed amount of time', () => {
    const mockGetColor = jest.fn(() => 'red');
    const winner = 0;

    const notificationPanel = document.createElement('section');
    notificationPanel.id = 'notification-panel';
    document.body.appendChild(notificationPanel);

    onGameOverShowWinnerFactory(mockGetColor)(new CustomEvent('gameover', {
      detail: { winner },
    }));
    expect(mockGetColor.mock.calls).toEqual([
      [winner],
    ]);

    expect(notificationPanel.firstElementChild.innerHTML).toBe('red wins!');

    jest.advanceTimersByTime(3000);

    expect(notificationPanel.hasChildNodes()).toBe(false);
  });
});

describe('on column selected', () => {
  test('columns colors are set correctly', () => {
    const target = {
      style: {
        backgroundColor: undefined,
      },
    };

    const index = 0;
    const highlighted = 'red';
    const unhighlighted = 'blue';

    const onColumnSelectedSetHighlight = onColumnSelectedSetHighlightFactory(
      index,
      target,
      { highlighted, unhighlighted },
    );

    const highlightEvent = new CustomEvent('columnselected', { detail: { index, state: null } });
    onColumnSelectedSetHighlight(highlightEvent);

    expect(target.style.backgroundColor).toBe(highlighted);

    const unHighlightEvent = new CustomEvent('columnselected', { detail: { index: index + 1, state: null } });
    onColumnSelectedSetHighlight(unHighlightEvent);

    expect(target.style.backgroundColor).toBe(unhighlighted);
  });

  test('when a column is selected the drop button replaces takeTurn on click', () => {
    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const expectedNewState = {};
    const takeTurn = jest.fn().mockReturnValue(expectedNewState);

    const state = {};
    const index = 0;
    const event1 = new CustomEvent('columnselected', { detail: { index, state } });
    const event2 = new CustomEvent('columnselected', { detail: { index, state } });

    const onColumnSelectedTakeTurn = onColumnSelectedTakeTurnFactory(target, takeTurn);

    onColumnSelectedTakeTurn(event1);
    onColumnSelectedTakeTurn(event2);

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

    expect(takeTurn.mock.calls).toEqual([
      [state, index],
    ]);

    expect(document.dispatchEvent.mock.calls[0].length).toBe(1);

    expect(document.dispatchEvent.mock.calls).toEqual([
      [expect.any(CustomEvent)],
    ]);
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('newstate');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({ state: event2.detail.state });
  });

  test('when no column is selected the drop button removes takeTurn on click', () => {
    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const expectedNewState = {};
    const takeTurn = jest.fn().mockReturnValue(expectedNewState);

    const state = {};
    const index = null;
    const event1 = new CustomEvent('columnselected', { detail: { index, state } });

    const onColumnSelectedTakeTurn = onColumnSelectedTakeTurnFactory(target, takeTurn);

    onColumnSelectedTakeTurn(event1);

    expect(target.addEventListener.mock.calls).toEqual([
      ['click', expect.any(Function)],
    ]);

    const firstClickListener = target.addEventListener.mock.calls[0][1];

    expect(target.removeEventListener.mock.calls).toEqual([
      ['click', undefined],
    ]);

    firstClickListener();

    expect(takeTurn).not.toBeCalled();
  });
});

describe('getColor', () => {
  it.each([
    [0, 'red'],
    [1, 'yellow'],
    [-1, 'transparent'],
  ])('assigns player "%d" color "%s"', (player, expectedColor) => {
    expect(getColor(player)).toBe(expectedColor);
  });
});
