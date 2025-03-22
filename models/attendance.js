// models/attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to the Student model
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Reference to the Group model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isPresent: {
    type: Boolean,
    default: false, // Default to absent
    required: true,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

// Add an index for faster queries on studentId and groupId, and date.
attendanceSchema.index({ studentId: 1, groupId: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;