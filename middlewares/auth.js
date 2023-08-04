const JWT = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/unauthorized');

function authentiacateUser(req, _res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    // res.status(401).send({ message: 'Пользователь не авторезирован' });
    next(new Unauthorized('Пользователь не авторезирован'));
  }
  let payload;
  try {
    payload = JWT.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
}
module.exports = { authentiacateUser };
