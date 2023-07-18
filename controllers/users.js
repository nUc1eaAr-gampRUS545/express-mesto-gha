const User = require("../models/users");
const ERROR_CODE = 400;
function getUsers(_req, res) {
  return User.find({})
    .then((data) => res.status(200).send(data))
    .catch((data) => {
      if (data.name === "SomeErrorName") {
        return res.status(ERROR_CODE).send({ massege: data });
      }
      res.status(500).send({ massege: data });
    });
}
function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((data) => res.status(200).send(data))
    .catch((data) => {
      if (data.name === "SomeErrorName") {
        return res.status(ERROR_CODE).send({ massege: data });
      }
      res.status(500).send({ massege:data});
    });
}
function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((data) => {
      if (data.name === 'SomeErrorName'){
        return res.status(ERROR_CODE).send({ massege: data })}
        res.status(500).send({ massege: data });
    });
}
function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((data) => {
      if (data.name === 'SomeErrorName'){
        return res.status(ERROR_CODE).send({ massege: data })}
        res.status(500).send({ massege: data });
    });
}
function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((data) => {
      if (data.name === 'SomeErrorName'){
        return res.status(ERROR_CODE).send({ massege: data })}
        res.status(500).send({ massege: data });
    });
}
module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};
