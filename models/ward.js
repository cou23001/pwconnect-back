// models/ward.js
const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    stakeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stake',
        required: true,
    },
}, {
    timestamps: true,
});

const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;