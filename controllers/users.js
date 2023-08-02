/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../utils/errors/not-found-error');
// const Unauthorized = require('../utils/errors/unauthorized');
const userSchema = require('../models/users');
const ErrorBadRequest = require('../utils/errors/invalid-request');
const IntervalServerError = require('../utils/errors/server-error');
const Unauthorized = require('../utils/errors/unauthorized');

function getUsers(_req, res, next) {
  return userSchema.find({})
    .then((data) => res.status(200).send(data))
    .catch(() => {
      next(new IntervalServerError('Server Error'));
    });
}

function getUser(req, res, next) {
  const { userId } = req.params;
  return userSchema.findById(userId)
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      } else {
        res.status(200).send({ message: data });
      }
    })

    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ErrorBadRequest('Некорректный формат id.'));
      } else {
        next(new IntervalServerError('Server Error'));
      }
    });
}
function createUser(req, res, next) {
  /* if (!req.body) {
    return Promise.reject(new ErrorBadRequest('Неверное тело запроса'));
  } */
  const {
    email, password, name, about, avatar,
  } = req.body;
  /* if (!email || !password) {
    return Promise.reject(new ErrorBadRequest('Неверное тело запроса'));
  } */
  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10)
          .then((hash) => {
            userSchema.create({
              email,
              password: hash,
              name,
              about,
              avatar,
            });
          })
          .then((user) => {
            res.status(201).send({
              message: user,
            });
          })
          .catch((err) => {
            if (err.name === 'MongoServerError' || err.code === 11000) {
              next(new ErrorBadRequest('Пользователь с такой почтой уже зарегистрирован.'));
            } else if (err.name === 'ValidationError') {
              next(new ErrorBadRequest('ValidationError'));
            }
          });
      }
      next(new ErrorBadRequest('ValidationError'));
    })
    .catch(() => {
      res.status(409).send({ message: 'Пользователь с такой почтой уже зарегистрирован.' });
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        next(new ErrorBadRequest('Неправильные почта или пароль'));
      }

      const result = bcrypt.compare(password, user.password);
      if (!result) {
        next(new ErrorBadRequest('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ payload: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        }).json({ message: 'Успешная авторизация.' });
    })
    .catch((err) => {
      next(new Unauthorized(err));
    });
}
function getUserInfo(req, res, next) {
  userSchema.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Ошибка данных'));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  userSchema.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      } else {
        res.status(200).send({ message: { name, about } });
      }
    })
    .catch((data) => {
      if (data.name === 'ValidationError') {
        next(new ErrorBadRequest('ValidationError'));
      } else {
        next(new IntervalServerError('Server Error'));
      }
    });
}
function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      } else {
        res.status(200).send({ message: { avatar } });
      }
    })
    .catch((data) => {
      if (data.name === 'ValidationError') {
        next(new ErrorBadRequest('ValidationError'));
      } else {
        next(new IntervalServerError('Server Error'));
      }
    });
}
module.exports = {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  login,
  createUser,
  getUserInfo,
};
