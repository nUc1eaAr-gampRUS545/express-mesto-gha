/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../utils/errors/not-found-error');
// const Unauthorized = require('../utils/errors/unauthorized');
const userSchema = require('../models/users');
const ErrorBadRequest = require('../utils/errors/invalid-request');
const IntervalServerError = require('../utils/errors/IntervalServerError');
const Unauthorized = require('../utils/errors/unauthorized');
const ConflictError = require('../utils/errors/ConflictError');

function getUsers(_req, res, next) {
  return userSchema.find({})
    .then((users) => res.send(users))
    .catch(() => {
      next(new IntervalServerError('Server Error'));
    });
}

function getUser(req, res, next) {
  const { userId } = req.params;
  userSchema.findById(userId)
    .then((data) => {
      if (!data) {
        return next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return res.status(200).send({ message: data });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new NotFoundError('Некорректный формат id.'));
      } else if (err.error === 'Bad Request') {
        next(new NotFoundError('Некорректный формат id.'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Ошибка данных'));
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
    .then((hash) => userSchema.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }).then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    })))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
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
        return next(new Unauthorized('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return next(new Unauthorized('Неправильные почта или пароль'));
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
  userSchema.findById(req.user.payload)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(200).send(
        {
          email: user.email, name: user.name, about: user.about, avatar: user.avatar,
        },
      );
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
    req.user.payload,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      } else {
        res.status(200).send({ data });
      }
    })
    .catch((data) => {
      if (data.name === 'ValidationError') {
        next(new ErrorBadRequest('ValidationError'));
      } else {
        next(data);
      }
    });
}
function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(
    req.user.payload,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      } else {
        res.status(200).send({ data });
      }
    })
    .catch((data) => {
      if (data.name === 'ValidationError') {
        next(new ErrorBadRequest('ValidationError'));
      } else {
        next(data);
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
