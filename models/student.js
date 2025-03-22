// models/student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);