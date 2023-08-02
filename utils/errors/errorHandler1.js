/* eslint-disable no-unused-vars */
/* module.exports = function (err, _req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произощла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
};

class errorHandler extends Error {
  constructor(message) {
    super(message);
    this.message = (`400 Invalid Request — ${message}`);
    this.statusCode = 400;
  }
}

module.exports = ErrorBadRequest;
class ErrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.message = (`400 Invalid Request — ${message}`);
    this.statusCode = 500;
  }
}

module.exports = ErrorBadRequest; */
