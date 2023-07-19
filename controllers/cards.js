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
      res.status(500).send({ massege: data });
    });
}

function createCard(req, res) {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
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

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        res.status(400).send({ message:"Такой карточки не сущесвует"});
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message:'Некорректный формат id.'})}
      else{
        res.status(500).send({ message: err.message });
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
        res.status(400).send({ message:"Такой карточки не сущесвует"});
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((err) => {

      if (err.kind === 'ObjectId') {
        res.status(400).send({ message:'Некорректный формат id.'})
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
        res.status(400).send({ message:"Такой карточки не сущесвует"});
      } else {
        res.status(200).send({ message: data });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message:'Некорректный формат id.'})
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
