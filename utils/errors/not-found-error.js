class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = (`404 Not Found — ${message}`);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
