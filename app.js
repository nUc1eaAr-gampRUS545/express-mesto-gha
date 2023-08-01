
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookies=require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { PORT = 3000 } = process.env;
const app = express();
// eslint-disable-next-line import/newline-after-impor
const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');
const {createUser,login}=require('./controllers/users');
const { authentiacateUser }= require('./middlewares/auth');
const helmet = require('helmet');


mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: false });

app.use(helmet());
app.use(bodyParser.json());
app.use(cookies());
app.use(cors());

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users',authentiacateUser,routesUsers);
app.use('/cards',authentiacateUser,routesCards);

app.use((_req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен');
});
