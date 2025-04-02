// model/userRole.js
const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure each role name is unique
  },
  userPermissions: [{
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    }
  }],
}, { timestamps: true });

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
