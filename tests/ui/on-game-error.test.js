const { onGameErrorShowNotification } = require('../../static/ui.js');

describe('on game error', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('notification shown for a fixed amount of time', () => {
    const notificationPanel = document.createElement('section');
    notificationPanel.id = 'notification-panel';
    document.body.appendChild(notificationPanel);

    onGameErrorShowNotification(new CustomEvent('gameerror'));

    expect(notificationPanel.childNodes.length).toBe(1);
    const notification = notificationPanel.firstElementChild;
    expect(notification.childNodes.length).toBe(3);
    expect(
      notification.childNodes[0].isEqualNode(
        document.createTextNode('Oops! Something went wrong, click '),
      ),
    ).toBe(true);
    expect(notification.childNodes[1].textContent).toBe('here');
    expect(notification.childNodes[1].getAttribute('href')).toBe('..');
    expect(
      notification.childNodes[2].isEqualNode(
        document.createTextNode(' to return to main menu.'),
      ),
    ).toBe(true);
  });
});
