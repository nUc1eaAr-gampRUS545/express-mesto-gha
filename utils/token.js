/* eslint-disable keyword-spacing */
const jwt = require('jsonwebtoken');
const nameKey = 'secret key';
function generateToken(payload) {
  return jwt.sign({_id:payload}, nameKey, { expiresIn: '7d' });
};

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return(jwt.verify(token,nameKey))
  }
  catch {
    return false;
  }
};
module.exports = {generateToken,checkToken}