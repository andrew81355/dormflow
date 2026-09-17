const Booking = require('../models/Booking');
function canAccess(user, booking) {
    return user.role === 'admin' || booking.userId.equals(user._id);
}
// create new book
async function createBooking(req, res, next) {
    try {
        const { facilityId, startAt, endAt } = req.body;
        if (!facilityId || !startAt || !endAt) {
            return res.status(400).json({ error: 'Facility, start time and end time are required' });
        }
        const start = new Date(startAt);
        const end = new Date(endAt);
        //  date becomes Invalid Date with NaN time
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Start and end time must be valid dates' });
        }
        if (end <= start) {

            return res.status(400).json({ error: 'End time must be after start time' });
        }
        if (start < new Date()) {
            return res.status(400).json({ error: 'Cannot book a time in the past' });
        }
        const overlapping = await Booking.findOne({
            facilityId,
            status: 'Active',
            startAt: { $lt: end },
            endAt: { $gt: start },
        });
        if (overlapping) {
            return res.status(409).json({ error: 'This time slot is already booked' });
        }
        const booking = await Booking.create({ userId: req.user._id, facilityId, startAt: start, endAt: end, });
        res.status(201).json(booking);

    } catch (err) {
        next(err);
    }
}

// list all 
async function getBookings(req, res, next) {
    try {

        const filt = req.user.role === 'admin' ? {} : { userId: req.user._id };
        const bookings = await Booking.find(filt).populate('facilityId', 'name location pricePerSlot').sort({ startAt: -1 });
        res.json(bookings);
    } catch (err) {
        next(err);
    }
}
// get booking by id
async function getBookingById(req, res, next) {
    try {
        const booking = await Booking.findById(req.params.id).populate('facilityId', 'name location pricePerSlot');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (!canAccess(req.user, booking)) {
            return res.status(403).json({ error: 'you can open only your own bookings' });
        }

        res.json(booking);
    } catch (err) {
        // 11000 duplicate key error in mongoose, when 2 at 1 time, database will let 1
        if (err.code === 11000) {
            return res.status(409).json({ error: 'This time slot is already booked' });
        }
        next(err);
    }
}
// cancel booking by id
async function cancelBooking(req, res, next) {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!canAccess(req.user, booking)) {
            return res.status(403).json({ error: 'you can cancel only your own bookings' });
        }
        if (booking.status === 'Cancelled') {
            return res.status(409).json({ error: 'This booking is already cancelled' });
        }
        // row stays to keep history complete
        booking.status = 'Cancelled';
        await booking.save();
        res.json(booking);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    cancelBooking,
};