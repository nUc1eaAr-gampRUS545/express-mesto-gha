
// eslint-disable-next-line no-unused-vars
const { checkToken } =  require('../utils/token');

 function authentiacateUser(req,res,next){
  /*const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(400).send({message:'Необходима авторизация'});

    return ;
  }*/
  /*const token = req.cookies.jwt;
  const result = checkToken(token)
  if(!result){
    res.status(401).send({message:'Некорректный токен'})
  }*/
  next()
}
module.exports={ authentiacateUser }