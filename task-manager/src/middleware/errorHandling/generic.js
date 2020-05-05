const HttpStatus = require('http-status-codes');

const genericErrorHandler = (error, req, res, next) => {
  const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal server error';

  res.status(status).send({ error: message });
};

module.exports = genericErrorHandler;
