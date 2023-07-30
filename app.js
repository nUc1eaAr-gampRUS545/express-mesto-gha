
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT = 3000 } = process.env;
const app = express();
// eslint-disable-next-line import/newline-after-impor

const { login, createUser } = require('./controllers/users');
const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');
const { authentiacateUser }= require('./middlewares/auth')
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: false });
}
main();

app.use(bodyParser.json());
app.use(cors())
app.post('/signup', createUser);
app.post('/signin', authentiacateUser, login);
app.use(routesUsers);
app.use(routesCards);
app.use((_req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен');
});
