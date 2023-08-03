const Card = require('../models/cards');

const NotFoundError = require('../utils/errors/not-found-error');
const ErrorBadRequest = require('../utils/errors/invalid-request');
const IntervalServerError = require('../utils/errors/errorHandler');

function getCards(_req, res, next) {
  return Card.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      next(new IntervalServerError('Server Error'));
    });
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
    .catch(() => {
      next(new IntervalServerError('Server Error'));
    });
}

function createCard(req, res, next) {
  const owner = req.user.payload;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(201).send({ message: data._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Неверное тело запроса'));
      } else {
        next(new IntervalServerError('Server Error'));
      }
    });
}

function deleteCard(req, res, next) {
  return Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка по данному id не найдена'))
    .then((card) => {
      if (card.owner._id.toString() === req.user.payload) {
        return card.remove()
          .then(() => res.send({ message: 'Карточка удалена' }));
      }
      return res.status(409).send({ message: 'Недостаточно прав для удаления карточки' });
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError('Карточка по данному id не найдена'))
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Такой карточки не сущесвует'));
      }
      res.status(200).send({ message: data });
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
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Такой карточки не сущесвует'));
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
