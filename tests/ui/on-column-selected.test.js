const {
  onColumnSelectedSetHighlightFactory,
  onColumnSelectedTakeTurnFactory,
} = require('../../static/ui');

describe('on column selected', () => {
  beforeEach(() => {
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

  test('when a column is selected the drop button takes a turn and replaces click listeners', () => {
    const target = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const expectedNewState = {};
    const mockTakeTurn = jest.fn().mockReturnValue(expectedNewState);

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

    const secondClickListener = target.addEventListener.mock.calls[1][1];
    secondClickListener();

    expect(mockTakeTurn).toHaveBeenCalledTimes(1);
    expect(mockTakeTurn).toHaveBeenCalledWith(state, index);
  });

  test('when no column is selected the drop button removes takeTurn on click', () => {
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

    firstClickListener();

    expect(mockTakeTurn).not.toBeCalled();
  });
});
