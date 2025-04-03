// models/user.js
const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
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
  type: {
    type: Number,
    // 1 = Student, 10 = Admin, 11 = Instructor
    enum: [1, 10, 11],
    required: true,
  },
}, {
  timestamps: true,
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