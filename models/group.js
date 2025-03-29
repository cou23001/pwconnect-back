// models/group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  stake: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stake', // Reference to the Stake model
      required: true,
  },
  ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward', // Reference to the Ward model
      required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
  },
  schedule: {
    type: String,
  },
  other_group_data: {
    type: Object,
  },
}, {
  timestamps: true,
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;