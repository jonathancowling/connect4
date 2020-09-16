const mockListen = jest.fn();
const mockConfig = jest.fn();

jest.mock('../server.js', () => ({
  app: { listen: mockListen },
}));
jest.mock('dotenv', () => ({
  config: mockConfig,
}));

const port = 30000;
process.env.PORT = port.toString();

beforeEach(() => {
  jest.resetModules();
});

test('calls app.listen', () => {
  // eslint-disable-next-line global-require
  require('../main.js');

  expect(mockConfig).toHaveBeenCalledTimes(1);
  expect(mockListen).toBeCalledTimes(1);
  expect(mockListen).toBeCalledWith(port, expect.any(Function));
  expect(mockListen.mock.calls[0][1]).not.toThrow();
});
