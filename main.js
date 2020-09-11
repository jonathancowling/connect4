const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const {
  takeTurnFactory,
  checkWin,
} = require('./logic');

const takeTurn = takeTurnFactory(checkWin);

const app = express();

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
  player: 0,
  moves: [],
};

gameApi.post('/', (req, res) => {
  req.session.game = {
    state: initialState,
    player: 0,
  };
  res.json(req.session.game);
});

gameApi.delete('/', (req, res) => {
  req.session.game = null;
  res.status(204).end();
});

gameApi.get('/', (req, res) => {
  res.json(req.session.game);
});

gameApi.post('/move', (req, res) => {
  const newState = takeTurn(req.session.game.state, parseInt(req.body.col, 10));
  if (newState.error) {
    res.sendStatus(400);
    return;
  }
  req.session.game.state = newState;
  res.json(req.session.game);
});

app.use(express.static(path.join(process.cwd(), 'static')));

app.use('/api/game', gameApi);

app.listen(parseInt(process.env.PORT, 10), () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
