const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: false });
}
main();

app.use((req, _res, next) => {
  req.user = { _id: '64b6c015f588f15e2b44d530' };
  next();
});
app.use(bodyParser.json());
app.use(routesUsers);
app.use(routesCards);
app.use((_req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен');
});
