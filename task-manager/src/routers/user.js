/* eslint-disable no-underscore-dangle */
const express = require('express');
const HttpStatus = require('http-status-codes');
const sharp = require('sharp');

const auth = require('../middleware/auth');
const avatar = require('../middleware/avatar');
const GenericError = require('../middleware/errorHandling/error');
const User = require('../models/user');

const router = new express.Router();

router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
});

router.get('/users/:id/avatar', async (req, res) => {
  let user;

  try {
    user = await User.findById(req.params.id);
  } catch (e) {
    throw new GenericError();
  }

  if (!user || !user.avatar) {
    throw new GenericError(404);
  }

  res.set('Content-Type', 'image/jpg');

  res.send(user.avatar);
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.BAD_REQUEST).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (e) {
    return res.status(HttpStatus.BAD_REQUEST).send(e);
  }
});

router.post('/users/me/avatar', auth, avatar, async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({
      width: 300,
      height: 300,
    })
    .png()
    .toBuffer();

  req.user.avatar = buffer;
  await req.user.save();
  res.send(req.user);
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((op) => allowedUpdates.includes(op));

  if (!isValidOperation) {
    return res.status(HttpStatus.BAD_REQUEST).send({ error: 'Invalid update operations' });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    return res.send(req.user);
  } catch (e) {
    return res.status(HttpStatus.BAD_REQUEST).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    return res.send(req.user);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
  }
});

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
});

module.exports = router;
