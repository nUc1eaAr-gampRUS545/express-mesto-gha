/* eslint-disable no-unused-vars */
function errorHandler(err, _req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произощла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
}
module.exports = errorHandler;
