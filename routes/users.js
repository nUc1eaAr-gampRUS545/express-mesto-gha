const routes = require('express').Router();
const {
  validateUserId, validateUserUpdate, validateUserAvatar
}=require('../middlewares/validateJoi');
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, updateUser, updateAvatar,login,createUser
} = require('../controllers/users');

routes.get('/', getUsers);
routes.get('/:userId',validateUserId, getUser);
routes.patch('/me', validateUserUpdate,updateUser);
routes.patch('/me/avatar',validateUserAvatar, updateAvatar);

module.exports = routes;
