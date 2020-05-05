const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const sign = (obj) => jwt.sign(obj, secret);

const verify = (token) => jwt.verify(token, secret);

module.exports = {
  sign,
  verify,
};
