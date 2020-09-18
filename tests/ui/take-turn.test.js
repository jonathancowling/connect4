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

document.dispatchEvent = jest.fn();
beforeEach(() => {
  document.dispatchEvent.mockReset();
});

describe('take turn', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetchMock.doMock();
  });

  it('calls fetch and dispatches a new state event', async () => {
    const state = 'this is some state';
    const expectedCol = 0;
    fetch.mockResponseOnce(JSON.stringify({ state }));

    await takeTurn(state, expectedCol);
    expect(fetch.mock.calls).toEqual([
      ['/api/game/move', {
        body: JSON.stringify({ col: expectedCol }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);

    expect(document.dispatchEvent).toHaveBeenCalledTimes(1);
    expect(document.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('newstate');
    expect(document.dispatchEvent.mock.calls[0][0].detail.state).toBe(state);
  });

  test('dispatches a gameerror when fetch returns a http error', async () => {
    const state = 'this is some state';
    const expectedCol = 0;

    fetch.mockResponse(null, { status: 400 });

    await takeTurn(state, expectedCol);

    expect(fetch.mock.calls).toEqual([
      ['/api/game/move', {
        body: JSON.stringify({ col: expectedCol }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }],
    ]);

    expect(document.dispatchEvent).toHaveBeenCalledTimes(1);
    expect(document.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(document.dispatchEvent.mock.calls[0][0].type).toBe('gameerror');
    expect(document.dispatchEvent.mock.calls[0][0].detail.type)
      .toBe(window.ErrorType.API_ERROR);
    expect(document.dispatchEvent.mock.calls[0][0].detail.source)
      .toBe(window.ErrorSource.TAKE_TURN);
  });

  test('dispatches a gameerror when fetch throws a network error', async () => {
    const state = 'this is some state';
    const expectedCol = 0;

    fetch.mockReject(new Error());

    await takeTurn(state, expectedCol);

    expect(fetch.mock.calls).toEqual([
      ['/api/game/move', {
        body: JSON.stringify({ col: expectedCol }),
        method: 'POST',
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
      .toBe(window.ErrorSource.TAKE_TURN);
  });
});
