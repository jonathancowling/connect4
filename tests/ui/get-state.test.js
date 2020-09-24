window.ErrorSource = {
  INIT_GAME: Symbol('INIT_GAME'),
};

const {
  getState,
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

    const actualInitialstate = await getState();

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);

    expect(actualInitialstate).toBe(expectedInitialState);
  });

  test('rejects with a gameerror when fetch returns a http error', async () => {
    fetch.mockResponse(null, { status: 400 });
    window.ApiError = jest.fn();

    const expectReason = await expect(getState()).rejects;
    await expectReason.toBeInstanceOf(window.ApiError);
    expect(window.ApiError).toBeCalledWith({ source: window.ErrorSource.INIT_GAME });

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
  });

  test('dispatches a gameerror when fetch throws a network error', async () => {
    fetch.mockReject(new Error());
    window.NetworkError = jest.fn();

    const expectReason = await expect(getState()).rejects;
    await expectReason.toBeInstanceOf(window.NetworkError);
    expect(window.NetworkError).toBeCalledWith({ source: window.ErrorSource.INIT_GAME });

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
  });
});
