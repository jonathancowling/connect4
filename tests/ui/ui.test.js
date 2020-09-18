const {
  initBoard,
  initCoin,
  setSlot,
  getColor,
} = require('../../static/ui');

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
    board.id = 'main-game';
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
    setSlot(coin, index);

    slots.forEach((slot, i) => {
      expect(slot.firstElementChild).toBe(expected[i][0]);
      expect(slot.childElementCount).toBe(expected[i][1]);
    });
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

    initBoard(state.board);
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

describe('getColor', () => {
  it.each([
    [0, 'red'],
    [1, 'yellow'],
    [-1, 'transparent'],
  ])('assigns player "%d" color "%s"', (player, expectedColor) => {
    expect(getColor(player)).toBe(expectedColor);
  });
});
