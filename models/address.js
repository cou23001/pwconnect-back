// models/address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
    },
    neighborhood: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    postalCode: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);