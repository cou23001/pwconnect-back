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
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre('deleteOne', { document: true }, async function(next) {
    // 'this' refers to the student document
    console.log('Deleting user:', this.userId);
    console.log('Deleting address:', this.addressId);
    
    await Promise.all([
      User.deleteOne({ _id: this.userId }),
      Address.deleteOne({ _id: this.addressId })
    ]);
    next();
  });

module.exports = mongoose.model("Student", studentSchema);