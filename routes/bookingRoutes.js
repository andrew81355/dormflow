const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    getBookingById,
    cancelBooking,
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');
// valid token for every route
router.use(auth);
router.get('/', getBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.delete('/:id', cancelBooking);
module.exports = router;