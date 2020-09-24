const { flushPromises } = require('./flush-promises');

/* eslint-disable global-require */
describe('game', () => {
  const initialState = {
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  test('is initialised correctly', async () => {
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
    window.onGameErrorShowNotification = jest.fn(() => ({}));
    window.onColumnSelectedTakeTurnFactory = jest.fn(() => ({}));
    window.takeTurn = jest.fn(() => ({}));
    window.getState = jest.fn(async () => initialState);
    window.checkWin = jest.fn(() => ({}));
    window.resetGame = jest.fn();
    document.dispatchEvent = jest.fn();
    document.addEventListener = jest.fn();

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.addEventListener = jest.fn();
    document.body.appendChild(resetButton);

    const dropButton = document.createElement('button');
    dropButton.id = 'drop-button';
    dropButton.addEventListener = jest.fn();
    document.body.appendChild(dropButton);

    const board = document.createElement('div');
    board.id = 'main-game';

    const slots = [];
    Array(5).fill(undefined).forEach(() => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slot.addEventListener = jest.fn();
      slots.push(slot);
      board.appendChild(slot);
    });
    document.body.appendChild(board);

    require('../static/game.js');

    await flushPromises();

    expect(window.getState).toHaveBeenCalledTimes(1);
    expect(window.initBoard.mock.calls).toEqual([[initialState.board]]);
    expect(document.addEventListener).toBeCalledTimes(6 + 2 * slots.length);
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
    expect(document.addEventListener)
      .toBeCalledWith('gameerror', window.onGameErrorShowNotification);
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
  });

  test('handles initilisation error', async () => {
    window.onNewStatePlaceCoinFactory = jest.fn(() => ({}));
    window.onNewStateResetSelectedColumnFactory = jest.fn(() => ({}));
    window.onColumnSelectedSetHighlightFactory = jest.fn(() => ({}));
    window.onNewStateMaybeEmitGameOver = jest.fn(() => ({}));
    window.onNewStateSelectColumnFactory = jest.fn(() => ({}));
    window.onGameOverShowWinnerFactory = jest.fn(() => ({}));
    window.onGameErrorShowNotification = jest.fn(() => ({}));
    const errorDetails = {};
    window.getState = jest.fn().mockRejectedValue({
      detail: errorDetails,
    });
    const mockDispatchEvent = jest.spyOn(document, 'dispatchEvent');
    const mockAddEventListener = jest.spyOn(document, 'addEventListener');

    const board = document.createElement('div');
    board.id = 'main-game';
    document.body.appendChild(board);

    const dropButton = document.createElement('button');
    dropButton.id = 'drop-button';
    dropButton.addEventListener = jest.fn();
    document.body.appendChild(dropButton);

    require('../static/game.js');

    await flushPromises();

    expect(window.getState).toHaveBeenCalledTimes(1);

    expect(window.initBoard).not.toHaveBeenCalled();

    expect(mockAddEventListener).toBeCalledTimes(6);
    expect(mockAddEventListener)
      .toBeCalledWith('newstate', window.onNewStatePlaceCoinFactory.mock.results[0].value);
    expect(mockAddEventListener)
      .toBeCalledWith('newstate', window.onNewStateResetSelectedColumnFactory.mock.results[0].value);
    expect(mockAddEventListener)
      .toBeCalledWith('newstate', window.onNewStateMaybeEmitGameOver);
    expect(mockAddEventListener)
      .toBeCalledWith('gameover', window.onGameOverShowWinnerFactory.mock.results[0].value);
    expect(mockAddEventListener)
      .toBeCalledWith('columnselected', window.onColumnSelectedTakeTurnFactory.mock.results[0].value);
    expect(mockAddEventListener)
      .toBeCalledWith('gameerror', window.onGameErrorShowNotification);

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

    expect(mockDispatchEvent).toBeCalledTimes(1);
    expect(mockDispatchEvent).toBeCalledWith(expect.any(CustomEvent));
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('gameerror');
    expect(mockDispatchEvent.mock.calls[0][0].detail).toBe(errorDetails);
  });

  test('resets the game when reset button is clicked and fetches successfully', async () => {
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
    window.onGameErrorShowNotification = jest.fn(() => ({}));
    window.onColumnSelectedTakeTurnFactory = jest.fn(() => ({}));
    window.takeTurn = jest.fn(() => ({}));
    window.getState = jest.fn(async () => initialState);
    window.checkWin = jest.fn(() => ({}));
    window.resetGame = jest.fn();
    document.dispatchEvent = jest.fn();
    document.addEventListener = jest.fn();

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.addEventListener = jest.fn();
    document.body.appendChild(resetButton);

    const dropButton = document.createElement('button');
    dropButton.id = 'drop-button';
    dropButton.addEventListener = jest.fn();
    document.body.appendChild(dropButton);

    const board = document.createElement('div');
    board.id = 'main-game';

    const slots = [];
    Array(5).fill(undefined).forEach(() => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slot.addEventListener = jest.fn();
      slots.push(slot);
      board.appendChild(slot);
    });
    document.body.appendChild(board);

    require('../static/game.js');

    await flushPromises();

    const resetState = {};
    window.resetGame.mockResolvedValue(resetState);

    document.dispatchEvent.mockClear();
    expect(resetButton.addEventListener).toBeCalledTimes(1);
    await resetButton.addEventListener.mock.calls[0][1]();

    expect(window.resetGame).toBeCalledTimes(1);

    expect(document.dispatchEvent).toBeCalledTimes(1);
    expect(document.dispatchEvent).toBeCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('newstate');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toStrictEqual({ state: resetState });

    expect(dropButton.addEventListener).toBeCalledTimes(0);
  });

  test('emits a gameerror event when the reset button is clicked and resetGame fails', async () => {
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
    window.onGameErrorShowNotification = jest.fn(() => ({}));
    window.onColumnSelectedTakeTurnFactory = jest.fn(() => ({}));
    window.takeTurn = jest.fn(() => ({}));
    window.getState = jest.fn(async () => initialState);
    window.checkWin = jest.fn(() => ({}));
    window.resetGame = jest.fn();
    window.ErrorType = {
      API_ERROR: Symbol('API_ERROR'),
    };
    window.ErrorSource = {
      RESET_GAME: Symbol('RESET_GAME'),
    };
    document.dispatchEvent = jest.fn();
    document.addEventListener = jest.fn();

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.addEventListener = jest.fn();
    document.body.appendChild(resetButton);

    const dropButton = document.createElement('button');
    dropButton.id = 'drop-button';
    dropButton.addEventListener = jest.fn();
    document.body.appendChild(dropButton);

    const board = document.createElement('div');
    board.id = 'main-game';

    const slots = [];
    Array(5).fill(undefined).forEach(() => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slot.addEventListener = jest.fn();
      slots.push(slot);
      board.appendChild(slot);
    });
    document.body.appendChild(board);

    require('../static/game.js');

    await new Promise((resolve) => setImmediate(resolve));

    const expectedDetail = {};
    window.resetGame.mockRejectedValue({ detail: expectedDetail });

    document.dispatchEvent.mockClear();
    expect(resetButton.addEventListener).toBeCalledTimes(1);
    await resetButton.addEventListener.mock.calls[0][1]();

    expect(window.resetGame).toBeCalledTimes(1);

    expect(document.dispatchEvent).toBeCalledTimes(1);
    expect(document.dispatchEvent).toBeCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('gameerror');
    expect(document.dispatchEvent.mock.calls[0][0].detail)
      .toBe(expectedDetail);

    expect(dropButton.addEventListener).toBeCalledTimes(0);
  });
});
