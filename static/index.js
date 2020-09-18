document.querySelector('#new-game').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/game/', {
      method: 'POST',
    });

    if (!res.ok) {
      document.dispatchEvent(new CustomEvent('gameerror', {
        detail: {
          type: ErrorType.API_ERROR,
          source: ErrorSource.NEW_GAME,
        },
      }));
      return;
    }

    window.location.href = './game.html';
  } catch (error) {
    document.dispatchEvent(new CustomEvent('gameerror', {
      detail: {
        type: ErrorType.NETWORK_ERROR,
        source: ErrorSource.NEW_GAME,
      },
    }));
  }
});

document.querySelector('#continue-game').addEventListener('click', () => {
  window.location.href = './game.html';
});

document.addEventListener('gameerror', onGameErrorShowNotification);
