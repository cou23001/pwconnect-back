// models/group.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward", // Reference to the Ward model
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    room: {
      type: String,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor", // Reference to the Instructor model
      required: true,
    },
    sessions: [
      {
        number: { type: Number, required: true, min: 1, max: 25}, // 1 to 25
        date: { type: Date },
        topic: { type: String }, 
        completed: { type: Boolean, default: false }, 
        notes: { type: String }, 
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
