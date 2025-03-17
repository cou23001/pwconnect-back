// models/userPermission.js
const mongoose = require('mongoose');

const userPermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure permission names are unique
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const UserPermission = mongoose.model('UserPermission', userPermissionSchema);

module.exports = UserPermission;