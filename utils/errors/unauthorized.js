class Unauthorized extends Error {
  constructor(message) {
    super({error:message});
    this.statusCode = 401;

  }
}

module.exports = Unauthorized;