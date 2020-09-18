const {
  onGameOverShowWinnerFactory,
} = require('../../static/ui');

describe('on game over', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
  });

  test('notification shown for a fixed amount of time', () => {
    const mockGetColor = jest.fn(() => 'red');
    const winner = 0;

    const notificationPanel = document.createElement('section');
    notificationPanel.id = 'notification-panel';
    document.body.appendChild(notificationPanel);

    onGameOverShowWinnerFactory(mockGetColor)(new CustomEvent('gameover', {
      detail: { winner },
    }));
    expect(mockGetColor.mock.calls).toEqual([
      [winner],
    ]);

    expect(notificationPanel.firstElementChild.innerHTML).toBe('red wins!');

    jest.advanceTimersByTime(3000);

    expect(notificationPanel.hasChildNodes()).toBe(false);
  });
});
