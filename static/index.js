document.querySelector('#new-game').addEventListener('click', async () => {
  await fetch('/api/game/', {
    method: 'POST',
  });
  // if (!res.ok) {
  //   throw new Error(res);
  // }
  window.location.href = './game.html';
});

document.querySelector('#continue-game').addEventListener('click', () => {
  window.location.href = './game.html';
});
