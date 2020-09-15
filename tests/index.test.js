describe('index', () => {
  let newGame;
  let continueGame;
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {},
    });

    newGame = document.createElement('button');
    newGame.id = 'new-game';
    document.body.appendChild(newGame);

    continueGame = document.createElement('button');
    continueGame.id = 'continue-game';
    document.body.appendChild(continueGame);

    // eslint-disable-next-line global-require
    require('../static/index');
  });

  beforeEach(() => {
    fetch.doMock();
  });

  test('continue game should navigate to game', () => {
    window.location.href = '/index.html';
    continueGame.click();
    expect(window.location.href).toBe('./game.html');
  });

  test('new game should fetch a new game navigate to game', async () => {
    window.location.href = '/index.html';
    newGame.click();

    await new Promise((resolve) => resolve());

    expect(fetch.mock.calls).toEqual([
      ['/api/game/', {
        method: 'POST',
      }],
    ]);
    expect(window.location.href).toBe('./game.html');
  });
});
