
const Unauthorized=require('../utils/errors/unauthorized')
const JWT = require('jsonwebtoken');
 function authentiacateUser(req,res,next){
  const token = req.cookies.jwt;
  if(!token){
    next(new Unauthorized('Необходима авторизация'))
  }
  let payload;
  try {
    payload = JWT.verify(token,'some-secret-key');


  } catch (err) {
    next(new Unauthorized('Необходима авторизация'))
  }
  req.user=payload;
  next();


}
module.exports={ authentiacateUser }