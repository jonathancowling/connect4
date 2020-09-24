window.ErrorSource = {
  RESET_GAME: Symbol('TAKE_TURN'),
};

const {
  resetGame,
} = require('../../static/ui');

document.dispatchEvent = jest.fn();
beforeEach(() => {
  document.dispatchEvent.mockReset();
});

describe('resetGame', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetchMock.doMock();
  });

  it('calls fetch and returns new state', async () => {
    const newState = 'this is some more state';
    fetch.mockResponseOnce(JSON.stringify({ state: newState }));

    await expect(resetGame()).resolves
      .toStrictEqual(newState);
    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
  });

  test('rejects with an API_ERROR when fetch returns a http error', async () => {
    fetch.mockResponse(null, { status: 400 });
    window.ApiError = jest.fn();

    const expectReason = await expect(resetGame()).rejects;
    await expectReason.toBeInstanceOf(window.ApiError);
    expect(window.ApiError).toBeCalledWith({ source: window.ErrorSource.RESET_GAME });

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
  });

  test('rejects with an NETWORK_ERROR when fetch throws a network error', async () => {
    fetch.mockReject(new Error());
    window.NetworkError = jest.fn();

    const expectReason = await expect(resetGame()).rejects;
    expect(window.NetworkError).toBeCalledWith({ source: window.ErrorSource.RESET_GAME });
    await expectReason.toBeInstanceOf(window.NetworkError);

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
  });
});
