const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { PORT = 3000 } = process.env;
const app = express();
// eslint-disable-next-line import/newline-after-import
const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const { authentiacateUser } = require('./middlewares/auth');
const { validateCreateUser, validateUserLogin } = require('./middlewares/validateJoi');
const NotFoundError = require('./utils/errors/not-found-error');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: false });

app.use(bodyParser.json());
app.use(cookies());
app.use(cors());
app.use(express.json());
app.use((_req, res, next) => {
  next(new NotFoundError('Данная страница по этому маршруту не найдена'));
});
app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateUserLogin, login);

app.use('/users', authentiacateUser, routesUsers);
app.use('/cards', authentiacateUser, routesCards);

app.use(errors());
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен');
});
