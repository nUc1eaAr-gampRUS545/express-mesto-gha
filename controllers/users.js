const User = require("../models/users");
const ERROR_CODE = 400;
function getUsers(_req, res) {
  return User.find({})
    .then((data) => res.status(200).send(data))
    .catch((data) => {
      res.status(500).send({ message: data });
    });
}
function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((data) => {
      if(!data){
        res.status(400).send({ message:'Пользователь по указанному id не найден.'})
      }
      else{
        res.status(200).send({ message:data})}
      })

    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({ message:'Некорректный формат id.'})}
      else{
        res.status(500).send({ message: err.message });
      }
    });
}
function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => {
      res.status(200).send({message: data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError'){
        res.status(ERROR_CODE).send({ message: err.message });
      }
      else{
        res.status(500).send({ message: err.message });
      }


    });
}
function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((data) => {
      if(!data){
        res.status(404).send({ message:'Пользователь по указанному id не найден.'})
      }
      else{
        res.status(200).send(name, about);
      }

    })
    .catch((data) => {
      res.send(data)
      if (data.name === 'ValidationError'){
        return res.status(ERROR_CODE).send({ massege: data })}

      else{
      res.status(500).send({ message: data });
    }

    });
}
function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
  .then((data) => {
    if(!data){
      res.status(400).send({ message:'Пользователь по указанному id не найден.'})
    }
    else{
      res.status(200).send({ message: data });
    }

  })
  .catch((data) => {
    if (data.name === 'ValidationError'){
      return res.status(ERROR_CODE).send({ message: data })}

    else{
    res.status(500).send({ message: data });
  }

  });
}
module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};
