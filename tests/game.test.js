/* eslint-disable global-require */
describe('game', () => {
  let resetButton;
  let dropButton;
  const slots = [];
  const initialState = {
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };

  beforeAll(() => {
    window.initBoard = jest.fn(() => ({}));
    window.onNewStatePlaceCoinFactory = jest.fn(() => ({}));
    window.initCoin = jest.fn(() => ({}));
    window.setSlot = jest.fn(() => ({}));
    window.getColor = jest.fn(() => ({}));
    window.onNewStateResetSelectedColumnFactory = jest.fn(() => ({}));
    window.onColumnSelectedSetHighlightFactory = jest.fn(() => ({}));
    window.onNewStateMaybeEmitGameOver = jest.fn(() => ({}));
    window.onNewStateSelectColumnFactory = jest.fn(() => ({}));
    window.onGameOverShowWinnerFactory = jest.fn(() => ({}));
    window.onColumnSelectedTakeTurnFactory = jest.fn(() => ({}));
    window.takeTurn = jest.fn(() => ({}));
    window.getInitialState = jest.fn(async () => initialState);
    window.checkWin = jest.fn(() => ({}));

    resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.addEventListener = jest.fn();
    document.body.appendChild(resetButton);

    dropButton = document.createElement('button');
    dropButton.id = 'drop-button';
    dropButton.addEventListener = jest.fn();
    document.body.appendChild(dropButton);

    const board = document.createElement('div');
    board.id = 'main-game';

    Array(5).fill(undefined).forEach(() => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slot.addEventListener = jest.fn();
      slots.push(slot);
      board.appendChild(slot);
    });
    document.body.appendChild(board);

    document.dispatchEvent = jest.fn();
    document.addEventListener = jest.fn();
  });

  test('', async () => {
    require('../static/game.js');

    // wait for pending promises by scheduling this after init promises
    await new Promise((resolve) => resolve());

    expect(window.getInitialState).toHaveBeenCalledTimes(1);
    expect(window.initBoard.mock.calls).toEqual([[initialState.board]]);
    expect(document.addEventListener).toBeCalledTimes(5 + 2 * slots.length);
    expect(document.addEventListener)
      .toBeCalledWith('newstate', window.onNewStatePlaceCoinFactory.mock.results[0].value);
    expect(document.addEventListener)
      .toBeCalledWith('newstate', window.onNewStateResetSelectedColumnFactory.mock.results[0].value);
    expect(document.addEventListener)
      .toBeCalledWith('newstate', window.onNewStateMaybeEmitGameOver);
    expect(document.addEventListener)
      .toBeCalledWith('gameover', window.onGameOverShowWinnerFactory.mock.results[0].value);
    expect(document.addEventListener)
      .toBeCalledWith('columnselected', window.onColumnSelectedTakeTurnFactory.mock.results[0].value);
    expect(document.dispatchEvent).toBeCalledTimes(1);
    expect(document.dispatchEvent).toBeCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('newstate');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({ state: initialState });

    expect(window.onNewStatePlaceCoinFactory).toBeCalledTimes(1);
    expect(window.onNewStatePlaceCoinFactory)
      .toBeCalledWith(window.initCoin, window.setSlot, window.getColor);
    expect(window.onNewStateResetSelectedColumnFactory).toBeCalledTimes(1);
    expect(window.onNewStateResetSelectedColumnFactory).toBeCalledWith();
    expect(window.onGameOverShowWinnerFactory).toBeCalledTimes(1);
    expect(window.onGameOverShowWinnerFactory).toBeCalledWith(window.getColor);
    expect(window.onColumnSelectedTakeTurnFactory).toBeCalledTimes(1);
    expect(window.onColumnSelectedTakeTurnFactory)
      .toBeCalledWith(dropButton, window.takeTurn);

    expect(window.onColumnSelectedSetHighlightFactory).toBeCalledTimes(slots.length);
    expect(window.onNewStateSelectColumnFactory).toBeCalledTimes(slots.length);

    slots.forEach((slot, index) => {
      expect(document.addEventListener)
        .toBeCalledWith(
          'columnselected',
          window.onColumnSelectedSetHighlightFactory.mock.results[index].value,
        );
      expect(window.onColumnSelectedSetHighlightFactory)
        .toHaveBeenNthCalledWith(
          index + 1,
          index % initialState.board[0].length,
          slot,
          expect.objectContaining({
            highlighted: expect.any(String),
            unhighlighted: expect.any(String),
          }),
        );
      expect(document.addEventListener)
        .toBeCalledWith(
          'newstate',
          window.onNewStateSelectColumnFactory.mock.results[index].value,
        );
      expect(window.onNewStateSelectColumnFactory)
        .toHaveBeenNthCalledWith(index + 1, slot, index % initialState.board[0].length);
    });

    expect(resetButton.addEventListener).toBeCalledTimes(1);
    expect(resetButton.addEventListener).toBeCalledWith('click', expect.any(Function));

    document.dispatchEvent.mockClear();
    resetButton.addEventListener.mock.calls[0][1]();
    expect(document.dispatchEvent).toBeCalledTimes(1);
    expect(document.dispatchEvent).toBeCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('newstate');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({ state: initialState });

    expect(dropButton.addEventListener).toBeCalledTimes(0);
  });
});
