const {
  onColumnSelectedSetHighlightFactory,
  onColumnSelectedTakeTurnFactory,
} = require('../../static/ui');

describe('on column selected', () => {
  beforeEach(() => {
    jest.spyOn(document, 'dispatchEvent')
      .mockImplementation()
      .mockReset();
    fetch.resetMocks();
    fetchMock.doMock();
  });

  test('columns colors are set correctly', () => {
    const target = {
      style: {
        backgroundColor: undefined,
      },
    };

    const index = 0;
    const highlighted = 'red';
    const unhighlighted = 'blue';

    const onColumnSelectedSetHighlight = onColumnSelectedSetHighlightFactory(
      index,
      target,
      { highlighted, unhighlighted },
    );

    const highlightEvent = new CustomEvent('columnselected', { detail: { index, state: null } });
    onColumnSelectedSetHighlight(highlightEvent);

    expect(target.style.backgroundColor).toBe(highlighted);

    const unHighlightEvent = new CustomEvent('columnselected', { detail: { index: index + 1, state: null } });
    onColumnSelectedSetHighlight(unHighlightEvent);

    expect(target.style.backgroundColor).toBe(unhighlighted);
  });

  test('the drop button replaces its click listener', () => {
    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const expectedNewState = {};
    const mockTakeTurn = jest.fn().mockResolvedValue(expectedNewState);

    const state = {};
    const index = 0;
    const event1 = new CustomEvent('columnselected', { detail: { index, state } });
    const event2 = new CustomEvent('columnselected', { detail: { index, state } });

    const onColumnSelectedTakeTurn = onColumnSelectedTakeTurnFactory(target, mockTakeTurn);

    onColumnSelectedTakeTurn(event1);
    onColumnSelectedTakeTurn(event2);

    expect(target.addEventListener.mock.calls).toEqual([
      ['click', expect.any(Function)],
      ['click', expect.any(Function)],
    ]);

    const firstClickListener = target.addEventListener.mock.calls[0][1];

    expect(target.removeEventListener.mock.calls).toEqual([
      ['click', undefined],
      ['click', firstClickListener],
    ]);
  });

  test('the drop buttons takeTurn is called on click and newstate event emitted on resolve', async () => {
    const spy = jest.spyOn(document, 'dispatchEvent').mockImplementation();

    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const expectedNewState = {};
    const mockTakeTurn = jest.fn().mockResolvedValue(expectedNewState);

    const state = {};
    const index = 0;
    const event1 = new CustomEvent('columnselected', { detail: { index, state } });

    const onColumnSelectedTakeTurn = onColumnSelectedTakeTurnFactory(target, mockTakeTurn);

    onColumnSelectedTakeTurn(event1);

    const firstClickListener = target.addEventListener.mock.calls[0][1];

    await firstClickListener();

    expect(mockTakeTurn).toHaveBeenCalledTimes(1);
    expect(mockTakeTurn).toHaveBeenCalledWith(state, index);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(expect.any(CustomEvent));
    expect(spy.mock.calls[0][0].type).toBe('newstate');
    expect(spy.mock.calls[0][0].detail)
      .toStrictEqual({ state: expectedNewState });
  });

  test('the drop buttons takeTurn is called on click and gameerror event emitted on reject', async () => {
    const spy = jest.spyOn(document, 'dispatchEvent').mockImplementation();
    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const expectedDetail = {};
    const mockTakeTurn = jest.fn().mockRejectedValue(expectedDetail);

    const state = {};
    const index = 0;
    const event1 = new CustomEvent('columnselected', { detail: { index, state } });

    const onColumnSelectedTakeTurn = onColumnSelectedTakeTurnFactory(target, mockTakeTurn);

    onColumnSelectedTakeTurn(event1);

    const firstClickListener = target.addEventListener.mock.calls[0][1];

    await firstClickListener();

    expect(mockTakeTurn).toHaveBeenCalledTimes(1);
    expect(mockTakeTurn).toHaveBeenCalledWith(state, index);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(expect.any(CustomEvent));
    expect(spy.mock.calls[0][0].type).toBe('gameerror');
    expect(spy.mock.calls[0][0].detail).toStrictEqual(expectedDetail);
  });

  test('when no column is selected the drop button removes takeTurn on click', async () => {
    jest.spyOn(document, 'dispatchEvent').mockImplementation();
    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const expectedNewState = {};
    const mockTakeTurn = jest.fn().mockReturnValue(expectedNewState);

    const state = {};
    const index = null;
    const event1 = new CustomEvent('columnselected', { detail: { index, state } });

    const onColumnSelectedTakeTurn = onColumnSelectedTakeTurnFactory(target, mockTakeTurn);

    onColumnSelectedTakeTurn(event1);

    expect(target.addEventListener.mock.calls).toEqual([
      ['click', expect.any(Function)],
    ]);

    const firstClickListener = target.addEventListener.mock.calls[0][1];

    expect(target.removeEventListener.mock.calls).toEqual([
      ['click', undefined],
    ]);

    await firstClickListener();

    expect(mockTakeTurn).not.toBeCalled();
  });
});
