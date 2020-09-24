/* eslint-disable max-classes-per-file */

const ErrorType = {
  API_ERROR: Symbol('API_ERROR'),
  NETWORK_ERROR: Symbol('NETWORK_ERROR'),
};

function ApiError(detail) {
  this.detail = detail;
}

function NetworkError(detail) {
  this.detail = detail;
}

const ErrorSource = {
  NEW_GAME: Symbol('NEW_GAME'),
  INIT_GAME: Symbol('INIT_GAME'),
  TAKE_TURN: Symbol('TAKE_TURN'),
  RESET_GAME: Symbol('RESET_GAME'),
};

/* istanbul ignore next */
if (module) {
  module.exports = {
    ApiError,
    NetworkError,
    ErrorType,
    ErrorSource,
  };
}
