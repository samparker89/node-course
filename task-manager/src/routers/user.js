const express = require('express');

const User = require('../models/user');

const router = new express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).send(users);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((op) => allowedUpdates.includes(op));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update operations' });
  }

  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send();
    }

    return res.send(user);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
