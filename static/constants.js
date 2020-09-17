/* eslint-disable max-classes-per-file */

class ApiError extends Error {
  constructor(source) {
    super();
    this.source = source;
  }
}

class NetworkError extends Error {
  constructor(source) {
    super();
    this.source = source;
  }
}

const ErrorSource = {
  NEW_GAME: Symbol('NEW_GAME'),
};

/* istanbul ignore next */
if (module) {
  module.exports = {
    ApiError,
    NetworkError,
    ErrorSource,
  };
}
