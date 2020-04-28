const express = require('express');
const Task = require('../models/task');

const router = new express.Router();

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      console.log('Could not find task with id:', id);
      return res.status(404).send();
    }
    return res.send(task);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
});


router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((op) => allowedUpdates.includes(op));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update operations' });
  }

  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).send();
    }
    return res.send(task);
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).send();
    }

    return res.send(task);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
