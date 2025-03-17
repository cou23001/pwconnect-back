// models/userRole.js
const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure role names are unique
  },
  userPermissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserPermission', // Reference to the UserPermission model
  }],
}, { timestamps: true });

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;