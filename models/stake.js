// models/stake.js
const mongoose = require('mongoose');

const stakeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    }, {
    timestamps: true,
    });

const Stake = mongoose.model('Stake', stakeSchema);

module.exports = Stake;