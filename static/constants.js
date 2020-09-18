/* eslint-disable max-classes-per-file */

const ErrorType = {
  API_ERROR: Symbol('API_ERROR'),
  NETWORK_ERROR: Symbol('NETWORK_ERROR'),
};

const ErrorSource = {
  NEW_GAME: Symbol('NEW_GAME'),
  INIT_GAME: Symbol('INIT_GAME'),
  TAKE_TURN: Symbol('TAKE_TURN'),
};

/* istanbul ignore next */
if (module) {
  module.exports = {
    ErrorType,
    ErrorSource,
  };
}
