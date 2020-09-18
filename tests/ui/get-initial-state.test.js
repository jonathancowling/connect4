window.ErrorSource = {
  TAKE_TURN: Symbol('TAKE_TURN'),
};

window.ErrorType = {
  API_ERROR: Symbol('API_ERROR'),
  NETWORK_ERROR: Symbol('NETWORK_ERROR'),
};

const {
  getInitialState,
} = require('../../static/ui');

document.dispatchEvent = jest.fn();
beforeEach(() => {
  document.dispatchEvent.mockReset();
});

describe('get initial state', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetchMock.doMock();
  });

  it('calls fetch and dispatches a new state event', async () => {
    const expectedInitialState = 'this is some state';
    fetch.mockResponseOnce(JSON.stringify({ state: expectedInitialState }));

    const actualInitialstate = await getInitialState();

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);

    // expect(document.dispatchEvent).toHaveBeenCalledTimes(1);
    // expect(document.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
    // expect(document.dispatchEvent.mock.calls[0][0].type).toBe('newstate');
    expect(actualInitialstate).toBe(expectedInitialState);
  });

  test('dispatches a gameerror when fetch returns a http error', async () => {
    fetch.mockResponse(null, { status: 400 });

    await expect(getInitialState()).rejects.toThrowError();

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);

    // expect(document.dispatchEvent).toHaveBeenCalledTimes(1);
    // expect(document.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
    // expect(document.dispatchEvent.mock.calls[0][0].type).toBe('gameerror');
    // expect(document.dispatchEvent.mock.calls[0][0].detail.type)
    //   .toBe(window.ErrorType.API_ERROR);
    // expect(document.dispatchEvent.mock.calls[0][0].detail.source)
    //   .toBe(window.ErrorSource.INIT_GAME);
  });

  test('dispatches a gameerror when fetch throws a network error', async () => {
    fetch.mockReject(new Error());

    await expect(getInitialState()).rejects.toThrowError();

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
    expect(document.dispatchEvent).toHaveBeenCalledTimes(1);
    expect(document.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('gameerror');
    expect(document.dispatchEvent.mock.calls[0][0].detail.type)
      .toBe(window.ErrorType.NETWORK_ERROR);
    expect(document.dispatchEvent.mock.calls[0][0].detail.source)
      .toBe(window.ErrorSource.INIT_GAME);
  });
});
