// models/student.js
const mongoose = require("mongoose");
const User = require("./user");
const Address = require("./address");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    birthDate: {
      type: Date,
    },
    phone: {
      type: String,
    },
    language: {
      type: String,
    },
    level: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre('deleteOne', { document: true }, async function(next) {
    // 'this' refers to the student document
    await Promise.all([
      User.deleteOne({ _id: this.userId }),
      Address.deleteOne({ _id: this.addressId })
    ]);
    next();
  });

module.exports = mongoose.model("Student", studentSchema);