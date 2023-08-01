const routes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, updateUser, updateAvatar,login,createUser
} = require('../controllers/users');

routes.get('/', getUsers);
routes.get('/:userId', getUser);
routes.patch('/me', updateUser);
routes.patch('/me/avatar', updateAvatar);

module.exports = routes;
