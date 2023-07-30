const routes = require('express').Router();
const { authentiacateUser }= require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, updateUser, updateAvatar,login,createUser
} = require('../controllers/users');

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
routes.post('/signin', authentiacateUser, login);
routes.get('/users', getUsers);
routes.get('/users/:userId', getUser);
routes.patch('/users/me', updateUser);
routes.patch('/users/me/avatar', updateAvatar);

module.exports = routes;
