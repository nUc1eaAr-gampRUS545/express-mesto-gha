const Card = require("../models/cards");
const ERROR_CODE = 400;
function getCards(_req, res) {
  return Card.find({})
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((data) => {
      res.status(500).send({ massege: data });
    });
}

function getCard(req, res) {
  return Card.findById(req.params.cardId)
    .then((data) => {
      if (!data) {
        res.send("Такого пользователя не сущесвует");
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((data) => {
      if (data.name === "SomeErrorName") {
        return res.status(ERROR_CODE).send({ massege: data });
      }
      res.status(500).send({ massege: data });
    });
}

function createCard(req, res) {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((data) => res.status(200).send({ message: data }))
    .catch((data) => {
      if (data.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: data });
      } else {
        res.status(500).send({ message: data });
      }
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        res.send("Такой карточки не сущесвует");
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((data) => {
      if (data.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: data });
      } else {
        res.status(500).send({ message: data });
      }
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        res.send("Такой карточки не сущесвует");
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((data) => {
      if (data.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: data });
      } else {
        res.status(500).send({ message: data });
      }
    });
}

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        res.send("Такой карточки не сущесвует");
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((data) => {
      if (data.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: data });
      } else {
        res.status(500).send({ message: data });
      }
    });

module.exports = {
  getCard,
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
