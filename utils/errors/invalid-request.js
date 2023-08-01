class ErrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.message = (`400 Invalid Request — ${message}`);
    this.statusCode = 400;
  }
}

module.exports = ErrorBadRequest;
