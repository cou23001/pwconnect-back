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

studentSchema.post("deleteOne", async function (doc) {
  // This runs AFTER a student is deleted
  await User.deleteOne({ _id: doc.userId });
  await Address.deleteMany({ _id: doc.addressId });
});

module.exports = mongoose.model("Student", studentSchema);