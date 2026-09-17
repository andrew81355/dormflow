const mongoose = require('mongoose');
const facilitySchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String, default: ""},
        location: {type: String, default: ""},
        capacity: {type: Number, default: 1},
        // unavailable is not open for booking
        available: {type: Boolean, default: true},
        slotMinutes: {type: Number, default: 60},
        // price per slot in euros, 0 means free
        pricePerSlot: {type: Number, default: 0},
    },
    {timestamps: true}
);
module.exports = mongoose.model('Facility', facilitySchema);