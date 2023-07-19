const routes=require('express').Router();
const {getUser,getUsers,createUser,updateUser,updateAvatar,notFound}=require('../controllers/users')
routes.get('/users',getUsers);
routes.get('/users/:userId',getUser);
routes.post('/users',createUser)
routes.patch('/users/me',updateUser);
routes.patch('/users/me/avatar',updateAvatar);
routes.patch('/404',notFound);
module.exports=routes;