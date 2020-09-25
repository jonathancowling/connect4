const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {
  takeTurnFactory,
  checkWin,
} = require('./logic');

const takeTurn = takeTurnFactory(checkWin);

const app = express();
app.use(morgan('tiny'));

const gameApi = new express.Router();

gameApi.use(express.json());
gameApi.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

const initialState = {
  board: Array(parseInt(process.env.NUM_ROWS, 10)).fill(undefined)
    .map(() => new Array(parseInt(process.env.NUM_COLS, 10)).fill(null)),
  winner: null,
  gameOver: false,
  player: 0,
  moves: [],
};

const aaa = {};

gameApi.post('/', async (req, res) => {
  const Game = mongoose.model('Game');
  const game = new Game({ state: initialState });
  await game.save();

  req.session.game = {
    code: game.code,
    player: 0,
  };
  res.json({
    ...req.session.game,
    state: game.state,
  });
});

gameApi.post('/join/:code', async (req, res) => {
  const Game = mongoose.model('Game');
  const game = await Game.findOne({ code: req.params.code }).exec();

  req.session.game = {
    code: game.code,
    player: 1,
  };

  res.json({
    ...req.session.game,
    state: game.state,
  });
});

gameApi.get('/subscribe', async (req, res) => {
  if (!req.session.game) {
    res.sendStatus(400);
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  res.writeHead(200, headers);
  res.write('retry: 10000\n\n');

  if (aaa[req.session.game.code]) {
    aaa[req.session.game.code].push(res);
  } else {
    aaa[req.session.game.code] = [res];
  }
});

gameApi.delete('/', (req, res) => {
  req.session.game = null;
  res.sendStatus(204);
});

gameApi.get('/', async (req, res) => {
  if (!req.session.game) {
    res.sendStatus(400);
    return;
  }

  const Game = mongoose.model('Game');
  const game = await Game.findOne({ code: req.session.game.code }).exec();

  res.json({
    ...req.session.game,
    state: game.state,
  });
});

gameApi.post('/move', async (req, res) => {
  const Game = mongoose.model('Game');
  const game = await Game.findOne({ code: req.session.game.code }).exec();

  if (!req.session.game || req.session.game.player !== game.state.player) {
    res.sendStatus(400);
    return;
  }

  const newState = takeTurn(game.state, parseInt(req.body.col, 10));
  if (newState.error) {
    res.sendStatus(400);
    return;
  }

  game.state = newState;
  await game.save();

  if (aaa[req.session.game.code]) {
    aaa[req.session.game.code].forEach((subscription) => {
      subscription.write(`data: ${JSON.stringify({ state: game.state })}\n\n`);
    });
  }

  res.json({
    ...req.session.game,
    state: game.state,
  });
});

app.use(express.static(path.join(process.cwd(), 'static')));

app.use('/api/game', gameApi);

module.exports = {
  app,
};
