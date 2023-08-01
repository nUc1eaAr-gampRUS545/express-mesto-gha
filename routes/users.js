const routes = require('express').Router();
const {
  validateUserId, validateUserUpdate, validateUserAvatar,
} = require('../middlewares/validateJoi');
const {
  getUser, getUsers, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

routes.get('/', getUsers);
routes.get('/:userId', validateUserId, getUser);
routes.get('/me', validateUserUpdate, getUserInfo);
routes.patch('/me', validateUserUpdate, updateUser);
routes.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = routes;
