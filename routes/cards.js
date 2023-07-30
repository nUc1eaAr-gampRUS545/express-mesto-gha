const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routes.get('/cards', getCards);
routes.get('/cards/:cardId', getCard);
routes.post('/cards',celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), createCard);
routes.delete('/cards/:cardId', deleteCard);
routes.put('/cards/:cardId/likes', likeCard);
routes.delete('/cards/:cardId/likes', dislikeCard);

module.exports = routes;
