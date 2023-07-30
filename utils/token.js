/* eslint-disable keyword-spacing */

const nameKey = 'secret key';
function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return (jwt.verify(token, nameKey));
  }
  catch {
    return false;
  }
};
module.exports = {checkToken}