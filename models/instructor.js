// models/instructor.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wardId: {
        type: Schema.Types.ObjectId,
        ref: 'Ward',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Instructor', instructorSchema);