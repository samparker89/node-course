const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require('../auth/jwt');
const ModelNames = require('./names');
const Task = require('./task');

const userSchema = new mongoose.Schema({
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
    unique: true,
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

      if (value.toLowerCase()
        .includes('password')) {
        throw new Error('Password must not contain the word password');
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
  avatar: {
    type: Buffer,
  },
},
// timestamps: true adds createdAt and updatedAt fields in DB
{
  timestamps: true,
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return user;
};

// Creates relationship between user and task using id
userSchema.virtual('tasks', {
  ref: ModelNames.Task,
  localField: '_id',
  foreignField: 'owner',
});

// This will override the ToJSON method. Will only return public fields.
// This means we do not have to manually call a method to only return public data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Hash the password
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete tasks associated with user
userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model(ModelNames.User, userSchema);

module.exports = User;
