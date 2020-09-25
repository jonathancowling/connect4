/**
 * @jest-environment node
 */

process.env.NUM_ROWS = 2;
process.env.NUM_COLS = 2;
process.env.SESSION_SECRET = 'test';

// stop morgan logging to the console
jest.mock('morgan', () => (() => ((_req, _res, next) => { next(); })));
jest.mock('moniker', () => ({ choose: () => 'moniker-name' }));

const request = require('supertest');
const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');

const mockgoose = new Mockgoose(mongoose);

const { app } = require('../server');
const { game } = require('../mongoose-schemas');

describe('server', () => {
  beforeEach(async () => {
    await mockgoose.prepareStorage();
    await mongoose.connect('mongodb://fake-url', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    mongoose.model('Game', game);
  });

  afterEach(async () => {
    await mockgoose.helper.reset();
  });

  afterAll(async () => {
    await mockgoose.shutdown();
  });

  it('creates a game on POST /api/game/', async () => {
    await request(app)
      .post('/api/game/')
      .expect(200)
      .expect((res) => expect(res.body).toEqual({
        code: 'moniker-name',
        state: {
          board: [
            [null, null],
            [null, null],
          ],
          winner: null,
          gameOver: false,
          player: 0,
          moves: [],
        },
        player: 0,
      }))
      .expect((res) => {
        expect(res.headers['set-cookie']).toEqual([expect.any(String)]);
      });
  });

  it('returns game on GET /api/game when game has been created', async () => {
    const agent = request(app);
    let cookie;

    await agent
      .post('/api/game')
      .expect(200)
      .expect((res) => {
        [cookie] = res.headers['set-cookie'];
      });

    await agent
      .get('/api/game')
      .set('cookie', cookie)
      .expect(200)
      .expect((res) => expect(res.body).toEqual({
        code: 'moniker-name',
        state: {
          board: [
            [null, null],
            [null, null],
          ],
          winner: null,
          gameOver: false,
          player: 0,
          moves: [],
        },
        player: 0,
      }));
  });

  it('adds an additional player when POST /api/game/join/:code is called', async () => {
    const agent = request(app);
    let code;

    await agent
      .post('/api/game')
      .expect(200)
      .expect((res) => {
        code = res.body.code;
      });

    await request(app)
      .post(`/api/game/join/${code}`)
      .expect(200)
      .expect((res) => expect(res.body).toEqual({
        code: 'moniker-name',
        state: {
          board: [
            [null, null],
            [null, null],
          ],
          winner: null,
          gameOver: false,
          player: 0,
          moves: [],
        },
        player: 1,
        // TODO: playerCount: 2,
      }));
  });

  it('returns 400 on GET /api/game when game doesn\'t exist', async () => {
    await request(app)
      .get('/api/game')
      .expect(400);
  });

  it('doesn\'t return game on GET /api/game when game has been deleted', async () => {
    const agent = request(app);
    let cookie;

    await agent
      .post('/api/game')
      .expect(200)
      .expect((res) => {
        [cookie] = res.headers['set-cookie'];
      });

    await agent
      .get('/api/game')
      .set('cookie', cookie)
      .expect(200)
      .expect((res) => expect(res.body).toEqual({
        code: 'moniker-name',
        state: {
          board: [
            [null, null],
            [null, null],
          ],
          winner: null,
          gameOver: false,
          player: 0,
          moves: [],
        },
        player: 0,
      }));

    await agent
      .delete('/api/game')
      .expect(204);

    await request(app)
      .get('/api/game')
      .expect(400);
  });

  it('changes the game state on POST /api/game/move', async () => {
    const expectedGame = {
      code: 'moniker-name',
      state: {
        board: [
          [null, null],
          [0, null],
        ],
        player: 1,
        moves: [[0, 1, 0]],
        winner: null,
        gameOver: false,
      },
      player: 0,
    };

    const agent = request(app);
    let cookie;

    await agent
      .post('/api/game')
      .expect(200)
      .expect((res) => {
        [cookie] = res.headers['set-cookie'];
      });

    await agent
      .post('/api/game/move')
      .set('cookie', cookie)
      .send({ col: 0 })
      .expect(200)
      .expect((res) => expect(res.body).toEqual(expectedGame));

    await agent
      .get('/api/game')
      .set('cookie', cookie)
      .expect(200)
      .expect((res) => expect(res.body).toEqual(expectedGame));
  });

  it('returns 400 on POST /api/game/move for an invalid column', async () => {
    const agent = request(app);
    let cookie;

    await agent
      .post('/api/game')
      .expect(200)
      .expect((res) => {
        [cookie] = res.headers['set-cookie'];
      });

    await agent
      .post('/api/game/move')
      .set('cookie', cookie)
      .send({ col: 3 })
      .expect(400);
  });

  it('returns 400 on POST /api/game/move for a missing column', async () => {
    const agent = request(app);
    let cookie;

    await agent
      .post('/api/game')
      .expect(200)
      .expect((res) => {
        [cookie] = res.headers['set-cookie'];
      });

    await agent
      .post('/api/game/move')
      .set('cookie', cookie)
      .expect(400);
  });
});
