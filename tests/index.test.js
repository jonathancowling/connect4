const { ApiError, NetworkError } = require('../static/constants.js');

document.dispatchEvent = jest.fn();
beforeEach(() => {
  document.dispatchEvent.mockReset();
});

describe('index', () => {
  let newGame;
  let continueGame;
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {},
    });

    newGame = document.createElement('button');
    newGame.id = 'new-game';
    document.body.appendChild(newGame);

    continueGame = document.createElement('button');
    continueGame.id = 'continue-game';
    document.body.appendChild(continueGame);

    window.ErrorSource = {
      NEW_GAME: Symbol('NEW_GAME'),
    };

    window.ApiError = ApiError;
    window.NetworkError = NetworkError;

    // eslint-disable-next-line global-require
    require('../static/index');
  });

  beforeEach(() => {
    fetch.mockReset();
    fetch.doMock();
  });

  test('continue game should navigate to game', () => {
    window.location.href = '/index.html';
    continueGame.click();
    expect(window.location.href).toBe('./game.html');
  });

  test('new game should fetch a new game navigate to game', async () => {
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
      error: expect.any(ApiError),
      source: window.ErrorSource.NEW_GAME,
    });
    expect(window.location.href).toBe('/index.html');
  });

  test('new game should dispatch a gameerror when fetch throws a network error', async () => {
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
      error: expect.any(NetworkError),
      source: window.ErrorSource.NEW_GAME,
    });
    expect(window.location.href).toBe('/index.html');
  });
});
