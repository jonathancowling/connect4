/**
 * @jest-environment node
 */

const mockListen = jest.fn();
const mockConfig = jest.fn();

jest.mock('../server.js', () => ({
  app: { listen: mockListen },
}));
jest.mock('dotenv', () => ({
  config: mockConfig,
}));

const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');

const mockgoose = new Mockgoose(mongoose);

const port = 30000;
process.env.PORT = port.toString();
process.env.NUM_ROWS = '1';
process.env.NUM_COLS = '1';

beforeAll(async () => {
  await mockgoose.prepareStorage();
  process.env.MONGO_URL = mockgoose.getMockConnectionString(
    (await mockgoose.getOpenPort()).toString(),
  );
});

afterAll(async () => {
  // await mockgoose.shutdown();
});

beforeEach(() => {
  jest.resetModules();
});

test.skip('calls app.listen', async () => {
  // mockConnect.mockResolvedValue(null);
  // mockListen.mockImplementation((...args) => args[args.length - 1]());
  // mockSchema.mockReturnValue({});

  // don't log listening message
  const mockConsole = jest.spyOn(global.console, global.console.log.name);
  mockConsole.mockImplementation(() => {});

  // eslint-disable-next-line global-require
  await require('../main.js');

  expect(mockConfig).toBeCalledTimes(1);
  expect(mockListen).toBeCalledTimes(1);
  expect(mockListen).toBeCalledWith(port, expect.any(Function));
  expect(mockListen.mock.calls[0][1]).not.toThrow();

  expect(mongoose.model('Game')).toBeDefined();
}, 30000);
