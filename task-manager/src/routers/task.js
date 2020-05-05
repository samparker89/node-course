const HttpStatus = require('http-status-codes');

const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

// GET /tasks?sortBy=completed&order=asc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};
  const {
    completed, limit, skip, sortBy,
  } = req.query;

  if (completed) {
    match.completed = completed === 'true';
  }

  if (sortBy) {
    const parts = sortBy.split(':');
    sort[parts[0]] = parts[1].toLowerCase() === 'desc' ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        sort,
      },
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return res.send(task);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
});

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body, // Copies all properties of body to object
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(HttpStatus.CREATED).send(task);
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.BAD_REQUEST).send(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((op) => allowedUpdates.includes(op));

  if (!isValidOperation) {
    return res.status(HttpStatus.BAD_REQUEST).send({ error: 'Invalid update operations' });
  }

  try {
    const { id } = req.params;
    const task = Task.find({ id, owner: req.user._id });

    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    return res.send(task);
  } catch (e) {
    console.log(e);
    return res.status(HttpStatus.BAD_REQUEST).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });

    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return res.send(task);
  } catch (e) {
    console.log(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
  }
});

module.exports = router;
