class Unauthorized extends Error {
  constructor(message) {
    super({ error: message });
    this.statusCode = 401;
    this.message = (`401 Unauthorized — ${message}`);
  }
}

module.exports = Unauthorized;
