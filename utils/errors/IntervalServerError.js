class IntervalServerError extends Error {
  constructor(message) {
    super(message);
    this.message = (`500 Server Error— ${message}`);
    this.statusCode = 500;
  }
}

module.exports = IntervalServerError;
