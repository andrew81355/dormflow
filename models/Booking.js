const mongoose = require('mongoose');
// booking of one facilit
const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        facilityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Facility',
            required: true,
        },
        startAt: {
            type: Date,
            required: true,
        },
        endAt: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Cancelled'],
            default: 'Active',
        },
    },
    { timestamps: true }
);

// not to be double booked
bookingSchema.index(
    { facilityId: 1, startAt: 1 },
    { unique: true, partialFilterExpression: { status: 'Active' } }
);
module.exports = mongoose.model('Booking', bookingSchema);