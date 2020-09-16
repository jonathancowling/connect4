require('dotenv').config();
const { app } = require('./server.js');

app.listen(parseInt(process.env.PORT, 10), () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${process.env.PORT}`);
});
