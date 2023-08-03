const routes = require('express').Router();
const {
  validateCardPost, validateCardId,
} = require('../middlewares/validateJoi');

const {
  getCard, getCards, deleteCard, likeCard, dislikeCard, createCard,
} = require('../controllers/cards');

routes.post('/', validateCardPost, createCard);
routes.get('/', getCards);
routes.get('/:cardId', validateCardId, getCard);
routes.delete('/:cardId', validateCardId, deleteCard);
routes.put('/:cardId/likes', validateCardId, likeCard);
routes.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = routes;
