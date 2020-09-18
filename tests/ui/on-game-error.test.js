const { onGameErrorShowNotification } = require('../../static/ui.js');

describe('on game error', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
  });

  test('notification shown for a fixed amount of time', () => {
    const notificationPanel = document.createElement('section');
    notificationPanel.id = 'notification-panel';
    document.body.appendChild(notificationPanel);

    onGameErrorShowNotification(new CustomEvent('gameerror'));

    expect(notificationPanel.childElementCount).toBe(1);
    expect(notificationPanel.firstElementChild.innerHTML)
      .toBe('Oops! Something went wrong, please try again later');

    jest.advanceTimersByTime(3000);

    expect(notificationPanel.hasChildNodes()).toBe(false);
  });
});
