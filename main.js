require('dotenv').config();
const mongoose = require('mongoose');
// const { promisify } = require('util');
const { game } = require('./mongoose-schemas');
const { app } = require('./server.js');

module.exports = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  mongoose.model('Game', game);
})
  .then(
    () => new Promise((resolve) => app.listen(parseInt(process.env.PORT, 10), resolve)),
  )
  .then(() => {
  // eslint-disable-next-line no-console
    console.log(`server listening on port ${process.env.PORT}`);
  })
  .catch(/* istanbul ignore next */ (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
  });
