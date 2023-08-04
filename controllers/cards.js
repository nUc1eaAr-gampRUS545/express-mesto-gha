const Card = require('../models/cards');

const NotFoundError = require('../utils/errors/not-found-error');
const ErrorBadRequest = require('../utils/errors/invalid-request');
const IntervalServerError = require('../utils/errors/IntervalServerError');
const Forbidden = require('../utils/errors/Forbidden');

function getCards(_req, res, next) {
  return Card.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
}

function getCard(req, res, next) {
  return Card.findById(req.params.cardId)
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Такого пользователя не сущесвует'));
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function createCard(req, res, next) {
  const owner = req.user.payload;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Неверное тело запроса'));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  return Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка по данному id не найдена'))
    .then((card) => {
      if (card.owner._id.toString() === req.user.payload) {
        return card.deleteOne()
          .then(() => res.send({ message: 'Карточка удалена' }));
      }
      return next(new Forbidden('Недостаточно прав для удаления карточки'));
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.payload } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError('Такой карточки не сущесвует'));
      }
      return res.status(200).send({ message: data });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ErrorBadRequest('Неверное тело запроса'));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Неверное тело запроса'));
      } else {
        next(new IntervalServerError('Server Error'));
      }
    });
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.payload } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ErrorBadRequest('Неверное тело запроса'));
      } else {
        next(new IntervalServerError('Server Error'));
      }
    });
}
module.exports = {
  getCard,
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
