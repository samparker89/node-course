const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('Users', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isLength(value, { min: 7 })) {
        throw new Error('Password must be > 6 chars long');
      }

      if (value.toLowerCase().includes('password')) {
        throw new Error('Password must not contain the word password');
      }
    },
  },
});

module.exports = User;
