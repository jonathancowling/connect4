const mongoose = require('mongoose');
const Moniker = require('moniker');

module.exports.game = new mongoose.Schema({
  code: { type: String, index: true, default: Moniker.choose },
  state: {
    board: {
      type: [[Number, Number]],
      default: [],
    },
    winner: {
      type: Number,
      default: null,
    },
    gameOver: {
      type: Boolean,
    },
    moves: {
      type: [[Number, Number, Number]],
      default: [],
    },
    player: {
      type: Number,
    },
  },
  playerCount: { type: Number, default: 0 },
  date: { type: Date, default: () => Date.now() + 3600000 },
});
