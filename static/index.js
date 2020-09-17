document.querySelector('#new-game').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/game/', {
      method: 'POST',
    });

    if (!res.ok) {
      throw new ApiError();
    }

    window.location.href = './game.html';
  } catch (error) {
    if (!(error instanceof ApiError)) {
      document.dispatchEvent(new CustomEvent('gameerror', {
        detail: {
          error: new NetworkError(),
          source: ErrorSource.NEW_GAME,
        },
      }));
      return;
    }

    document.dispatchEvent(new CustomEvent('gameerror', {
      detail: {
        error,
        source: ErrorSource.NEW_GAME,
      },
    }));
  }
});

document.querySelector('#continue-game').addEventListener('click', () => {
  window.location.href = './game.html';
});

// TODO: listen for gameerror
