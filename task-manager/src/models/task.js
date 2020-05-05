const mongoose = require('mongoose');

const ModelNames = require('./names');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: ModelNames.User,
  },
},
// timestamps: true adds createdAt and updatedAt fields in DB
{
  timestamps: true,
});

const Task = mongoose.model(ModelNames.Task, taskSchema);

module.exports = Task;
