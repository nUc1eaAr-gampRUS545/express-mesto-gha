const routes=require('express').Router();
const {getCard,getCards,createCard,deleteCard, likeCard,dislikeCard}=require('../controllers/cards')
routes.get('/cards',getCards);
routes.get('/cards/:cardId',getCard);
routes.post('/cards',createCard);
routes.delete('/cards/:cardId',deleteCard);
routes.put('/cards/:cardId/likes',likeCard);
routes.delete('/cards/:cardId/likes',dislikeCard);

module.exports=routes;