const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routes.get('/', getCards);
routes.get('/:cardId', getCard);
routes.post('/',celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2),
  }),
}), createCard);
routes.delete('/:cardId', deleteCard);
routes.put('/:cardId/likes', likeCard);
routes.delete('/:cardId/likes', dislikeCard);

module.exports = routes;
