const HttpStatus = require('http-status-codes');
const jwt = require('../auth/jwt');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      throw new Error('Invalid jwt token');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(HttpStatus.UNAUTHORIZED).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;
