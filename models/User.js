const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

// Add a toJSON transformation to exclude hashedPassword
userSchema.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.hashedPassword;
      return ret;
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;