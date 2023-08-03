const routes = require('express').Router();
const {
  validateUserId, validateUserUpdate, validateUserAvatar,
} = require('../middlewares/validateJoi');
const {
  getUser, getUsers, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

routes.get('/', getUsers);
routes.get('/me', getUserInfo);
routes.get('/:userId', validateUserId, getUser);
routes.patch('/me', validateUserUpdate, updateUser);
routes.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = routes;
