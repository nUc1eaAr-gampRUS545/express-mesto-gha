const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser')

const { PORT = 3000} = process.env;
const app = express();
const routes = require('./routes/cards');
const routes2 = require('./routes/users');
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
    useUnifiedTopology:false,
  }
)}
main()


app.use((req, _res, next) => {
  req.user = {
    _id: '64b6c015f588f15e2b44d530'
  };

  next();
});
app.use(bodyParser.json());
app.use(routes2);
app.use(routes);


app.listen(PORT, () => {
  console.log('Сервер запущен');
});
