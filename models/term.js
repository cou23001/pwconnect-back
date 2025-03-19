// models/term.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const termSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
}, {
    timestamps: true
});