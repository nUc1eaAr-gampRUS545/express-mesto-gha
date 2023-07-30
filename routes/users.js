const routes = require('express').Router();
const { authentiacateUser }= require('../middlewares/auth')
const {
  getUser, getUsers, createUser, updateUser, updateAvatar,login
} = require('../controllers/users');


routes.get('/users', getUsers);
routes.get('/users/:userId', getUser);
routes.patch('/users/me', updateUser);
routes.patch('/users/me/avatar', updateAvatar);

module.exports = routes;
