/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../utils/errors/not-found-error');
// const Unauthorized = require('../utils/errors/unauthorized');
const userSchema = require('../models/users');
const ErrorBadRequest = require('../utils/errors/invalid-request');
const IntervalServerError = require('../utils/errors/errorHandler');
const Unauthorized = require('../utils/errors/unauthorized');
const ConflictError = require('../utils/errors/ConflictError');

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
  const {
    email, password, name, about, avatar,
  } = req.body;
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

    .then(() => res.send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'Validation Error') {
        next(new ErrorBadRequest(err));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new ErrorBadRequest('Неправильные почта или пароль'));
        return;
      }

      return bcrypt.compare(password, user.password)
        .then((result) => {
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
          next(err);
        });
    })
    .catch((err) => {
      next(err);
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
