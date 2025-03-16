// models/user.js
const mongoose = require('mongoose');
const argon2 = require('argon2'); 

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
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await argon2.verify(this.password, password);
};
 
// Add a toJSON transformation to exclude hashedPassword
userSchema.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;