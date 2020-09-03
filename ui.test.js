const {
  initBoard,
  onNewStatePlaceCoinFactory,
  onNewStateSelectColumnFactory,
  initCoin,
  placeCoin,
} = require('./static/ui');

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
    Array(4).fill(undefined).forEach(() => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slots.push(slot);
      board.appendChild(slot);
    });
    document.body.appendChild(board);
  });

  const coin1 = document.createElement('div');
  const coin2 = document.createElement('div');
  const coin3 = document.createElement('div');
  const coin4 = document.createElement('div');

  it.each([
    [coin1, 0, [coin1, null, null, null]],
    [coin2, 1, [coin1, coin2, null, null]],
    [coin3, 2, [coin1, coin2, coin3, null]],
    [coin4, 3, [coin1, coin2, coin3, coin4]],
  ])('places coins in the correct cells', (coin, index, expected) => {
    placeCoin(coin, index);
    expect(slots[0].firstElementChild).toBe(expected[0]);
    expect(slots[1].firstElementChild).toBe(expected[1]);
    expect(slots[2].firstElementChild).toBe(expected[2]);
    expect(slots[3].firstElementChild).toBe(expected[3]);
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
    'coins are placed in the correct places',
    (state, expectedCoinLocation) => {
      const e = new CustomEvent('newstate', {
        target: jest.fn(),
        detail: { state },
      });

      const mockCoin = jest.fn();
      const mockInitCoin = jest.fn(() => mockCoin);
      const mockPlaceCoin = jest.fn();
      const mockSelectColumnFactory = jest.fn();
      mockSelectColumnFactory.bind = jest.fn();

      const listener = jest.fn();

      mockSelectColumnFactory.mockImplementation(() => listener);

      onNewStatePlaceCoinFactory(mockInitCoin, mockPlaceCoin)(e);

      expect(mockInitCoin.mock.calls).toEqual([[]]);
      expect(mockPlaceCoin.mock.calls).toEqual([[mockCoin, expectedCoinLocation]]);
    },
  );

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
      dispatchEvent: jest.fn(),
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

    expect(target.dispatchEvent.mock.calls).toEqual([
      [expect.any(CustomEvent)],
    ]);
    expect(target.dispatchEvent.mock.calls[0][0].type).toBe('columnselected');
    expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
      state: event2.detail.state,
      index: expectedIndex,
    });
  });
});

describe('on column selected', () => {
  test.todo('columns colors are set correctly');
  test.todo('the drop button sets up takeTurn on click');
});
