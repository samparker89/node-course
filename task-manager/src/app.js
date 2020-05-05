const express = require('express');
require('./db/mongoose');

const errorHandler = require('./middleware/errorHandling/generic');
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');

const app = express();

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);
app.use(errorHandler);

module.exports = app;
