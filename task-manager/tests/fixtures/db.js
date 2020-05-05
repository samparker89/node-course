const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Task = require('../../src/models/task');
const User = require('../../src/models/user');

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  name: 'Sam',
  email: 'sam@dwp.com',
  password: 'MyPass777!',
  tokens: [{
    token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
  }],
};

const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoID,
  name: 'Dave',
  email: 'dave@dwp.com',
  password: 'MyOtherPass777!',
  tokens: [{
    token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET),
  }],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  owner: userOneID,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  owner: userOneID,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  owner: userTwoID,
};

const setupDatabase = async () => {
  await Task.deleteMany();
  await User.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneID,
  userOne,
  userTwoID,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
