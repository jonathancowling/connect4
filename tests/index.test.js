describe('index', () => {
  let newGame;
  let continueGame;
  let joinForm;

  beforeEach(() => {
    document.dispatchEvent = jest.fn();
    document.addEventListener = jest.fn();

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {},
    });

    document.body.innerHTML = '';

    newGame = document.createElement('button');
    newGame.id = 'new-game';
    document.body.appendChild(newGame);

    continueGame = document.createElement('button');
    continueGame.id = 'continue-game';
    document.body.appendChild(continueGame);

    joinForm = document.createElement('form');
    joinForm.id = 'join-form';
    const joinFormCodeInput = document.createElement('input');
    joinFormCodeInput.id = 'game-code-input';
    joinForm.append(joinFormCodeInput);
    document.body.appendChild(joinForm);

    window.ErrorSource = {
      NEW_GAME: Symbol('NEW_GAME'),
    };

    window.ErrorType = {
      API_ERROR: Symbol('API_ERROR'),
      NETWORK_ERROR: Symbol('NETWORK_ERROR'),
    };

    window.onGameErrorShowNotification = jest.fn(() => ({}));

    jest.resetModules();
    fetch.mockReset();
    fetch.doMock();
    document.dispatchEvent.mockReset();
    document.addEventListener.mockReset();
  });

  test('continue game should navigate to game', () => {
    // eslint-disable-next-line global-require
    require('../static/index');

    window.location.href = '/index.html';
    continueGame.click();
    expect(window.location.href).toBe('./game.html');
  });

  test('new game should fetch a new game navigate to game', async () => {
    // eslint-disable-next-line global-require
    require('../static/index');

    window.location.href = '/index.html';
    fetch.mockResponse({
      status: 200,
    });
    newGame.click();

    await new Promise((resolve) => resolve());

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'POST',
      }],
    ]);
    expect(window.location.href).toBe('./game.html');
  });

  test('new game should dispatch a gameerror when fetch returns a http error', async () => {
    // eslint-disable-next-line global-require
    require('../static/index');

    window.location.href = '/index.html';

    fetch.mockResponse(null, { status: 400 });

    newGame.click();

    await new Promise((resolve) => resolve());

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'POST',
      }],
    ]);

    expect(document.dispatchEvent).toBeCalledTimes(1);
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('gameerror');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({
      type: window.ErrorType.API_ERROR,
      source: window.ErrorSource.NEW_GAME,
    });
    expect(window.location.href).toBe('/index.html');
  });

  test('new game should dispatch a gameerror when fetch throws a network error', async () => {
    // eslint-disable-next-line global-require
    require('../static/index');

    window.location.href = '/index.html';
    fetch.mockReject(new Error());
    newGame.click();

    await new Promise((resolve) => resolve());

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'POST',
      }],
    ]);
    expect(document.dispatchEvent).toBeCalledTimes(1);
    expect(document.dispatchEvent).toBeCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('gameerror');
    expect(document.dispatchEvent.mock.calls[0][0].detail).toEqual({
      type: window.ErrorType.NETWORK_ERROR,
      source: window.ErrorSource.NEW_GAME,
    });
    expect(window.location.href).toBe('/index.html');
  });

  test('game error listener is set', () => {
    // eslint-disable-next-line global-require
    require('../static/index');

    expect(document.addEventListener).toBeCalledTimes(1);
    expect(document.addEventListener)
      .toBeCalledWith('gameerror', window.onGameErrorShowNotification);
  });
});
