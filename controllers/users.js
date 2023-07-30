
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { generateToken } = require('../utils/token');
const jwt = require('jsonwebtoken');
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
      if (!data) {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.status(200).send({ message: data });
      }
    })

    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Некорректный формат id.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
}
function createUser(req, res) {
  if(!req.body){
    res.status(400).send({ message:'Inavalif request body'});
    return;
  }
  const {
    email, password, name, about, avatar,
  } = req.body;

  if(!email || !password){
    res.status(400).send({ message:'Inavalif request body'});
    return;
  }
  User.findOne({ email })
  .then((user)=>{
    if(!user){
      bcrypt.hash(password, 10).then((hash) => {
        User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        })
    }).then((data) => {
      res.status(201).json({message:data.email,message:data.password});
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  }
  return  res.status(400).send({ message:'такой емаил уже зарегистрирован'});
})


  }
function login(req, res){
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //return Promise.reject(new Error('Неправильные почта или пароль'));
        res.status(400).json({ message:'Неправильные почта или пароль'+ user});
        return;
      }

      const result= bcrypt.compare(password, user.password);
      if(!result){
        res.status(400).json({message:'Неправильные почта или пароль'+ result});
        return;
      }
      const token = jwt.sign({_id:user._id}, 'secret key', { expiresIn: '7d' });
      res
        .cookie('jwt', token).json({token });

    })

    .catch((err) => {
      res
        .status(401)
        .json({ message: 'член'});

    });

};

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.status(200).send({ message: { name, about } });
      }
    })
    .catch((data) => {
      if (data.name === 'ValidationError') {
        res.status(400).send({ message: data.name });
      } else {
        res.status(500).send({ message: data });
      }
    });
}
function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.status(200).send({ message: { avatar } });
      }
    })
    .catch((data) => {
      if (data.name === 'ValidationError') {
        res.status(400).send({ message: data });
      } else {
        res.status(500).send({ message: data });
      }
    });
}
module.exports = {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  login,
  createUser
};
