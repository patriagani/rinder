const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(9);

function encrypt(password){
  return bcrypt.hashSync(password, salt)
}
function checkHash(password,hash){
  return bcrypt.compareSync(password, hash)
}

function checkLogin(req, res, next) {
  if (req.session.user) {
    next()
  }
  else {
    res.redirect('/user/login')
  }
}

module.exports = {
    encrypt: encrypt,
    checkHash: checkHash,
    checkLogin: checkLogin
}