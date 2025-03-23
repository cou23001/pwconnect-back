// models/registration.js
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference to the Student model
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference to the Group model
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add an index for faster queries on studentId and groupId, and date.
registrationSchema.index({ studentId: 1, groupId: 1, date: 1 });

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
