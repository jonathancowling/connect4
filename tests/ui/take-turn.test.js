/* eslint-disable max-classes-per-file */

window.ErrorSource = {
  TAKE_TURN: Symbol('TAKE_TURN'),
};

window.ErrorType = {
  API_ERROR: Symbol('API_ERROR'),
  NETWORK_ERROR: Symbol('NETWORK_ERROR'),
};

const {
  takeTurn,
} = require('../../static/ui');

describe('take turn', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetchMock.doMock();
  });

  it('calls fetch and dispatches a new state event', async () => {
    const expectedNewState = 'this is some state';
    const expectedCol = 0;
    fetch.mockResponseOnce(JSON.stringify({ state: expectedNewState }));

    const actualNewState = await takeTurn(expectedNewState, expectedCol);
    expect(fetch.mock.calls).toEqual([
      ['/api/game/move', {
        body: JSON.stringify({ col: expectedCol }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);

    expect(actualNewState).toBe(expectedNewState);
  });

  test('rejects with an ApiError when fetch returns a http error', async () => {
    const state = 'this is some state';
    const expectedCol = 0;

    fetch.mockResponse(null, { status: 400 });
    window.ApiError = jest.fn();

    const expectReason = await expect(takeTurn(state, expectedCol)).rejects;
    await expectReason.toBeInstanceOf(window.ApiError);
    expect(window.ApiError).toBeCalledWith({ source: window.ErrorSource.TAKE_TURN });

    expect(fetch.mock.calls).toEqual([
      ['/api/game/move', {
        body: JSON.stringify({ col: expectedCol }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
  });

  test('rejects when fetch throws a network error', async () => {
    const state = 'this is some state';
    const expectedCol = 0;

    fetch.mockReject(new Error());
    window.NetworkError = jest.fn();

    const expectReason = await expect(takeTurn(state, expectedCol)).rejects;
    await expectReason.toBeInstanceOf(window.NetworkError);
    expect(window.NetworkError).toBeCalledWith({ source: window.ErrorSource.TAKE_TURN });

    expect(fetch.mock.calls).toEqual([
      ['/api/game/move', {
        body: JSON.stringify({ col: expectedCol }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);
  });
});
